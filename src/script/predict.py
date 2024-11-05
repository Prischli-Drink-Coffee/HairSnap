import os
import torch

import numpy as np
import pandas as pd
import faiss
from transformers import (AutoTokenizer, AutoModelForSeq2SeqLM, 
                          CLIPProcessor, CLIPModel, 
                          Wav2Vec2Processor, Wav2Vec2Model)

from src import project_path
from src.script.embedding_generation import TagEmbeddingGeneration
from src.utils.string_filtration import process_single_text
from src.utils.custom_logging import setup_logging


log = setup_logging()


