import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from tqdm import tqdm
import numpy as np
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
from torch.optim.lr_scheduler import ReduceLROnPlateau
from src import project_path
from src.utils.custom_logging import setup_logging
from pathlib import Path
from src.modelling.video_dataset import get_datasets, collate_fn
from datetime import datetime
from transformers import AutoModelForSequenceClassification, AutoConfig, AutoModelForSeq2SeqLM, AutoTokenizer
from functools import partial
from src.utils.attention_module import AttentionLayer
from sklearn.metrics.pairwise import cosine_distances as cosine
import torch.nn.functional as F

log = setup_logging()





if __name__ == "__main__":
    from src import path_to_config
    from src.utils.config_parser import ConfigParser
    from env import Env

    env = Env()
    config = ConfigParser.parse(path_to_config())

    train_config = config.get('TrainParam', {})

