import os
import pickle
import argparse
from tqdm import tqdm
from moviepy.editor import VideoFileClip

import pandas as pd
import numpy as np

import torch


def extract_frames(path_to_video: str, num_frames: int=5):
    video_clip = VideoFileClip(path_to_video)
    video_duration = video_clip.duration

    frame_times = np.linspace(0, video_duration, num_frames + 2)[1:-1]

    frames = []

    for time in frame_times:
        frame = video_clip.get_frame(time)
        frames.append(frame)

    return frames