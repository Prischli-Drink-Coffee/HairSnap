#!/bin/bash

# Проверяем наличие аргументов
if [ -z "$1" ]; then
  echo "Usage: $0 <path_to_main_folder>"
  exit 1
fi

# Основная директория
MAIN_FOLDER=$1

# Поддиректории и файлы
VIDEO_FOLDER="$MAIN_FOLDER/video"
FRAMES_FOLDER="$MAIN_FOLDER/frames"
TEMP_AUDIO_FOLDER="$MAIN_FOLDER/temp_audio"
TRANSCRIPTION_PATH="$MAIN_FOLDER/transcription_speech.csv"
USERS_FOLDER="$MAIN_FOLDER/users"
VACANCIES_FOLDER="$MAIN_FOLDER/vacancies"
PERSONALITY_FOLDER="$MAIN_FOLDER/personalities"
SUBMIT_OUTPUT="$MAIN_FOLDER/submit_results.pkl"
MBTI_OUTPUT="$MAIN_FOLDER/mbti_results.pkl"

# Создаем необходимые директории
mkdir -p "$TEMP_AUDIO_FOLDER" "$USERS_FOLDER" "$PERSONALITY_FOLDER" "$VACANCIES_FOLDER" "$PERSONALITY_EMBEDDINGS_FOLDER"

# Шаг 1: Получение текстовых эмбеддингов
echo "Step 1: Extracting audio, transcribing, and generating text embeddings..."

# Транскрибируем видео и сохраняем текст
python src/modelling/video_to_text.py --video_folder_path "$VIDEO_FOLDER" --table_path "$TRANSCRIPTION_PATH" --audio_folder "$TEMP_AUDIO_FOLDER"

# Генерация текстовых эмбеддингов для кандидатов
python src/modelling/get_text_embedding.py --path_to_texts "$TRANSCRIPTION_PATH" --output_folder "$USERS_FOLDER/text_embeddings"

# Генерация текстовых эмбеддингов для вакансий
python src/modelling/get_text_embedding.py --path_to_texts "$VACANCIES_FOLDER/vacancies.csv" --output_folder "$VACANCIES_FOLDER/embeddings" --disable_candidates

# Генерация текстовых эмбеддингов для OCEAN (личностных черт)
python src/modelling/get_text_embedding.py --path_to_texts "$PERSONALITY_FOLDER/personality.csv" --output_folder "$PERSONALITY_FOLDER/embeddings" --disable_candidates

# Шаг 2: Получение видео эмбеддингов
echo "Step 2: Generating video embeddings..."

# Извлекаем фреймы
python src/modelling/get_frames.py "$VIDEO_FOLDER" "$FRAMES_FOLDER"

# Экспортируем путь к токенайзеру
export PYTHONPATH=$PYTHONPATH:~/HireSnap/cosmos_tokenizer

# Извлекаем эмбеддинги для видео пользователей
python src/modelling/get_video_embedding.py --data_dir "$FRAMES_FOLDER" --batch_size 1 --weights_path "src/weights/Unet3D.pth" --model_state "inference" --embeddings_path "$USERS_FOLDER/video_embeddings"

# Шаг 3: Получение общих эмбеддингов для пользователя
echo "Step 3: Generating common embeddings..."

# Объединяем текстовые и видео эмбеддинги
python src/modelling/get_common_embedding.py --video_embedding_folder "$USERS_FOLDER/video_embeddings" --text_embedding_folder "$USERS_FOLDER/text_embeddings" --output_folder "$USERS_FOLDER/embeddings"

# Шаг 4: Вычисление сходства и генерация submit файла
echo "Step 4: Calculating similarity and generating submission file..."

# Запускаем расчет сходства с личностными чертами и сохраняем результат в .pkl файл
python src/modelling/submit.py "$USERS_FOLDER/embeddings" "$PERSONALITY_FOLDER/embeddings" --metric 'cosine' --o "$SUBMIT_OUTPUT"

# Шаг 5: Вычисление MBTI и сохранение в файл
echo "Step 5: Calculating MBTI and generating MBTI file..."

python src/modelling/mbti.py "$USERS_FOLDER/embeddings" "$PERSONALITY_FOLDER/embeddings" --metric 'cosine' --o "$MBTI_OUTPUT"

echo "Pipeline completed. Submission file saved to $SUBMIT_OUTPUT and MBTI file saved to $MBTI_OUTPUT"
