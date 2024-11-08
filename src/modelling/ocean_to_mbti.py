import numpy as np
import pandas as pd

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


def ocean_to_mbti(ocean_vector):
    correlation_matrix = pd.DataFrame({
        "E-I": np.array([-0.74, 0.03, -0.03, 0.08, 0.16]),
        "S-N": np.array([0.10, 0.72, 0.04, -0.15, -0.06]),
        "T-F": np.array([0.19, 0.02, 0.44, -0.15, 0.06]),
        "J-P": np.array([0.15, 0.30, -0.06, -0.49, 0.11]),
    }, index = ['Extraversion', 'Openness', 'Agreeableness', 'Conscientiousness', 'Neuroticism'])

    mbti_vector = {}
    
    # Рассчитываем значение каждой шкалы MBTI
    for scale, weights in correlation_matrix.items():
        mbti_vector[scale] = np.dot(ocean_vector, weights)
    
    mbti_type = (
        "E" if mbti_vector["E-I"] > 0.5 else "I",
        "N" if mbti_vector["S-N"] > 0.5 else "S",
        "F" if mbti_vector["T-F"] > 0.5 else "T",
        "P" if mbti_vector["J-P"] > 0.5 else "J",
    )

    mbti_type = "".join(mbti_type)
    
    return mbti_type, get_mbti_name(mbti_type)
