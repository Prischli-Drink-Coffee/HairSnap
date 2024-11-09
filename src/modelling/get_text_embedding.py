import os
import pickle
import argparse
import pandas as pd
import numpy as np
from tqdm import tqdm
from sentence_transformers import SentenceTransformer

def get_text_pickle(path_to_pickle: str):
    with open(path_to_pickle, 'rb') as file:
        transcription = pickle.load(file)  # {candidate: transcription}
    
    candidates = np.array(list(transcription.keys()))
    texts = np.array(list(transcription.values()))
    return candidates, texts

def get_text_csv(path_to_csv: str, candidates: bool):
    # columns: [id, text]
    df = pd.read_csv(path_to_csv)

    if candidates:
        ids = df.iloc[:, 0].values
    else:
        ids = df.index
        ids = [1 + id_ for id_ in ids]

    texts = df.iloc[:, 1].values
    return ids, texts

def encode_text(path_to_texts: str, 
                device: str = 'cuda',
                batch_size: int = 8,
                candidates: bool = True,
                model_id: str = "all-MiniLM-L6-v2", 
                output_folder: str = 'data/train/'):
    
    filename, ext = os.path.splitext(os.path.basename(path_to_texts))
    if ext == '.pkl':
        ids, texts = get_text_pickle(path_to_texts)
        ids = [id_[:-4] for id_ in ids]
    elif ext == '.csv':
        ids, texts = get_text_csv(path_to_texts, candidates=candidates)
    else:
        raise ValueError('path_to_texts should be .csv or .pkl format')
    
    model = SentenceTransformer(model_id).to(device)
    embeddings_list = []
    
    for i in tqdm(range(0, len(texts), batch_size), desc="Encoding batches..."):
        batch = texts[i:i + batch_size].tolist()  # `SentenceTransformer.encode` expects a list of strings
        embeddings = model.encode(batch, device=device, convert_to_tensor=True)
        # normalize embeddings
        embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)
        embeddings_list.append(embeddings.cpu().numpy())  # Переводим на CPU и сохраняем как numpy
        
    embeddings_matrix = np.vstack(embeddings_list)

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for idx, id_ in enumerate(ids):
        embedding = embeddings_matrix[idx]
        output_path = os.path.join(output_folder, f"{id_}.npy")
        np.save(output_path, embedding)

    print(f'Embeddings saved at path: {output_folder}')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Encode texts to embeddings and save as numpy matrix.")
    parser.add_argument("--path_to_texts", type=str, required=True, 
                        help="Path to the .pkl or .csv file with texts.")
    parser.add_argument("--batch_size", type=int, default=8, 
                        help="Batch size for encoding.")
    parser.add_argument("--model_id", type=str, default="all-MiniLM-L6-v2", 
                        help="Model ID from Hugging Face for sentence embeddings.")
    parser.add_argument("--output_folder", type=str, default="data/train/", 
                        help="Folder where the embeddings matrix will be saved.")
    parser.add_argument('--disable_candidates', action='store_false', help="Отключить функцию (False, если флаг указан)")

    args = parser.parse_args()
    # device = 'cuda' if torch.cuda.is_available() else 'cpu'
    device = 'cpu'

    encode_text(path_to_texts=args.path_to_texts, 
                device=device, 
                candidates=args.disable_candidates,
                batch_size=args.batch_size, 
                model_id=args.model_id, 
                output_folder=args.output_folder
                )
