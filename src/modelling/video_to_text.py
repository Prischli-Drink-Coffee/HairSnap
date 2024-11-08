import os
import sys
import argparse
import pandas as pd
import torch
import torchaudio
from moviepy.editor import VideoFileClip
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

def video2audio(path_to_video: str, audio_folder: str):
    """Convert .mp4 to .wav"""
    if not os.path.exists(audio_folder):
        os.makedirs(audio_folder)
    
    filename = os.path.splitext(os.path.basename(path_to_video))[0]
    audio_path = os.path.join(audio_folder, f"{filename}.wav")

    clip = VideoFileClip(path_to_video)
    clip.audio.write_audiofile(audio_path, codec='pcm_s16le')

    return audio_path

def load_models(model_id, device):
    processor = Wav2Vec2Processor.from_pretrained(model_id)
    model = Wav2Vec2ForCTC.from_pretrained(model_id).to(device)
    return processor, model

def audio2text(path_to_audio: str, path_to_table_speech: str,
               processor: Wav2Vec2Processor, model: Wav2Vec2ForCTC,
               device: str = 'cuda'):
    # Загружаем аудио
    speech_array, sampling_rate = torchaudio.load(path_to_audio)
    
    # Преобразуем в моно, если аудио многоканальное
    if speech_array.shape[0] > 1:
        speech_array = torch.mean(speech_array, dim=0, keepdim=True)
    
    # Убедимся, что частота дискретизации равна 16000 Гц
    if sampling_rate != 16000:
        resampler = torchaudio.transforms.Resample(orig_freq=sampling_rate, new_freq=16000)
        speech_array = resampler(speech_array)
    
    # Обработка с помощью процессора модели
    inputs = processor(speech_array.squeeze().numpy(), sampling_rate=16000, return_tensors="pt", padding=True)
    inputs.input_values = inputs.input_values.to(device)
    inputs.attention_mask = inputs.attention_mask.to(device)
    
    # Получаем логиты и предсказания модели
    with torch.no_grad():
        logits = model(inputs.input_values, attention_mask=inputs.attention_mask).logits
    predicted_id = torch.argmax(logits, dim=-1)
    predicted_sentence = processor.batch_decode(predicted_id)[0]
    
    # Сохраняем результат в таблицу
    filename = os.path.splitext(os.path.basename(path_to_audio))[0]
    data = pd.DataFrame({'candidate': [filename], 'speech': [predicted_sentence]})
    if os.path.exists(path_to_table_speech):
        table = pd.read_csv(path_to_table_speech)
        data = pd.concat((table, data))
    data.to_csv(path_to_table_speech, index=False)

    return predicted_sentence

# model ids
# MODEL_ID = "jonatasgrosman/wav2vec2-xls-r-1b-russian"   # 3.85 Gb
# MODEL_ID = "jonatasgrosman/wav2vec2-large-xlsr-53-russian"  # 1.2 Gb
# MODEL_ID = "emre/wav2vec2-xls-r-300m-Russian-small"   # 1.2 Gb

def main():
    parser = argparse.ArgumentParser(description="Convert video to audio and transcribe speech to text.")
    parser.add_argument("video_path", type=str, help="Path to the video file.")
    parser.add_argument("table_path", type=str, help="Path to save the transcription table (CSV).")
    parser.add_argument("--audio_folder", type=str, default="data/temp_audio", help="Temporary folder to store audio files.")
    
    device = "cuda" if torch.cuda.is_available() else "cpu"

    args = parser.parse_args()

    # Загрузка модели и процессора
    processor, model = load_models("jonatasgrosman/wav2vec2-large-xlsr-53-russian", 
                                   device)
    
    # Конвертация видео в аудио
    audio_path = video2audio(args.video_path, args.audio_folder)
    
    # Конвертация аудио в текст и запись в таблицу
    print("Transcribing audio...")
    transcript = audio2text(audio_path, args.table_path, processor, model, device)
    print("Transcription complete:", transcript)

    # Удаление временного аудиофайла
    os.remove(audio_path)
    print("Temporary audio file removed.")

if __name__ == "__main__":
    main()
