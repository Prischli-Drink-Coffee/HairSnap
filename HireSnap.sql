-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Ноя 05 2024 г., 04:33
-- Версия сервера: 5.7.39
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `HireSnap`
--

-- --------------------------------------------------------

--
-- Структура таблицы `candidate_vacancies`
--

CREATE TABLE IF NOT EXISTS `candidate_vacancies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vacancy_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы `candidate_vacancies`
INSERT IGNORE INTO `candidate_vacancies` (`id`, `user_id`, `vacancy_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `embeddings`
--

CREATE TABLE IF NOT EXISTS `embeddings` (
  `id` int(11) NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы `embeddings`
INSERT IGNORE INTO `embeddings` (`id`, `url`) VALUES
(1, 'http://example.com/embedding1'),
(2, 'http://example.com/embedding2'),
(3, 'http://example.com/embedding3');

-- --------------------------------------------------------

--
-- Структура таблицы `files`
--

CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы `files`
INSERT IGNORE INTO `files` (`id`, `url`) VALUES
(1, 'http://example.com/file1.pdf'),
(2, 'http://example.com/file2.pdf'),
(3, 'http://example.com/file3.pdf');

-- --------------------------------------------------------

--
-- Структура таблицы `info_candidates`
--

CREATE TABLE IF NOT EXISTS `info_candidates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_birth` timestamp NULL DEFAULT NULL,
  `file_id` int(11) NOT NULL,
  `embedding_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы `info_candidates`
INSERT IGNORE INTO `info_candidates` (`id`, `name`, `phone`, `gender`, `date_birth`, `file_id`, `embedding_id`) VALUES
(1, 'John Doe', '123-456-7890', 'male', '1990-01-01', 1, 1),
(2, 'Jane Smith', '098-765-4321', 'female', '1985-05-10', 2, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `magics`
--

CREATE TABLE IF NOT EXISTS `magics` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы `magics`
INSERT IGNORE INTO `magics` (`id`, `name`, `description`, `file_id`) VALUES
(1, 'Magic 1', 'Description of magic 1', 1),
(2, 'Magic 2', 'Description of magic 2', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `personalities`
--

CREATE TABLE IF NOT EXISTS `personalities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `embedding_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы `personalities`
INSERT IGNORE INTO `personalities` (`id`, `name`, `description`, `embedding_id`) VALUES
(1, 'Personality 1', 'Description of personality 1', 1),
(2, 'Personality 2', 'Description of personality 2', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `personality_vacancies`
--

CREATE TABLE IF NOT EXISTS `personality_vacancies` (
  `id` int(11) NOT NULL,
  `personality_id` int(11) NOT NULL,
  `vacancy_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы `personality_vacancies`
INSERT IGNORE INTO `personality_vacancies` (`id`, `personality_id`, `vacancy_id`) VALUES
(1, 1, 1),
(2, 2, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('candidate, employer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `info_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы `users`
INSERT IGNORE INTO `users` (`id`, `email`, `password`, `type`, `info_id`, `created_at`) VALUES
(1, 'user1@example.com', 'password1', 'candidate', 1, NOW()),
(2, 'user2@example.com', 'password2', 'employer', NULL, NOW());

-- --------------------------------------------------------

--
-- Структура таблицы `vacancies`
--

CREATE TABLE IF NOT EXISTS `vacancies` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `salary` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skill` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `embedding_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполнение таблицы `vacancies`
INSERT IGNORE INTO `vacancies` (`id`, `name`, `description`, `salary`, `skill`, `embedding_id`) VALUES
(1, 'Vacancy 1', 'Description for vacancy 1', '50000', 'Python, SQL', 1),
(2, 'Vacancy 2', 'Description for vacancy 2', '60000', 'JavaScript, HTML', 2);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `candidate_vacancies`
--
ALTER TABLE `candidate_vacancies`
  ADD PRIMARY KEY (`id`,`user_id`,`vacancy_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vacancy_id` (`vacancy_id`);

--
-- Индексы таблицы `embeddings`
--
ALTER TABLE `embeddings`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `info_candidates`
--
ALTER TABLE `info_candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `file_id` (`file_id`),
  ADD KEY `embedding_id` (`embedding_id`);

--
-- Индексы таблицы `magics`
--
ALTER TABLE `magics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `file_id` (`file_id`);

--
-- Индексы таблицы `personalities`
--
ALTER TABLE `personalities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `embedding_id` (`embedding_id`);

--
-- Индексы таблицы `personality_vacancies`
--
ALTER TABLE `personality_vacancies`
  ADD PRIMARY KEY (`id`,`personality_id`,`vacancy_id`),
  ADD KEY `personality_id` (`personality_id`),
  ADD KEY `vacancy_id` (`vacancy_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `info_id` (`info_id`);

--
-- Индексы таблицы `vacancies`
--
ALTER TABLE `vacancies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `embedding_id` (`embedding_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `candidate_vacancies`
--
ALTER TABLE `candidate_vacancies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `embeddings`
--
ALTER TABLE `embeddings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `info_candidates`
--
ALTER TABLE `info_candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `magics`
--
ALTER TABLE `magics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `personalities`
--
ALTER TABLE `personalities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `personality_vacancies`
--
ALTER TABLE `personality_vacancies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `vacancies`
--
ALTER TABLE `vacancies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `candidate_vacancies`
--
ALTER TABLE `candidate_vacancies`
  ADD CONSTRAINT `candidate_vacancies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidate_vacancies_ibfk_2` FOREIGN KEY (`vacancy_id`) REFERENCES `vacancies` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `info_candidates`
--
ALTER TABLE `info_candidates`
  ADD CONSTRAINT `info_candidates_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `info_candidates_ibfk_2` FOREIGN KEY (`embedding_id`) REFERENCES `embeddings` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `magics`
--
ALTER TABLE `magics`
  ADD CONSTRAINT `magics_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `personalities`
--
ALTER TABLE `personalities`
  ADD CONSTRAINT `personalities_ibfk_1` FOREIGN KEY (`embedding_id`) REFERENCES `embeddings` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `personality_vacancies`
--
ALTER TABLE `personality_vacancies`
  ADD CONSTRAINT `personality_vacancies_ibfk_1` FOREIGN KEY (`personality_id`) REFERENCES `personalities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `personality_vacancies_ibfk_2` FOREIGN KEY (`vacancy_id`) REFERENCES `vacancies` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`info_id`) REFERENCES `info_candidates` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `vacancies`
--
ALTER TABLE `vacancies`
  ADD CONSTRAINT `vacancies_ibfk_1` FOREIGN KEY (`embedding_id`) REFERENCES `embeddings` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
