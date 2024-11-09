import os
import argparse
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
from tqdm import tqdm
from cosmos_tokenizer.video_lib import CausalVideoTokenizer

# Датасет для CausalVideoTokenizer
class VideoFrameDataset(Dataset):
    def __init__(self, data_dir, num_frames=16):
        self.data_dir = data_dir
        self.video_ids = [video_id for video_id in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, video_id))]
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor()
        ])

        self.num_frames = num_frames

    def __len__(self):
        return len(self.video_ids)

    def __getitem__(self, idx):
        video_id = self.video_ids[idx]
        video_path = os.path.join(self.data_dir, video_id)
        
        frames = []
        frame_files = sorted(os.listdir(video_path))
        
        # Получаем нужное количество кадров
        selected_files = frame_files[:self.num_frames] if len(frame_files) >= self.num_frames else frame_files + [frame_files[-1]] * (self.num_frames - len(frame_files))

        for img_name in selected_files:
            img_path = os.path.join(video_path, img_name)
            if img_name.endswith('.jpg'):
                img = Image.open(img_path).convert('RGB')
                if self.transform:
                    img = self.transform(img)
                frames.append(img)
        
        video_tensor = torch.stack(frames).permute(1, 0, 2, 3)
        return video_tensor


# Датасет для Автоэнкодера
class EmbeddingDataset(Dataset):
    def __init__(self, embeddings):
        self.embeddings = embeddings

    def __len__(self):
        return len(self.embeddings)

    def __getitem__(self, idx):
        return self.embeddings[idx]


class UNet3D(nn.Module):
    def __init__(self, in_channels, out_channels, base_filters=32):
        super(UNet3D, self).__init__()   

        # Encoder
        self.enc1 = self.conv_block(in_channels, base_filters)
        self.enc2 = self.conv_block(base_filters, base_filters * 2)
        self.enc3 = self.conv_block(base_filters * 2, base_filters * 4)
        
        # Decoder
        self.upconv2 = nn.ConvTranspose3d(base_filters * 4, base_filters * 2, kernel_size=2, stride=2)
        self.dec2 = self.conv_block(base_filters * 4, base_filters * 2)
        self.upconv1 = nn.ConvTranspose3d(base_filters * 2, base_filters, kernel_size=2, stride=2)
        self.dec1 = self.conv_block(base_filters * 2, base_filters)
        
        # Output
        self.out_conv = nn.Conv3d(base_filters, out_channels, kernel_size=1)
        
    def conv_block(self, in_channels, out_channels, kernel_size=3, padding=1):
        return nn.Sequential(
            nn.Conv3d(in_channels, out_channels, kernel_size=kernel_size, padding=padding),
            nn.BatchNorm3d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv3d(out_channels, out_channels, kernel_size=kernel_size, padding=padding),
            nn.BatchNorm3d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        # Encoder
        x = x.permute(0, 2, 1, 3, 4)
        enc1 = self.enc1(x)
        enc2 = self.enc2(F.max_pool3d(enc1, 2))
        enc3 = self.enc3(F.max_pool3d(enc2, 2))
        
        # Decoder
        up2 = self.upconv2(enc3)
        dec2 = self.dec2(torch.cat([up2, enc2], dim=1))
        up1 = self.upconv1(dec2)
        dec1 = self.dec1(torch.cat([up1, enc1], dim=1))
        
        # Output
        out = self.out_conv(dec1)
        out = out.permute(0, 2, 1, 3, 4)
        return out, enc3

def train_autoencoder(model, data_loader, num_epochs, learning_rate, device, weights_path):
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    best_loss = float('inf')  # Инициализация лучшей ошибки как бесконечность

    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0

        for inputs in data_loader:
            inputs = inputs.to(device)
            inputs = inputs.to(torch.float32)
            optimizer.zero_grad()
            
            outputs, _ = model(inputs)
            loss = criterion(outputs, inputs)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()

        epoch_loss = running_loss / len(data_loader)
        print(f"Epoch [{epoch + 1}/{num_epochs}], Loss: {epoch_loss:.4f}")

        # Сохраняем модель с наименьшей ошибкой
        if epoch_loss < best_loss:
            best_loss = epoch_loss
            torch.save(model.state_dict(), weights_path)
            print(f"Saved best model with loss: {best_loss:.4f}")

def eval_autoencoder(model, data_loader, ids, embeddings_path, device):
    model.eval()  # Переводим модель в режим оценки

    os.makedirs(embeddings_path, exist_ok=True)  # Создаем директорию, если ее нет

    with torch.no_grad():
        for idx, inputs in tqdm(enumerate(data_loader), total=len(data_loader)):
            inputs = inputs.to(device).to(torch.float32)
            _, outputs = model(inputs).cpu()  # Перемещаем на CPU
            print(outputs.shape)
            
            # Конвертируем тензор в numpy и сохраняем как .npy файл
            output_numpy = outputs.numpy()
            file_path = os.path.join(embeddings_path, f'{ids[idx]}.npy')
            np.save(file_path, output_numpy)  # Сохраняем массив как .npy

    print(f'Saved embedding to {embeddings_path}')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train a video autoencoder with embeddings.")
    parser.add_argument('--data_dir', type=str, required=True, help="Path to the video frames directory")
    parser.add_argument('--batch_size', type=int, default=4, help="Batch size for DataLoader")
    parser.add_argument('--num_frames', type=int, default=16, help="Number of frames per video")
    parser.add_argument('--num_epochs', type=int, default=20, help="Number of training epochs")
    parser.add_argument('--learning_rate', type=float, default=1e-3, help="Learning rate for the optimizer")
    parser.add_argument('--weights_path', type=str, required=True, help="Path to save the best model weights")
    parser.add_argument('--embeddings_path', type=str, required=True, help="Path to save embeddings")
    parser.add_argument('--model_state', type=str, default="train", required=True, help="Train or inference")
    args = parser.parse_args()

    # Параметры
    dataset = VideoFrameDataset(args.data_dir, num_frames=args.num_frames)
    data_loader = DataLoader(dataset, batch_size=args.batch_size, shuffle=False, num_workers=2)

    # Инициализация токенизатора
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    encoder = CausalVideoTokenizer(checkpoint_enc=f'pretrained_ckpts/Cosmos-Tokenizer-CV4x8x8/encoder.jit').to(device)

    # Создаем эмбеддинги и сохраняем их
    embeddings = []
    with torch.no_grad():
        for batch in tqdm(data_loader):
            batch = batch.to(device).to(torch.float32)
            with torch.cuda.amp.autocast():
                out = encoder.encode(batch)[0]
            embeddings.append(out.cpu())
    
    del encoder

    # Объединяем эмбеддинги в один тензор
    embeddings = torch.cat(embeddings, dim=0)

    embedding_dataset = EmbeddingDataset(embeddings)
    if args.model_state == 'train':
        embedding_loader = DataLoader(embedding_dataset, batch_size=args.batch_size, shuffle=True)
    elif args.model_state == 'inference':
        embedding_loader = DataLoader(embedding_dataset, batch_size=args.batch_size, shuffle=False)

    # Инициализация автоэнкодера
    num_frames, hid_dim = embeddings.shape[1], embeddings.shape[2]
    model = UNet3D(in_channels=5, out_channels=1, base_filters=32).to(device)
    model = model.to(torch.float32)

    if args.model_state == 'train':
        train_autoencoder(model, embedding_loader, num_epochs=args.num_epochs, learning_rate=args.learning_rate, device=device, weights_path=args.weights_path)
    elif args.model_state == 'inference':
        model.load_state_dict(torch.load(args.weights_path, map_location=device))
        eval_autoencoder(model=model, data_loader=embedding_loader, ids=dataset.video_ids, device=device, embeddings_path=args.embeddings_path)
