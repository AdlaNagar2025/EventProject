-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2026 at 10:09 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eventhub`
--

-- --------------------------------------------------------

--
-- Table structure for table `provider_images`
--

CREATE TABLE `provider_images` (
  `image_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `provider_type` enum('CHIEF','HALL_Owner') NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_main` tinyint(1) DEFAULT 0,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider_images`
--

INSERT INTO `provider_images` (`image_id`, `provider_id`, `provider_type`, `image_path`, `is_main`, `uploaded_at`) VALUES
(2, 23, 'CHIEF', '1775548873839-italian.jpg', 1, '2026-04-07 08:01:13'),
(3, 23, 'CHIEF', '1775548957961-images.jpg', 1, '2026-04-07 08:02:37'),
(4, 23, 'CHIEF', '1775548957961-download (1).jpg', 0, '2026-04-07 08:02:37'),
(5, 23, 'CHIEF', '1775548957962-download.jpg', 0, '2026-04-07 08:02:37'),
(6, 24, 'HALL_Owner', '1775549097651-download (2).jpg', 1, '2026-04-07 08:04:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `provider_images`
--
ALTER TABLE `provider_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_image_provider` (`provider_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `provider_images`
--
ALTER TABLE `provider_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `provider_images`
--
ALTER TABLE `provider_images`
  ADD CONSTRAINT `fk_image_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
