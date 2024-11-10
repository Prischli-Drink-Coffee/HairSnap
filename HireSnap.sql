-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Ноя 06 2024 г., 00:31
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
  `vacancy_id` int(11) NOT NULL,
  `distance` decimal(6,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `embeddings`
--

CREATE TABLE IF NOT EXISTS `embeddings` (
  `id` int(11) NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `files`
--

CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `info_candidates`
--

CREATE TABLE IF NOT EXISTS `info_candidates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female') COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `date_birth` timestamp NULL DEFAULT NULL,
  `file_id` int(11) DEFAULT NULL,
  `embedding_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `magics`
--

CREATE TABLE IF NOT EXISTS `magics` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `candidate_explanation` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `vacancy_explanation` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `candidate_answer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vacancy_answer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `personalities`
--

CREATE TABLE IF NOT EXISTS `personalities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `embedding_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `personality_vacancies`
--

CREATE TABLE IF NOT EXISTS `personality_vacancies` (
  `id` int(11) NOT NULL,
  `personality_id` int(11) NOT NULL,
  `vacancy_id` int(11) NOT NULL,
  `distance` decimal(6,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('candidate','employer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `info_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `personality_candidates`
--

CREATE TABLE IF NOT EXISTS `personality_candidates` (
  `id` int(11) NOT NULL,
  `personality_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `distance` decimal(6,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `embedding_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Индексы таблицы `personality_candidates`
--
ALTER TABLE `personality_candidates`
  ADD PRIMARY KEY (`id`,`personality_id`,`user_id`),
  ADD KEY `personality_id` (`personality_id`),
  ADD KEY `user_id` (`user_id`);


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
-- AUTO_INCREMENT для таблицы `personality_candidates`
--
ALTER TABLE `personality_candidates`
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
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`info_id`) REFERENCES `info_candidates` (`id`) ON DELETE CASCADE;
  
--
-- Ограничения внешнего ключа таблицы `personality_candidates`
--
ALTER TABLE `personality_candidates`
  ADD CONSTRAINT `personality_candidates_ibfk_1` FOREIGN KEY (`personality_id`) REFERENCES `personalities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `personality_candidates_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;


--
-- Ограничения внешнего ключа таблицы `vacancies`
--
ALTER TABLE `vacancies`
  ADD CONSTRAINT `vacancies_ibfk_1` FOREIGN KEY (`embedding_id`) REFERENCES `embeddings` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
