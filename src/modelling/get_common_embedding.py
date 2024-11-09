import os
import shutil
import argparse
import numpy as np

def video_text_embedding(video_embedding_folder: str, text_embedding_folder: str, output_folder: str):
    os.makedirs(output_folder, exist_ok=True)

    for i in os.listdir(video_embedding_folder):
        video_embed = np.load(os.path.join(video_embedding_folder, i))[0]
        text_embed = np.load(os.path.join(text_embedding_folder, i))
        embedding = (video_embed + text_embed) / 2

        output_path = os.path.join(output_folder, i)
        np.save(output_path, embedding)
    
    # shutil.rmtree(video_embedding_folder)
    # shutil.rmtree(text_embedding_folder)

    print(f"Embeddings saved to {output_folder}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Combine video and text embeddings.")
    parser.add_argument("--video_embedding_folder", type=str, required=True, help="Path to folder with video embeddings")
    parser.add_argument("--text_embedding_folder", type=str, required=True, help="Path to folder with text embeddings")
    parser.add_argument("--output_folder", type=str, required=True, help="Path to save combined embeddings")

    args = parser.parse_args()
    video_text_embedding(args.video_embedding_folder, args.text_embedding_folder, args.output_folder)