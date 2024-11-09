import os
import argparse
import torch
import torch.nn as nn
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


class VideoAutoencoder(nn.Module):
    def __init__(self, num_frames, hid_dim, latent_dim=384):
        super(VideoAutoencoder, self).__init__()
        
        # Энкодер
        self.encoder_conv = nn.Sequential(
            nn.Conv3d(in_channels=num_frames, out_channels=64, kernel_size=3, stride=2, padding=1),
            nn.ReLU(),
            nn.Conv3d(64, 128, kernel_size=3, stride=2, padding=1),
            nn.ReLU(),
            nn.Conv3d(128, 256, kernel_size=3, stride=2, padding=1),
            nn.ReLU(),
            nn.Flatten()
        )
        
        # Полносвязный слой для перехода к латентному представлению
        self.fc_enc = nn.Linear(256 * (num_frames // 8) * 4 * 4, latent_dim)
        
        # Декодер
        self.fc_dec = nn.Linear(latent_dim, 256 * (num_frames // 8) * 4 * 4)
        
        self.decoder_conv = nn.Sequential(
            nn.ConvTranspose3d(256, 128, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.ReLU(),
            nn.ConvTranspose3d(128, 64, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.ReLU(),
            nn.ConvTranspose3d(64, hid_dim, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.Sigmoid()  # Используем Sigmoid, если значения на выходе должны быть в диапазоне [0, 1]
        )

        self.num_frames = num_frames

    def encode(self, x):
        x = self.encoder_conv(x)
        x = self.fc_enc(x)
        return x

    def decode(self, z):
        z = self.fc_dec(z)
        z = z.view(-1, 256, self.num_frames // 8, 4, 4)  # Изменяем размер для 3D декодера
        z = self.decoder_conv(z)
        return z

    def forward(self, x):
        latent = self.encode(x)
        reconstructed = self.decode(latent)
        return reconstructed, latent

def train_autoencoder(model, data_loader, num_epochs, learning_rate, device):
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        for inputs in data_loader:
            inputs = inputs.to(device)
            optimizer.zero_grad()
            
            outputs, _ = model(inputs)
            loss = criterion(outputs, inputs)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
        
        print(f"Epoch [{epoch + 1}/{num_epochs}], Loss: {running_loss / len(data_loader):.4f}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train a video autoencoder with embeddings.")
    parser.add_argument('--data_dir', type=str, required=True, help="Path to the video frames directory")
    parser.add_argument('--batch_size', type=int, default=4, help="Batch size for DataLoader")
    parser.add_argument('--num_frames', type=int, default=16, help="Number of frames per video")
    parser.add_argument('--num_epochs', type=int, default=20, help="Number of training epochs")
    parser.add_argument('--learning_rate', type=float, default=1e-3, help="Learning rate for the optimizer")
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

    # Объединяем эмбеддинги в один тензор
    embeddings = torch.cat(embeddings, dim=0)

    embedding_dataset = EmbeddingDataset(embeddings)
    embedding_loader = DataLoader(embedding_dataset, batch_size=args.batch_size, shuffle=True)

    # Инициализация автоэнкодера
    num_frames, hid_dim = embeddings.shape[1], embeddings.shape[2]
    model = VideoAutoencoder(num_frames=num_frames, hid_dim=hid_dim).to(device)

    # Обучение автоэнкодера
    train_autoencoder(model, embedding_loader, num_epochs=args.num_epochs, learning_rate=args.learning_rate, device=device)