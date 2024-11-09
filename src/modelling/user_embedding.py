import os
import shutil
import argparse
import numpy as np
import torch
from torchvision import transforms
from PIL import Image
from sentence_transformers import SentenceTransformer
from cosmos_tokenizer.video_lib import CausalVideoTokenizer
from src.modelling.video_to_text import load_models, video2audio, audio2text
from src.modelling.get_frames import extract_frames_ffmpeg
from src.modelling.get_video_embedding import UNet3D

def get_user_embedding(video_path, 
                       unet_weights_path: str = 'src/weights/Unet3D.pth', 
                       output_embedding_path: str = None, 
                       frames_temp_folder: str = 'temp',
                       audio_temp_folder: str = 'temp',
                       num_frames: int = 16):

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # 1. Нарезаем видео на кадры (16 кадров)
    extract_frames_ffmpeg(video_path=video_path, output_dir=frames_temp_folder)
    transform = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor()])

    frames = []
    frames_path = os.path.join(frames_temp_folder, os.path.splitext(os.path.basename(video_path))[0])
    frame_files = sorted([f for f in os.listdir(frames_path) if f.endswith('.jpg')])
    selected_files = frame_files[:num_frames] if len(frame_files) >= num_frames else frame_files + [frame_files[-1]] * (num_frames - len(frame_files))

    for img_name in selected_files:
        img_path = os.path.join(frames_path, img_name)
        img = Image.open(img_path).convert('RGB')
        frames.append(transform(img))
    
    # Получаем из него вектор размера (1, C, num_frames, H, W)
    video_tensor = torch.stack(frames).unsqueeze(0).permute(0, 2, 1, 3, 4).to(device).to(torch.float32)
    
    # и удаляем картинки
    shutil.rmtree(frames_temp_folder)

    # 2. Пропускаем вектор видео через CosmosTokenizer -> получаем матричное сжатое представление размера (1, num_frames, 5, 28, 28)
    encoder = CausalVideoTokenizer(checkpoint_enc="pretrained_ckpts/Cosmos-Tokenizer-CV4x8x8/encoder.jit").to(device)
    with torch.cuda.amp.autocast():
        embedding = encoder.encode(video_tensor)[0]
    
    # 3. Пропускаем сжатое представление через Unet, получаем видео-эмбеддинг размера 384
    unet = UNet3D(in_channels=5, out_channels=1, base_filters=32, latent_dim=384).to(device)
    unet.load_state_dict(torch.load(unet_weights_path, map_location=device))
    unet.eval()

    with torch.no_grad():
        _, video_embedding = unet(embedding.to(torch.float32))
        video_embedding = video_embedding.cpu().numpy().squeeze(0)
    
    # 4. Достаем из видео аудио
    audio_path = video2audio(path_to_video=video_path, audio_folder=audio_temp_folder)

    # 5. Транскрибируем аудио и удаляем аудио
    processor, model = load_models(model_id="facebook/wav2vec2-large-960h-lv60-self", device=device)
    predicted_sentence = audio2text(path_to_audio=audio_path, path_to_table_speech=None, 
                                    processor=processor, model=model, 
                                    device=device, save_table=False)
    shutil.rmtree(audio_temp_folder)
    
    # 6. Получаем текстовый эмбеддинг
    bert = SentenceTransformer("all-MiniLM-L6-v2").to(device)
    text_embedding = bert.encode(predicted_sentence, device=device, convert_to_tensor=True).cpu().numpy()

    # 7. Итоговое представление кандидата
    video_embedding = video_embedding / np.linalg.norm(video_embedding, keepdims=True)
    text_embedding = text_embedding / np.linalg.norm(text_embedding, keepdims=True)
    embedding = (text_embedding + video_embedding) / 2

    if output_embedding_path is not None:
        np.save(output_embedding_path, embedding)
        print(f"Saved embedding to {output_embedding_path}")
    
    return embedding

video_path = 'data/train/video/zyGz_H1UTnQ.003.mp4'

get_user_embedding(video_path=video_path)