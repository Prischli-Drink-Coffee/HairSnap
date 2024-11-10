import argparse
import os
import numpy as np
from tqdm import tqdm
import pickle
from scipy.stats import pearsonr
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import euclidean_distances

import warnings
warnings.filterwarnings("ignore")

def load_type_embeddings(type_embeddings_folder, threshold=16):
    return np.array([
        np.load(os.path.join(type_embeddings_folder, file))
        for file in os.listdir(type_embeddings_folder)
        if file.endswith('.npy')
    ])


def compute_similarity_matrix(user_embeddings, type_embeddings):
    return (cosine_similarity(user_embeddings, type_embeddings) + 1) / 2


def compute_pearson_matrix(user_embeddings, type_embeddings):
    similarity = []
    for user_embedding in user_embeddings:
        similarity_vector = []
        for type_embedding in type_embeddings:
            corr, _ = pearsonr(user_embedding, type_embedding)
            similarity_vector.append((corr + 1) / 2)  # Преобразуем корреляцию в диапазон [0, 1]
        similarity.append(similarity_vector)
    return np.array(similarity)

def compute_euclidean_similarity(user_embeddings, type_embeddings):
    dist_matrix = euclidean_distances(user_embeddings, type_embeddings)
    return np.exp(-dist_matrix)  # нормализуем экспоненциальной функцией


def submit(user_embedding_folder, type_embeddings_folder, metric='cosine'):
    type_embeddings = load_type_embeddings(type_embeddings_folder)
    ocean_traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
    
    # Вычисляем матрицу сходства для каждого пользователя
    similarity_matrix = []
    user_ids = []
    for user_file in tqdm(os.listdir(user_embedding_folder)):
        if user_file.endswith('.npy'):
            user_embedding = np.load(os.path.join(user_embedding_folder, user_file))
            if metric == 'cosine':
                similarity_vector = compute_similarity_matrix(user_embedding.reshape(1, -1), type_embeddings)[0]
            elif metric == 'pearson':
                similarity_vector = compute_pearson_matrix(user_embedding.reshape(1, -1), type_embeddings)[0]
            elif metric == 'euclidean':
                similarity_vector = compute_euclidean_similarity(user_embedding.reshape(1, -1), type_embeddings)[0]
            else:
                raise ValueError("Unsupported metric! Use 'cosine' or 'pearson'.")
            similarity_matrix.append(similarity_vector)
            user_ids.append(f'{user_file[:-4]}.mp4')
    
    submit_dict = {
        trait: {user_ids[i]: similarity_matrix[i][j] for i in range(len(user_ids))}
        for j, trait in enumerate(ocean_traits)
    }
    
    return submit_dict


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Compute MBTI similarity based on embeddings.")
    parser.add_argument("user_embedding_folder", type=str, help="Path to folder with user embeddings (.npy files).")
    parser.add_argument("type_embeddings_folder", type=str, help="Path to folder with type embeddings (.npy files).")
    parser.add_argument("--metric", type=str, choices=['cosine', 'pearson', 'euclidean'], default='cosine',
                        help="Similarity metric to use ('cosine' or 'pearson').")
    parser.add_argument("--o", type=str, default="similarity_results.pkl", help="Output file name for saving the results in pkl format.")
    
    args = parser.parse_args()
    
    result = submit(args.user_embedding_folder, args.type_embeddings_folder, args.metric)

    with open(args.o, 'wb') as f:
        pickle.dump(result, f)
    print(f"Results saved to {args.o}")
    