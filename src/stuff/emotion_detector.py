import argparse
import os
import sys
import torch
import numpy as np
import pandas as pd
from moviepy.editor import VideoFileClip
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image

def extract_frames(video_path, num_frames=5):
    video_clip = VideoFileClip(video_path)
    video_duration = video_clip.duration
    
    # Равномерно распределяем кадры по всему видео
    frame_times = np.linspace(0, video_duration, num_frames + 2)[1:-1]  # пропускаем первый и последний элемент
    
    frames = []
    
    for time in frame_times:
        frame = video_clip.get_frame(time)
        frames.append(frame)
    
    return frames

def classify_emotions(frame, model, processor, id2label):
    image = Image.fromarray(frame)
    inputs = processor(images=image, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=-1).item()
    
    # Получаем название класса
    emotion = id2label[predicted_class]
    
    return emotion

def analyze_video_emotions(video_path):
    frames = extract_frames(video_path, num_frames=5)
    
    emotions = []
    
    for i, frame in enumerate(frames):
        emotion = classify_emotions(frame)
        emotions.append((f"Frame {i + 1}", emotion))
    
    return emotions

def main():
    parser = argparse.ArgumentParser(description="Convert video to audio and transcribe speech to text.")
    
    # Параметры для видеофайла или папки
    parser.add_argument("--video_file_path", type=str, help="Path to the video file.")
    parser.add_argument("--table_path", type=str, default="data/candidates_emotions.csv", help="Path to save the transcription table (.csv).")
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    args = parser.parse_args()

    processor = AutoImageProcessor.from_pretrained("dima806/facial_emotions_image_detection")
    model = AutoModelForImageClassification.from_pretrained("dima806/facial_emotions_image_detection")

    labels_list = ['sad', 'disgust', 'angry', 'neutral', 'fear', 'surprise', 'happy']
    id2label = {i: label for i, label in enumerate(labels_list)}

    frames = extract_frames(args.video_file_path, num_frames=5)
    emotions = [classify_emotions(frame, model, processor, id2label) for frame in frames]
    print('Emotions:', ', '.join(emotions))
    
    filename = os.path.splitext(os.path.basename(args.video_file_path))[0]
    data = pd.DataFrame({'candidate': [filename]*len(emotions), 
                         'frame': np.arange(emotions)+1,
                         'emotion': emotions})
    
    if os.path.exists(args.table_path):
        table = pd.read_csv(args.table_path)
        data = pd.concat((table, data))
    
    data.to_csv(args.table_path, index=False)
    

if __name__ == "__main__":
    main()