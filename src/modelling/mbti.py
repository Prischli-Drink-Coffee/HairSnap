import os
import argparse
import numpy as np
import pandas as pd
import pickle
import warnings
warnings.filterwarnings("ignore")

from src.modelling.submit import compute_similarity_matrix, compute_pearson_matrix

def get_mbti_name(mbti_type):
    mbti_descriptions = {
        "INTJ": "Architect",
        "INTP": "Logician",
        "ENTJ": "Commander",
        "ENTP": "Debater",
        "INFJ": "Advocate",
        "INFP": "Mediator",
        "ENFJ": "Protagonist",
        "ENFP": "Campaigner",
        "ISTJ": "Inspector",
        "ISFJ": "Defender",
        "ESTJ": "Executive",
        "ESFJ": "Consul",
        "ISTP": "Virtuoso",
        "ISFP": "Adventurer",
        "ESTP": "Entrepreneur",
        "ESFP": "Entertainer"
    }

    return mbti_descriptions.get(mbti_type.upper(), "Unknown type")

def ocean_to_mbti_vector(ocean_vector):
    correlation_matrix = pd.DataFrame({
        "E-I": np.array([0.03, -0.08, 0.74, 0.03, -0.16]),
        "S-N": np.array([-0.72, 0.15, -0.10, -0.04, 0.06]),
        "T-F": np.array([-0.02, 0.15, -0.19, -0.44, -0.06]),
        "J-P": np.array([-0.30, 0.49, -0.15, 0.06, -0.11])
    }, index=['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'])

    mbti_vector = []
    for scale, weights in correlation_matrix.items():
        ocean_vector = ocean_vector > 0.5
        mbti_vector.append(np.dot(ocean_vector, weights))
    return mbti_vector


def ocean_to_mbti(ocean_vector):
    correlation_matrix = pd.DataFrame({
        "E-I": np.array([0.03, -0.08, 0.74, 0.03, -0.16]),
        "S-N": np.array([-0.72, 0.15, -0.10, -0.04, 0.06]),
        "T-F": np.array([-0.02, 0.15, -0.19, -0.44, -0.06]),
        "J-P": np.array([-0.30, 0.49, -0.15, 0.06, -0.11])
    }, index=['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'])


    mbti_vector = {}
    
    # Рассчитываем значение каждой шкалы MBTI
    for scale, weights in correlation_matrix.items():
        ocean_vector = ocean_vector > 0.5
        mbti_vector[scale] = np.dot(ocean_vector, weights)
    
    mbti_type = (
        "E" if mbti_vector["E-I"] > 0 else "I",
        "N" if mbti_vector["S-N"] > 0 else "S",
        "F" if mbti_vector["T-F"] > 0 else "T",
        "P" if mbti_vector["J-P"] > 0 else "J",
    )

    mbti_type = "".join(mbti_type)
    
    return f"{get_mbti_name(mbti_type)} ({mbti_type})"


def compute_mbti(user_embedding_folder, type_embeddings_folder, metric='cosine'):
    candidates_emb = []
    user_ids = []
    for i in os.listdir(user_embedding_folder):
        full_path = os.path.join(user_embedding_folder, i)
        if not os.path.isdir(full_path):
            emb = np.load(full_path)
            candidates_emb.append(emb)
            user_ids.append(f'{i[:-4]}.mp4')
    user_embedding = np.array(candidates_emb)

    types_emb = []
    for i in os.listdir(type_embeddings_folder):
        emb = np.load(os.path.join(type_embeddings_folder, i))
        types_emb.append(emb)
    type_embeddings = np.array(types_emb)

    if metric == 'cosine':
        similarity_matrix = compute_similarity_matrix(user_embedding, type_embeddings)
    elif metric == 'pearson':
        similarity_matrix = compute_pearson_matrix(user_embedding, type_embeddings)

    mbti_char = np.array([ocean_to_mbti(similarity_matrix[i]) for i in range(len(similarity_matrix))])
    user_mbti_dict = dict(zip(user_ids, mbti_char))
    return user_mbti_dict

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Compute MBTI similarity based on embeddings.")
    parser.add_argument("user_embedding_folder", type=str, help="Path to folder with user embeddings (.npy files).")
    parser.add_argument("type_embeddings_folder", type=str, help="Path to folder with type embeddings (.npy files).")
    parser.add_argument("--metric", type=str, choices=['cosine', 'pearson'], default='cosine',
                        help="Similarity metric to use ('cosine' or 'pearson').")
    parser.add_argument("--o", type=str, default="mbti_results.pkl", help="Output file name for saving the results in pkl format.")
    
    args = parser.parse_args()
    
    result = compute_mbti(args.user_embedding_folder, args.type_embeddings_folder, args.metric)

    with open(args.o, 'wb') as f:
        pickle.dump(result, f)
    print(f"Results saved to {args.o}")
