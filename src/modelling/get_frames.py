import os
import subprocess
import argparse
from tqdm import tqdm
import math

def extract_frames_ffmpeg(video_path, output_dir, num_frames=16, frame_size=(224, 224)):
    # Get video ID from the filename (without extension)
    video_id = os.path.splitext(os.path.basename(video_path))[0]

    if not os.path.exists(os.path.join(output_dir, video_id)) or not len(os.listdir(os.path.join(output_dir, video_id))) == 15:
        # Create the output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(os.path.join(output_dir, video_id), exist_ok=True)

        # ffmpeg command to extract frames
        command = [
            "ffmpeg", "-i", video_path,
            "-vf", f"fps=10, scale={frame_size[0]}:{frame_size[1]}",
            "-vsync", "vfr",
            os.path.join(output_dir, video_id, f"%03d.jpg")
        ]
        
        # Run the command
        subprocess.run(command, check=True)


def process_videos(input_dir, output_dir):
    # Get list of all .mp4 video files in the input directory
    video_files = [f for f in os.listdir(input_dir) if f.endswith('.mp4')]
    
    # Process each video file
    for video_file in tqdm(video_files, desc="Processing videos"):
        video_path = os.path.join(input_dir, video_file)
        extract_frames_ffmpeg(video_path, output_dir)

def main():
    # Set up argument parsing
    parser = argparse.ArgumentParser(description="Extract 16 frames from each video using ffmpeg.")
    parser.add_argument("input_dir", type=str, help="Directory containing input .mp4 video files.")
    parser.add_argument("output_dir", type=str, help="Directory to save the extracted frames.")
    
    args = parser.parse_args()

    # Call the video processing function
    process_videos(args.input_dir, args.output_dir)

if __name__ == "__main__":
    main()