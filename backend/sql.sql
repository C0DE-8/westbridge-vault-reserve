-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 15, 2026 at 03:23 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_bank_0.2`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `s_account_number` varchar(20) NOT NULL,
  `c_account_number` varchar(20) NOT NULL,
  `routing_name` varchar(120) DEFAULT NULL,
  `routing_number` varchar(32) DEFAULT NULL,
  `routing_type` varchar(40) DEFAULT 'ABA',
  `routing_assigned_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `user_id`, `s_account_number`, `c_account_number`, `routing_name`, `routing_number`, `routing_type`, `routing_assigned_at`, `created_at`) VALUES
(1, 9, '81192528959', '01517267735', NULL, NULL, 'ABA', NULL, '2025-08-07 19:21:54'),
(2, 2, '9876543210', '0123456789', NULL, NULL, 'ABA', NULL, '2025-10-05 00:15:14'),
(5, 14, '81349126590', '01702787084', NULL, NULL, 'ABA', NULL, '2025-10-05 01:48:13');

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity_type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `user_id`, `activity_type`, `description`, `created_at`) VALUES
(1, 9, 'login_alert_sent', 'Login alert email sent', '2025-08-08 18:37:11'),
(2, 9, 'otp_sent', 'Login OTP sent', '2025-08-08 18:37:13'),
(3, 9, 'login', 'OTP verified. Login successful', '2025-08-08 18:37:39'),
(4, 9, 'profile_update', 'Updated profile details', '2025-08-08 18:42:55'),
(5, 9, 'image_upload', 'Uploaded new profile image', '2025-08-08 18:45:11'),
(6, 9, 'profile_update', 'Updated profile details', '2025-08-08 18:50:26'),
(7, 9, 'set_pin', 'User set their transaction PIN', '2025-08-08 18:53:24'),
(8, 9, 'update_pin', 'User updated their transaction PIN', '2025-08-08 18:58:16'),
(9, 9, 'update_pin', 'User updated their transaction PIN', '2025-08-08 18:58:43'),
(10, 9, 'self_transfer', 'Transferred ₦2500.00 from savings to current', '2025-08-08 19:02:46'),
(11, 9, 'self_transfer', 'Transferred $2500.00 from current to savings', '2025-08-08 19:06:43'),
(12, 1, 'login_alert_sent', 'Login alert email sent', '2025-08-08 19:17:23'),
(13, 1, 'login', 'Login successful (OTP not required)', '2025-08-08 19:17:23'),
(14, 9, 'local_transfer', 'Transferred $100.00 to John Doe (1234567890) [Chase Bank] with fee $2.00', '2025-08-08 19:23:09'),
(15, 9, 'wire_transfer', 'Transferred $1200.00 to John Doe (1234567890) [Bank of America] via wire transfer. Fee: $0.00', '2025-08-08 19:30:55'),
(16, 9, 'wire_transfer', 'Transferred $1200.00 to John Doe (1234567890) [Bank of America] via wire transfer. Fee: $2.00', '2025-08-08 19:31:29'),
(17, 9, 'login_alert_sent', 'Login alert email sent', '2025-08-08 19:45:49'),
(18, 9, 'login', 'Login successful (OTP not required)', '2025-08-08 19:45:49'),
(19, 9, 'wire_transfer', 'Wire transfer of $100.00 to John Doe (1234567890) [Bank of America] initiated. Fee: $2.00', '2025-08-08 19:46:16'),
(20, 9, 'wire_transfer', 'Wire transfer of $100.00 to John Doe (1234567890) [Bank of America] initiated. Fee: $2.00', '2025-08-08 19:47:07'),
(21, 9, 'login_alert_sent', 'Login alert email sent', '2025-08-08 20:13:48'),
(22, 9, 'login', 'Login successful (OTP not required)', '2025-08-08 20:13:48'),
(23, 9, 'atm_card_request', 'Requested ATM card for savings account. Fee: $15.00', '2025-08-08 20:38:03'),
(24, 9, 'atm_card_request', 'Requested ATM card for current account. Fee: $20.00', '2025-08-08 20:41:16'),
(25, 9, 'atm_card_approved', 'ATM card approved for savings account', '2025-08-08 20:50:00'),
(26, 9, 'login_alert_sent', 'Login alert email sent', '2025-08-11 21:26:03'),
(27, 9, 'login', 'Login successful (OTP not required)', '2025-08-11 21:26:03'),
(28, 1, 'login_alert_sent', 'Login alert email sent', '2025-08-11 21:27:48'),
(29, 1, 'login', 'Login successful (OTP not required)', '2025-08-11 21:27:48'),
(30, 9, 'login_alert_sent', 'Login alert email sent', '2025-08-11 21:28:15'),
(31, 9, 'login', 'Login successful (OTP not required)', '2025-08-11 21:28:15'),
(32, 9, 'login_alert_sent', 'Login alert email sent', '2025-10-04 20:49:34'),
(33, 9, 'login', 'Login successful (OTP not required)', '2025-10-04 20:49:34'),
(34, 9, 'login_alert_sent', 'Login alert email sent', '2025-10-04 21:13:15'),
(35, 9, 'login', 'Login successful (OTP not required)', '2025-10-04 21:13:16'),
(36, 9, 'wire_transfer', 'Wire transfer of $200.00 to samuel oghenechovwe (7065785436) [opay bank] initiated. Fee: $2.00', '2025-10-04 21:57:39'),
(37, 9, 'wire_transfer', 'Wire transfer of $200.00 to samuel oghenechovwe (7065785436) [opay bank] initiated. Fee: $2.00', '2025-10-04 22:03:52'),
(38, 9, 'wire_transfer', 'Wire transfer of $200.00 to samuel oghenechovwe (7065785436) [opay bank] initiated. Fee: $2.00', '2025-10-04 22:12:32'),
(39, 9, 'local_transfer', 'Transferred $200.00 to samuel oghenechovwe (7065785436) [opay bank] with fee $2.00', '2025-10-04 22:29:34'),
(40, 9, 'profile_update', 'Updated profile details', '2025-10-04 23:19:35'),
(41, 9, 'profile_update', 'Updated profile details', '2025-10-04 23:19:39'),
(42, 1, 'login_alert_sent', 'Login alert email sent', '2025-10-04 23:57:24'),
(43, 1, 'login', 'Login successful (OTP not required)', '2025-10-04 23:57:24'),
(44, 1, 'login_alert_sent', 'Login alert email sent', '2025-10-05 00:02:34'),
(45, 1, 'login', 'Login successful (OTP not required)', '2025-10-05 00:02:34'),
(46, 1, 'impersonate_user', 'Impersonated user #9 (habibi)', '2025-10-05 01:52:27'),
(47, 1, 'image_upload', 'Admin #1 uploaded profile image', '2025-10-05 02:33:49'),
(48, 2, 'image_update', 'Admin #1 updated profile image', '2025-10-05 02:34:00'),
(49, 1, 'impersonate_user', 'Impersonated user #9 (habibi)', '2025-10-05 02:35:49'),
(50, 1, 'impersonate_user', 'Impersonated user #9 (habibi)', '2025-10-05 02:47:06'),
(51, 1, 'login_alert_sent', 'Login alert email sent', '2025-10-05 02:47:35'),
(52, 1, 'login', 'Login successful (OTP not required)', '2025-10-05 02:47:35'),
(53, 1, 'impersonate_user', 'Impersonated user #1 (admin)', '2025-10-05 02:48:40'),
(54, 1, 'login_alert_sent', 'Login alert email sent', '2025-10-05 02:49:10'),
(55, 1, 'login', 'Login successful (OTP not required)', '2025-10-05 02:49:11'),
(56, 9, 'atm_card_approved', 'ATM card approved for current account', '2025-10-05 03:06:55'),
(57, 9, 'login_alert_sent', 'Login alert email sent', '2025-10-05 03:32:21'),
(58, 9, 'login', 'Login successful (OTP not required)', '2025-10-05 03:32:21'),
(59, 9, 'wire_transfer', 'Wire transfer of $200.00 to samuel oghenechovwe (7065785436) [opay bank] initiated. Fee: $2.00', '2025-10-05 03:44:09'),
(60, 9, 'wire_transfer', 'Wire transfer of $210.00 to samuel oghenechovwe (7065785436) [opay bank] initiated. Fee: $2.00', '2025-10-05 03:56:13'),
(61, 9, 'wire_transfer', 'Wire transfer of $210.00 to samuel oghenechovwe (7065785436) [opay bank] initiated. Fee: $2.00', '2025-10-05 03:59:57'),
(62, 9, 'local_transfer', 'Transferred $1000.00 to samuel oghenechovwe (7065785436) [opay bank] with fee $3.00', '2025-10-05 04:03:49'),
(63, 9, 'login_alert_sent', 'Login alert email sent', '2025-10-14 14:21:13'),
(64, 9, 'login', 'Login successful (OTP not required)', '2025-10-14 14:21:13'),
(65, 1, 'login_alert_sent', 'Login alert email sent', '2025-10-14 14:33:48'),
(66, 1, 'login', 'Login successful (OTP not required)', '2025-10-14 14:33:48'),
(67, 9, 'login_alert_sent', 'Login alert email sent', '2025-10-14 16:24:09'),
(68, 9, 'login', 'Login successful (OTP not required)', '2025-10-14 16:24:09'),
(69, 1, 'login_alert_sent', 'Login alert email sent', '2025-10-14 17:04:56'),
(70, 1, 'login', 'Login successful (OTP not required)', '2025-10-14 17:04:56'),
(71, 9, 'login_alert_sent', 'Login alert email sent', '2025-10-14 20:00:27'),
(72, 9, 'login', 'Login successful (OTP not required)', '2025-10-14 20:00:27'),
(73, 1, 'login_alert_sent', 'Login alert email sent', '2025-10-14 20:03:35'),
(74, 1, 'login', 'Login successful (OTP not required)', '2025-10-14 20:03:35'),
(75, 1, 'login_alert_sent', 'Login alert email sent', '2025-10-17 14:02:29'),
(76, 1, 'login', 'Login successful (OTP not required)', '2025-10-17 14:02:29'),
(77, 9, 'login_alert_sent', 'Login alert email sent', '2025-10-18 14:14:45'),
(78, 9, 'login', 'Login successful (OTP not required)', '2025-10-18 14:14:45'),
(79, 9, 'get_pin_status', 'User checked transaction PIN status', '2025-10-18 14:16:15'),
(80, 9, 'get_pin_status', 'User checked transaction PIN status', '2025-10-18 14:19:35'),
(81, 9, 'get_pin_status', 'User checked transaction PIN status', '2025-10-18 14:20:12'),
(82, 1, 'login_alert_sent', 'Login alert email sent', '2025-10-18 14:29:52'),
(83, 1, 'login', 'Login successful (OTP not required)', '2025-10-18 14:29:52'),
(84, 1, 'admin_reset_pin', 'Admin 1 reset PIN for user 2 to default.', '2025-10-18 14:30:26'),
(85, 2, 'pin_reset_by_admin', 'Your transaction PIN was reset by an admin. Default is 000000; please change it immediately.', '2025-10-18 14:30:26'),
(86, 1, 'admin_toggle_codes', 'Admin set require_imf=true, require_cot=false, require_tax=false', '2025-10-18 15:21:45'),
(87, 9, 'login_alert_sent', 'Login alert email sent', '2025-11-18 16:28:11'),
(88, 9, 'login', 'Login successful (OTP not required)', '2025-11-18 16:28:11'),
(89, 9, 'login_alert_sent', 'Login alert email sent', '2025-11-18 16:31:38'),
(90, 9, 'otp_sent', 'Login OTP sent', '2025-11-18 16:31:44'),
(91, 9, 'login', 'OTP verified. Login successful', '2025-11-18 16:32:09'),
(92, 1, 'login_alert_sent', 'Login alert email sent', '2025-11-24 23:53:42'),
(93, 1, 'login', 'Login successful (OTP not required)', '2025-11-24 23:53:42'),
(94, 1, 'login_alert_sent', 'Login alert email sent', '2025-11-24 23:54:07'),
(95, 1, 'login', 'Login successful (OTP not required)', '2025-11-24 23:54:07'),
(96, 9, 'login_alert_sent', 'Login alert email sent', '2025-11-25 00:12:27'),
(97, 9, 'otp_sent', 'Login OTP sent', '2025-11-25 00:12:32'),
(98, 9, 'login', 'OTP verified. Login successful', '2025-11-25 00:12:54'),
(99, 9, 'login_alert_sent', 'Login alert email sent', '2025-11-25 00:14:26'),
(100, 9, 'login', 'Login successful (OTP not required)', '2025-11-25 00:14:26'),
(101, 9, 'login_alert_sent', 'Login alert email sent', '2025-11-25 00:37:41'),
(102, 9, 'login', 'Login successful (OTP not required)', '2025-11-25 00:37:41'),
(103, 1, 'login_alert_sent', 'Login alert email sent', '2025-11-25 00:43:05'),
(104, 1, 'login', 'Login successful (OTP not required)', '2025-11-25 00:43:05'),
(105, 1, 'login_alert_sent', 'Login alert email sent', '2025-12-08 11:13:56'),
(106, 1, 'login', 'Login successful (OTP not required)', '2025-12-08 11:13:56'),
(107, 9, 'login_alert_sent', 'Login alert email sent', '2025-12-08 12:19:20'),
(108, 9, 'login', 'Login successful (OTP not required)', '2025-12-08 12:19:20'),
(109, 9, 'login_alert_sent', 'Login alert email sent', '2025-12-29 10:44:51'),
(110, 9, 'login', 'Login successful (OTP not required)', '2025-12-29 10:44:51'),
(111, 1, 'login_alert_sent', 'Login alert email sent', '2025-12-29 11:45:44'),
(112, 1, 'login', 'Login successful (OTP not required)', '2025-12-29 11:45:44'),
(113, 1, 'login_alert_sent', 'Login alert email sent', '2025-12-29 11:49:00'),
(114, 1, 'login', 'Login successful (OTP not required)', '2025-12-29 11:49:00'),
(115, 9, 'local_transfer_no_otp', 'Local transfer processed without OTP. Deducted $1003.00 to John Doe (0123456789) [GTBank] fee $3.00', '2025-12-29 11:52:53'),
(116, 9, 'local_transfer_no_otp', 'Local transfer processed without OTP. Deducted $503.00 to John Doe (0123456789) [GTBank] fee $3.00', '2025-12-29 12:08:08'),
(117, 9, 'wire_transfer_initiated', 'Wire transfer initiated $500.00 to John Doe (0123456789) [GTBank] fee $2.00 - awaiting OTP', '2025-12-29 12:09:41'),
(118, 9, 'wire_transfer_confirmed', 'Wire transfer confirmed via OTP. Deducted $502.00 (incl fee). Transfer ID #43', '2025-12-29 12:11:10'),
(119, 9, 'login_alert_sent', 'Login alert email sent', '2025-12-29 12:45:46'),
(120, 9, 'login', 'Login successful (OTP not required)', '2025-12-29 12:45:46'),
(121, 1, 'login_alert_sent', 'Login alert email sent', '2026-01-05 18:31:46'),
(122, 1, 'login', 'Login successful (OTP not required)', '2026-01-05 18:31:46'),
(123, 1, 'login_alert_sent', 'Login alert email sent', '2026-01-20 05:42:41'),
(124, 1, 'login', 'Login successful (OTP not required)', '2026-01-20 05:42:41'),
(125, 9, 'login_alert_sent', 'Login alert email sent', '2026-01-20 05:44:33'),
(126, 9, 'login', 'Login successful (OTP not required)', '2026-01-20 05:44:33'),
(127, 9, 'local_transfer_no_otp', 'Local transfer processed without OTP. Deducted $1503.00 to John Doe (0123456789) [GTBank] fee $3.00', '2026-01-20 05:46:06'),
(128, 9, 'local_transfer_no_otp', 'Local transfer completed. Deducted $1503.00 to John Doe (0123456789) [GTBank] fee $3.00', '2026-01-20 05:49:44'),
(129, 9, 'local_transfer_no_otp', 'Local transfer pending_admin. Deducted $1503.00 to John Doe (0123456789) [GTBank] fee $3.00', '2026-01-20 05:50:35'),
(130, 9, 'wire_transfer_initiated', 'Wire transfer initiated $500.00 to John Doe (0123456789) [GTBank] fee $2.00 - awaiting OTP', '2026-01-20 05:56:30'),
(131, 9, 'wire_transfer_initiated', 'Wire transfer initiated $500.00 to John Doe (0123456789) [GTBank] fee $2.00 - awaiting OTP', '2026-01-20 05:58:18'),
(132, 9, 'wire_transfer_initiated', 'Wire transfer initiated $500.00 to John Doe (0123456789) [GTBank] fee $2.00 - awaiting OTP', '2026-01-20 06:03:48'),
(133, 9, 'wire_transfer_no_otp', 'Wire transfer completed. Deducted $502.00 to John Doe (0123456789) [GTBank] fee $2.00', '2026-01-20 06:04:05'),
(134, 9, 'login_alert_sent', 'Login alert email sent', '2026-01-20 06:09:32'),
(135, 9, 'login', 'Login successful (OTP not required)', '2026-01-20 06:09:32'),
(136, 9, 'local_transfer_no_otp', 'Local transfer pending_admin. Deducted $203.00 to samuel oghenechovwe (7065785436) [opay bank] fee $3.00', '2026-01-20 06:12:09'),
(137, 9, 'local_transfer_no_otp', 'Local transfer pending_admin. Deducted $1503.00 to John Doe (0123456789) [GTBank] fee $3.00', '2026-01-20 06:13:20'),
(138, 9, 'local_transfer_no_otp', 'Local transfer completed. Deducted $203.00 to samuel oghenechovwe (7065785436) [opay bank] fee $3.00', '2026-01-20 06:13:56'),
(139, 9, 'wire_transfer_no_otp', 'Wire transfer completed. Deducted $202.00 to samuel oghenechovwe (7065785436) [opay bank] fee $2.00', '2026-01-20 06:38:45'),
(140, 9, 'wire_transfer_no_otp', 'Wire transfer completed. Deducted $202.00 to samuel oghenechovwe (7065785436) [opay bank] fee $2.00', '2026-01-20 06:40:31'),
(141, 9, 'wire_transfer_no_otp', 'Wire transfer completed. Deducted $202.00 to samuel oghenechovwe (7065785436) [opay bank] fee $2.00', '2026-01-20 06:41:47'),
(142, 9, 'wire_transfer_no_otp', 'Wire transfer completed. Deducted $202.00 to samuel oghenechovwe (7065785436) [opay bank] fee $2.00', '2026-01-20 06:42:37'),
(143, 9, 'wire_transfer_no_otp', 'Wire transfer completed. Deducted $202.00 to samuel oghenechovwe (7065785436) [opay bank] fee $2.00', '2026-01-20 06:46:15'),
(144, 9, 'wire_transfer_no_otp', 'Wire transfer completed. Deducted $202.00 to samule oghenechovwe (7065785436) [opay bank] fee $2.00', '2026-01-20 06:46:49'),
(145, 9, 'wire_transfer_no_otp', 'Wire transfer completed. Deducted $202.00 to samuel oghenechovwe (7065785436) [opay bank] fee $2.00', '2026-01-20 07:05:19'),
(146, 9, 'wire_transfer_initiated', 'Wire transfer initiated $200.00 to samuel oghenechovwe (7065785436) [opay bank] fee $2.00 - awaiting OTP', '2026-01-20 07:06:24'),
(147, 9, 'wire_transfer_confirmed', 'Wire transfer confirmed via OTP. Deducted $202.00 (incl fee). Transfer ID #61', '2026-01-20 07:07:04'),
(148, 1, 'login_alert_sent', 'Login alert email sent', '2026-01-20 07:16:10'),
(149, 1, 'login', 'Login successful (OTP not required)', '2026-01-20 07:16:10'),
(150, 9, 'login_alert_sent', 'Login alert email sent', '2026-01-20 07:28:55'),
(151, 9, 'login', 'Login successful (OTP not required)', '2026-01-20 07:28:55'),
(152, 9, 'local_transfer_no_otp', 'Local transfer completed. Deducted $203.00 to samuel oghenechovwe (7065785436) [opay bank] fee $3.00', '2026-01-20 07:29:37'),
(153, 9, 'local_transfer_no_otp', 'Local transfer completed. Deducted $203.00 to samuel oghenechovwe (7065785436) [opay bank] fee $3.00', '2026-01-20 07:32:22'),
(154, 9, 'local_transfer_no_otp', 'Local transfer completed. Deducted $203.00 to samuel oghenechovwe (7065785436) [opay bank] fee $3.00', '2026-01-20 07:33:47'),
(155, 9, 'local_transfer_no_otp', 'Local transfer completed. Deducted $203.00 to samuel oghenechovwe (7065785436) [opay bank] fee $3.00', '2026-01-20 07:42:49'),
(156, 1, 'login_alert_sent', 'Login alert email sent', '2026-01-27 23:50:13'),
(157, 1, 'login', 'Login successful (OTP not required)', '2026-01-27 23:50:13'),
(158, 1, 'login_alert_sent', 'Login alert email sent', '2026-01-28 00:01:16'),
(159, 1, 'login', 'Login successful (OTP not required)', '2026-01-28 00:01:16');

-- --------------------------------------------------------

--
-- Table structure for table `atm_cards`
--

CREATE TABLE `atm_cards` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_type` enum('savings','current') NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `card_holder_name` varchar(100) NOT NULL,
  `expiry_date` varchar(5) NOT NULL,
  `cvv` varchar(3) NOT NULL,
  `fee` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `atm_cards`
--

INSERT INTO `atm_cards` (`id`, `user_id`, `account_type`, `card_number`, `card_holder_name`, `expiry_date`, `cvv`, `fee`, `status`, `requested_at`) VALUES
(1, 9, 'savings', '5998397596366643', 'sam light', '08/28', '785', 15.00, 'approved', '2025-08-08 20:38:03'),
(2, 9, 'current', '5422385795294263', 'sam light', '08/28', '259', 20.00, 'approved', '2025-08-08 20:41:16');

-- --------------------------------------------------------

--
-- Table structure for table `card_fees`
--

CREATE TABLE `card_fees` (
  `id` int(11) NOT NULL,
  `account_type` enum('savings','current') NOT NULL,
  `fee` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `card_fees`
--

INSERT INTO `card_fees` (`id`, `account_type`, `fee`) VALUES
(1, 'savings', 15.00),
(2, 'current', 20.00);

-- --------------------------------------------------------

--
-- Table structure for table `deposits`
--

CREATE TABLE `deposits` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wallet_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `proof_path` varchar(255) DEFAULT NULL,
  `status` enum('pending','confirmed','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deposits`
--

INSERT INTO `deposits` (`id`, `user_id`, `wallet_id`, `amount`, `proof_path`, `status`, `created_at`) VALUES
(1, 9, 2, 5000.00, 'uploads/deposit_1760457911249.jpeg', 'confirmed', '2025-10-14 09:05:11'),
(2, 9, 2, 8000.00, 'uploads/deposit_1760458206085.jpeg', 'rejected', '2025-10-14 09:10:06'),
(3, 9, 2, 200.00, 'uploads/deposit_1760459329606.jpeg', 'pending', '2025-10-14 09:28:49');

-- --------------------------------------------------------

--
-- Table structure for table `login_otps`
--

CREATE TABLE `login_otps` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_otps`
--

INSERT INTO `login_otps` (`id`, `user_id`, `otp_code`, `otp_expires_at`) VALUES
(4, 1, '531509', '2025-08-07 08:58:09'),
(5, 1, '921792', '2025-08-07 08:59:32'),
(6, 1, '297282', '2025-08-07 09:00:35'),
(7, 1, '328482', '2025-08-07 09:07:00');

-- --------------------------------------------------------

--
-- Table structure for table `otps`
--

CREATE TABLE `otps` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `user_id` int(11) NOT NULL,
  `expires_at` datetime NOT NULL,
  `otp` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`user_id`, `expires_at`, `otp`) VALUES
(1, '2025-08-07 09:25:12', ''),
(9, '2025-08-08 11:51:26', '');

-- --------------------------------------------------------

--
-- Table structure for table `security_codes`
--

CREATE TABLE `security_codes` (
  `id` int(11) NOT NULL,
  `imf_code` varchar(20) NOT NULL,
  `cot_code` varchar(20) NOT NULL,
  `tax_code` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `security_codes`
--

INSERT INTO `security_codes` (`id`, `imf_code`, `cot_code`, `tax_code`, `created_at`) VALUES
(1, 'IMF2024', 'COT902', 'TAX601', '2025-08-08 19:30:38');

-- --------------------------------------------------------

--
-- Table structure for table `security_settings`
--

CREATE TABLE `security_settings` (
  `id` tinyint(4) NOT NULL,
  `require_imf` tinyint(1) NOT NULL DEFAULT 1,
  `require_cot` tinyint(1) NOT NULL DEFAULT 1,
  `require_tax` tinyint(1) NOT NULL DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `security_settings`
--

INSERT INTO `security_settings` (`id`, `require_imf`, `require_cot`, `require_tax`, `updated_at`) VALUES
(1, 1, 0, 0, '2025-10-18 15:21:45');

-- --------------------------------------------------------

--
-- Table structure for table `self_transfers`
--

CREATE TABLE `self_transfers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `from_account` enum('savings','current') NOT NULL,
  `to_account` enum('savings','current') NOT NULL,
  `amount` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `self_transfers`
--

INSERT INTO `self_transfers` (`id`, `user_id`, `from_account`, `to_account`, `amount`, `created_at`) VALUES
(1, 9, 'savings', 'current', '2500', '2025-08-08 19:02:46'),
(2, 9, 'current', 'savings', '2500', '2025-08-08 19:06:43');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key_name` varchar(100) DEFAULT NULL,
  `value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key_name`, `value`) VALUES
(1, 'bank_name', 'iT light-potato Bank'),
(2, 'local_transfer_otp_enabled', '0'),
(3, 'local_transfer_admin_confirm_enabled', '0'),
(6, 'wire_transfer_admin_confirm_enabled', '0'),
(9, 'wire_transfer_otp_enabled', '1');

-- --------------------------------------------------------

--
-- Table structure for table `support_messages`
--

CREATE TABLE `support_messages` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `sender` enum('user','admin') NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_messages`
--

INSERT INTO `support_messages` (`id`, `ticket_id`, `sender`, `message`, `created_at`) VALUES
(1, 3, 'user', 'Hello, I tried withdrawing from my wallet but it keeps showing an error message.', '2025-10-14 08:17:50'),
(2, 3, 'admin', 'Here’s an update: I retried it today, still not working.', '2025-10-14 08:20:21'),
(3, 3, 'user', 'so what is the update on the issues ', '2025-10-14 09:41:30'),
(4, 1, 'user', 'hello', '2025-10-14 09:46:59'),
(5, 3, 'admin', 'Here’s an update: I retried it today, still not working.', '2025-10-14 09:50:17'),
(6, 3, 'admin', 'Here’s an update:yes I retried it today, still not working.', '2025-10-14 09:50:29'),
(7, 3, 'user', 'hello thanks \n', '2025-10-14 13:01:20'),
(8, 3, 'admin', 'hello', '2025-12-08 03:51:55'),
(9, 3, 'admin', 'hello again', '2025-12-08 04:06:36'),
(10, 3, 'admin', 'so it working then', '2025-12-08 04:14:29'),
(11, 3, 'admin', 'noted try 3', '2025-12-08 04:17:03'),
(12, 4, 'user', 'Hello, I tried withdrawing from my wallet but it keeps showing an error message.', '2025-12-08 04:29:35'),
(13, 3, 'user', 'Just an update: still not received.', '2025-12-08 04:32:41'),
(14, 3, 'user', 'Just an update: still not received.', '2025-12-08 04:33:58'),
(15, 5, 'user', 'Hello, I tried withdrawing from my wallet but it keeps showing an error message.', '2025-12-08 04:34:11'),
(16, 6, 'user', 'Hello, I tried withdrawing from my wallet but it keeps showing an error message.', '2025-12-08 04:45:38'),
(17, 7, 'user', 'Hello, I tried withdrawing from my wallet but it keeps showing an error message.', '2025-12-08 04:45:48'),
(18, 8, 'user', 'Hello, I tried withdrawing from my wallet but it keeps showing an error message.', '2025-12-08 04:48:06'),
(19, 8, 'admin', 'noted m man', '2025-12-08 04:48:22'),
(20, 2, 'admin', 'ok it working well', '2025-12-08 05:01:57');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `status` enum('open','closed') DEFAULT 'open',
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `user_id`, `subject`, `status`, `created_at`) VALUES
(1, 9, 'Can\'t withdraw funds', 'closed', '2025-10-14 08:11:34'),
(2, 9, 'Can\'t withdraw funds', 'closed', '2025-10-14 08:14:53'),
(3, 9, 'Can\'t withdraw funds', 'closed', '2025-10-14 08:17:50'),
(4, 9, 'Can\'t withdraw funds', 'open', '2025-12-08 04:29:35'),
(5, 9, 'Can\'t withdraw funds', 'open', '2025-12-08 04:34:11'),
(6, 9, 'Can\'t withdraw funds', 'open', '2025-12-08 04:45:38'),
(7, 9, 'Can\'t withdraw funds', 'closed', '2025-12-08 04:45:48'),
(8, 9, 'Can\'t withdraw funds', 'open', '2025-12-08 04:48:06');

-- --------------------------------------------------------

--
-- Table structure for table `transfers`
--

CREATE TABLE `transfers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `transfer_type` enum('local','wire','sim') NOT NULL,
  `from_account` enum('savings','current') NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `account_name` varchar(100) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `reason` text DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `entry_type` enum('credit','debit') NOT NULL DEFAULT 'debit',
  `fee` decimal(12,2) DEFAULT 0.00,
  `status` varchar(50) NOT NULL DEFAULT 'pending_admin',
  `is_simulated` tinyint(1) NOT NULL DEFAULT 0,
  `sim_batch_id` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `bank_country` varchar(100) DEFAULT NULL,
  `routine_number` varchar(50) DEFAULT NULL,
  `imf_code` varchar(50) DEFAULT NULL,
  `cot_code` varchar(50) DEFAULT NULL,
  `tax_code` varchar(50) DEFAULT NULL,
  `total_amount` decimal(15,2) DEFAULT NULL,
  `otp_status` varchar(30) DEFAULT 'none',
  `otp_verified_at` datetime DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL,
  `admin_action_note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transfers`
--

INSERT INTO `transfers` (`id`, `user_id`, `transfer_type`, `from_account`, `bank_name`, `account_name`, `account_number`, `reason`, `amount`, `entry_type`, `fee`, `status`, `is_simulated`, `sim_batch_id`, `created_at`, `bank_country`, `routine_number`, `imf_code`, `cot_code`, `tax_code`, `total_amount`, `otp_status`, `otp_verified_at`, `confirmed_at`, `rejected_at`, `admin_action_note`) VALUES
(31, 9, 'wire', 'current', 'Opay Bank', 'Evergreen Supplies Co.', '6666463281', 'fee', 210.00, 'debit', 2.00, 'processing', 0, NULL, '2025-10-05 19:00:00', 'usa', '2345678', 'IMF2024', 'COT902', 'TAX601', NULL, 'none', NULL, NULL, NULL, NULL),
(32, 9, 'local', 'current', 'Opay Bank', 'Evergreen Supplies Co.', '6666463281', 'fee', 1000.00, 'debit', 3.00, 'processing', 0, NULL, '2025-10-05 19:00:00', 'usa', '2345678', NULL, NULL, NULL, NULL, 'none', NULL, NULL, NULL, NULL),
(33, 9, 'wire', 'current', 'Bank Of America', 'Harper Martin', '5648771319', 'Business Payment', 100.00, 'debit', 2.00, 'processing', 0, NULL, '2025-08-08 19:47:07', 'USA', '021000021', 'IMF2024', 'COT902', 'TAX501', NULL, 'none', NULL, NULL, NULL, NULL),
(34, 9, 'wire', 'current', 'Bank Of America', 'Harper Martin', '5648771319', 'Business Payment', 1200.00, 'debit', 2.00, 'processing', 0, NULL, '2025-08-08 19:47:07', 'USA', '021000021', 'IMF2024', 'COT902', 'TAX501', NULL, 'none', NULL, NULL, NULL, NULL),
(35, 9, 'wire', 'current', 'Bank Of America', 'Harper Martin', '5648771319', 'Business Payment', 100.00, 'debit', 2.00, 'processing', 0, NULL, '2025-08-08 19:47:07', 'USA', '021000021', 'IMF2024', 'COT902', 'TAX501', NULL, 'none', NULL, NULL, NULL, NULL),
(36, 9, 'wire', 'current', 'Opay Bank', 'Evergreen Supplies Co.', '6666463281', 'fee', 210.00, 'debit', 2.00, 'processing', 0, NULL, '2025-10-05 19:00:00', 'usa', '2345678', 'IMF2024', 'COT902', 'TAX601', NULL, 'none', NULL, NULL, NULL, NULL),
(37, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Rent', 5000.00, 'debit', 3.00, 'processing', 0, NULL, '2025-12-29 11:22:22', NULL, NULL, NULL, NULL, NULL, 5003.00, 'pending_otp', NULL, NULL, NULL, NULL),
(38, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Rent', 5000.00, 'debit', 3.00, 'processing', 0, NULL, '2025-12-29 11:22:56', NULL, NULL, NULL, NULL, NULL, 5003.00, 'verified', '2025-12-29 03:38:21', NULL, NULL, NULL),
(39, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Rent', 5000.00, 'debit', 3.00, 'processing', 0, NULL, '2025-12-29 11:23:31', NULL, NULL, NULL, NULL, NULL, 5003.00, 'pending_otp', NULL, NULL, NULL, NULL),
(40, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Rent', 5000.00, 'debit', 3.00, 'processing', 0, NULL, '2025-12-29 11:24:36', NULL, NULL, NULL, NULL, NULL, 5003.00, 'verified', '2025-12-29 03:26:38', NULL, NULL, NULL),
(41, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Rent', 1000.00, 'debit', 3.00, 'processing', 0, NULL, '2025-12-29 11:52:53', NULL, NULL, NULL, NULL, NULL, 1003.00, 'verified', '2025-12-29 03:52:53', NULL, NULL, NULL),
(42, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Family support', 500.00, 'debit', 3.00, 'processing', 0, NULL, '2025-12-29 12:08:07', NULL, NULL, NULL, NULL, NULL, 503.00, 'verified', '2025-12-29 04:08:07', NULL, NULL, NULL),
(43, 9, 'wire', 'savings', 'Chase Bank', 'John Smith', '1234567890', 'Invoice settlement', 869.00, 'debit', 7.50, 'completed', 0, NULL, '2026-01-05 20:38:00', 'United States', '021000021', 'IMF2024', 'COT902', 'TAX601', 502.00, 'verified', '2025-12-29 04:11:10', NULL, NULL, NULL),
(44, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Rent', 1500.00, 'debit', 3.00, 'processing', 0, NULL, '2026-01-20 05:46:06', NULL, NULL, NULL, NULL, NULL, 1503.00, 'verified', '2026-01-19 21:46:06', NULL, NULL, NULL),
(45, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Rent', 1500.00, 'debit', 3.00, 'completed', 0, NULL, '2026-01-20 05:49:44', NULL, NULL, NULL, NULL, NULL, 1503.00, 'verified', '2026-01-19 21:49:44', '2026-01-19 21:49:44', NULL, NULL),
(46, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Rent', 1500.00, 'debit', 3.00, 'pending_admin', 0, NULL, '2026-01-20 05:50:35', NULL, NULL, NULL, NULL, NULL, 1503.00, 'verified', '2026-01-19 21:50:35', NULL, NULL, NULL),
(47, 9, 'wire', 'savings', 'GTBank', 'John Doe', '0123456789', 'Family support', 500.00, 'debit', 2.00, 'pending_admin', 0, NULL, '2026-01-20 05:55:53', 'Nigeria', '123456789', 'IMF2024', 'COT902', 'TAX601', 502.00, 'pending_otp', NULL, NULL, NULL, NULL),
(48, 9, 'wire', 'savings', 'GTBank', 'John Doe', '0123456789', 'Family support', 500.00, 'debit', 2.00, 'processing', 0, NULL, '2026-01-20 05:58:13', 'Nigeria', '123456789', 'IMF2024', 'COT902', 'TAX601', 502.00, 'pending_otp', NULL, NULL, NULL, NULL),
(49, 9, 'wire', 'savings', 'GTBank', 'John Doe', '0123456789', 'Family support', 500.00, 'debit', 2.00, 'processing', 0, NULL, '2026-01-20 06:03:42', 'Nigeria', '123456789', 'IMF2024', 'COT902', 'TAX601', 502.00, 'pending_otp', NULL, NULL, NULL, NULL),
(50, 9, 'wire', 'savings', 'GTBank', 'John Doe', '0123456789', 'Family support', 500.00, 'debit', 2.00, 'completed', 0, NULL, '2026-01-20 06:04:05', 'Nigeria', '123456789', 'IMF2024', 'COT902', 'TAX601', 502.00, 'verified', '2026-01-19 22:04:05', '2026-01-19 22:04:05', NULL, NULL),
(51, 9, 'local', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', '12345', 200.00, 'debit', 3.00, 'pending_admin', 0, NULL, '2026-01-20 06:12:09', NULL, NULL, NULL, NULL, NULL, 203.00, 'verified', '2026-01-19 22:12:09', NULL, NULL, NULL),
(52, 9, 'local', 'savings', 'GTBank', 'John Doe', '0123456789', 'Rent', 1500.00, 'debit', 3.00, 'pending_admin', 0, NULL, '2026-01-20 06:13:20', NULL, NULL, NULL, NULL, NULL, 1503.00, 'verified', '2026-01-19 22:13:20', NULL, NULL, NULL),
(53, 9, 'local', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', '12345', 200.00, 'debit', 3.00, 'completed', 0, NULL, '2026-01-20 06:13:56', NULL, NULL, NULL, NULL, NULL, 203.00, 'verified', '2026-01-19 22:13:56', '2026-01-19 22:13:56', NULL, NULL),
(54, 9, 'wire', 'savings', 'opay bank', 'samuel oghenechovwe', '7065785436', '234567', 200.00, 'debit', 2.00, 'completed', 0, NULL, '2026-01-20 06:38:45', 'usa', '2345678', 'IMF2024', NULL, NULL, 202.00, 'verified', '2026-01-19 22:38:45', '2026-01-19 22:38:45', NULL, NULL),
(55, 9, 'wire', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', '1345', 200.00, 'debit', 2.00, 'completed', 0, NULL, '2026-01-20 06:40:31', 'usa', '2345678', 'IMF2024', NULL, NULL, 202.00, 'verified', '2026-01-19 22:40:31', '2026-01-19 22:40:31', NULL, NULL),
(56, 9, 'wire', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', 'tesr', 200.00, 'debit', 2.00, 'completed', 0, NULL, '2026-01-20 06:41:47', 'usa', '2345678', 'IMF2024', NULL, NULL, 202.00, 'verified', '2026-01-19 22:41:47', '2026-01-19 22:41:47', NULL, NULL),
(57, 9, 'wire', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', 'tesr', 200.00, 'debit', 2.00, 'completed', 0, NULL, '2026-01-20 06:42:37', 'usa', '2345678', 'IMF2024', NULL, NULL, 202.00, 'verified', '2026-01-19 22:42:37', '2026-01-19 22:42:37', NULL, NULL),
(58, 9, 'wire', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', 'gg', 200.00, 'debit', 2.00, 'completed', 0, NULL, '2026-01-20 06:46:15', 'usa', '2345678', 'IMF2024', NULL, NULL, 202.00, 'verified', '2026-01-19 22:46:15', '2026-01-19 22:46:15', NULL, NULL),
(59, 9, 'wire', 'current', 'opay bank', 'samule oghenechovwe', '7065785436', 'gg', 200.00, 'debit', 2.00, 'completed', 0, NULL, '2026-01-20 06:46:49', 'usa', '2345678', 'IMF2024', NULL, NULL, 202.00, 'verified', '2026-01-19 22:46:49', '2026-01-19 22:46:49', NULL, NULL),
(60, 9, 'wire', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', '12', 200.00, 'debit', 2.00, 'completed', 0, NULL, '2026-01-20 07:05:19', 'usa', '2345678', 'IMF2024', NULL, NULL, 202.00, 'verified', '2026-01-19 23:05:19', '2026-01-19 23:05:19', NULL, NULL),
(61, 9, 'wire', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', '1234567890', 200.00, 'debit', 2.00, 'processing', 0, NULL, '2026-01-20 07:06:13', 'usa', '2345678', 'IMF2024', NULL, NULL, 202.00, 'verified', '2026-01-19 23:07:04', NULL, NULL, NULL),
(62, 9, 'local', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', '123456', 200.00, 'debit', 3.00, 'completed', 0, NULL, '2026-01-20 07:29:37', NULL, NULL, NULL, NULL, NULL, 203.00, 'verified', '2026-01-19 23:29:37', '2026-01-19 23:29:37', NULL, NULL),
(63, 9, 'local', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', '123456', 200.00, 'debit', 3.00, 'completed', 0, NULL, '2026-01-20 07:32:22', NULL, NULL, NULL, NULL, NULL, 203.00, 'verified', '2026-01-19 23:32:22', '2026-01-19 23:32:22', NULL, NULL),
(64, 9, 'local', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', '123456', 200.00, 'debit', 3.00, 'completed', 0, NULL, '2026-01-20 07:33:47', NULL, NULL, NULL, NULL, NULL, 203.00, 'verified', '2026-01-19 23:33:47', '2026-01-19 23:33:47', NULL, NULL),
(65, 9, 'local', 'current', 'opay bank', 'samuel oghenechovwe', '7065785436', 'noted', 200.00, 'debit', 3.00, 'completed', 0, NULL, '2026-01-20 07:42:49', NULL, NULL, NULL, NULL, NULL, 203.00, 'verified', '2026-01-19 23:42:49', '2026-01-19 23:42:49', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transfer_fees`
--

CREATE TABLE `transfer_fees` (
  `id` int(11) NOT NULL,
  `type` enum('local','wire') NOT NULL,
  `fee_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transfer_fees`
--

INSERT INTO `transfer_fees` (`id`, `type`, `fee_amount`, `created_at`, `updated_at`) VALUES
(1, 'local', 3.00, '2025-08-08 19:17:43', '2025-10-05 03:02:10'),
(3, 'wire', 2.00, '2025-08-08 19:17:43', '2025-08-08 19:17:43');

-- --------------------------------------------------------

--
-- Table structure for table `transfer_otps`
--

CREATE TABLE `transfer_otps` (
  `id` int(11) NOT NULL,
  `transfer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `otp_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `last_sent_at` datetime NOT NULL,
  `attempts` int(11) DEFAULT 0,
  `max_attempts` int(11) DEFAULT 5,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transfer_otps`
--

INSERT INTO `transfer_otps` (`id`, `transfer_id`, `user_id`, `otp_hash`, `expires_at`, `last_sent_at`, `attempts`, `max_attempts`, `created_at`) VALUES
(2, 39, 9, '5c144f139ca31b2e8f45836868722f082eeed9b0d3d06269ebcde845c698b797', '2025-12-29 03:28:31', '2025-12-29 03:23:31', 0, 5, '2025-12-29 11:23:31'),
(5, 47, 9, 'ed08e415a54f9b8d2c9f6a73db239d638b105069ea639d90c9ed184baaeecf8b', '2026-01-19 22:00:53', '2026-01-19 21:55:53', 0, 5, '2026-01-20 05:55:53'),
(6, 48, 9, 'cee272f76662576e19401364b012428a534b0b12c3f2311ee33be316b2622d0f', '2026-01-19 22:03:13', '2026-01-19 21:58:13', 0, 5, '2026-01-20 05:58:13'),
(7, 49, 9, 'f084945956fc3c60d8ad107b3c2a0ef388103a112964bfb0d79cdc55fd6db1e8', '2026-01-19 22:08:42', '2026-01-19 22:03:42', 0, 5, '2026-01-20 06:03:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `savings_balance` varchar(255) DEFAULT '0',
  `loan_balance` varchar(255) DEFAULT '0',
  `current_balance` varchar(255) DEFAULT '0',
  `acct_status` varchar(20) NOT NULL DEFAULT 'active',
  `currency_sign` varchar(5) DEFAULT '$',
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `account_number` varchar(20) DEFAULT NULL,
  `login_otp_enabled` tinyint(1) DEFAULT 1,
  `transaction_pin` varchar(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `savings_balance`, `loan_balance`, `current_balance`, `acct_status`, `currency_sign`, `is_admin`, `created_at`, `full_name`, `email`, `email_verified`, `account_number`, `login_otp_enabled`, `transaction_pin`) VALUES
(1, 'admin1', '$2b$12$zhGydJ33ifTHR8PbGzzMpujAsBnjybrgmRE71xrXpw0sChuGRiptu', '0', '0', '0', 'active', '$', 1, '2025-08-07 14:02:03', 'full name admin', '8amjoker@gmail.com', 1, '123456', 0, NULL),
(2, '...', '$2b$10$KIX/8K0vZQgLHgUfsMRWeuByv82TjhmqF.qQcTNVm/xCrj3VqG1a6', '200.5', '0', '1000', 'active', '₦', 0, '2025-08-07 14:02:03', '...', '...', 1, NULL, 0, '000000'),
(9, 'habibi', '$2b$10$F0NLG5VXNabO.48KvLxgX.zLnJe2h2DtyHKOlfnF9a9j/s4bRu7tO', '3141.00', '0', '2385.00', 'inactive', '$', 0, '2025-08-07 19:21:54', 'sam light', '8amlight@gmail.com', 1, '011188783867', 0, '123456'),
(14, 'sam.uk', '$2b$10$51TxrZLNvBKdeC5hOCqVUe0sNLv9tpD7UEMaVIv0msEuYmUrerh5W', '0', '0', '0', 'active', '£', 0, '2025-10-05 01:48:13', 'super Whitman', 'oghenesupersam@gmail.com', 1, '019531282300', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_images`
--

CREATE TABLE `user_images` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_images`
--

INSERT INTO `user_images` (`id`, `user_id`, `image_url`, `uploaded_at`) VALUES
(1, 9, '/uploads/user_1754678710857.jpeg', '2025-08-08 18:45:11'),
(2, 2, '/uploads/user_1759631639656.png', '2025-10-05 00:15:14'),
(3, 1, '/uploads/user_1759631628711.png', '2025-10-05 02:33:49');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` int(11) NOT NULL,
  `wallet_name` varchar(100) NOT NULL,
  `wallet_address` text NOT NULL,
  `qrcode_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `wallet_name`, `wallet_address`, `qrcode_path`, `created_at`) VALUES
(2, 'Bitcoin', 'bc1qexampleaddress12345', 'uploads/wallet_1760453196646.jpeg', '2025-10-14 14:46:19'),
(3, 'Eth', '0x62B66B0417b69a9aa108eD8458a58820507f23E2', 'uploads/wallet_1760461568498.jpeg', '2025-10-14 17:06:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `s_account_number` (`s_account_number`),
  ADD UNIQUE KEY `c_account_number` (`c_account_number`),
  ADD KEY `idx_accounts_routing_number` (`routing_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `atm_cards`
--
ALTER TABLE `atm_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `card_fees`
--
ALTER TABLE `card_fees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_type` (`account_type`);

--
-- Indexes for table `deposits`
--
ALTER TABLE `deposits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_otps`
--
ALTER TABLE `login_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `security_codes`
--
ALTER TABLE `security_codes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `security_settings`
--
ALTER TABLE `security_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `self_transfers`
--
ALTER TABLE `self_transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_name` (`key_name`);

--
-- Indexes for table `support_messages`
--
ALTER TABLE `support_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_id` (`ticket_id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transfers`
--
ALTER TABLE `transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transfer_fees`
--
ALTER TABLE `transfer_fees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_type` (`type`);

--
-- Indexes for table `transfer_otps`
--
ALTER TABLE `transfer_otps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_transfer` (`transfer_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_images`
--
ALTER TABLE `user_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT for table `atm_cards`
--
ALTER TABLE `atm_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `card_fees`
--
ALTER TABLE `card_fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `deposits`
--
ALTER TABLE `deposits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `login_otps`
--
ALTER TABLE `login_otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `security_codes`
--
ALTER TABLE `security_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `self_transfers`
--
ALTER TABLE `self_transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `support_messages`
--
ALTER TABLE `support_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `transfers`
--
ALTER TABLE `transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `transfer_fees`
--
ALTER TABLE `transfer_fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transfer_otps`
--
ALTER TABLE `transfer_otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_images`
--
ALTER TABLE `user_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `atm_cards`
--
ALTER TABLE `atm_cards`
  ADD CONSTRAINT `atm_cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `login_otps`
--
ALTER TABLE `login_otps`
  ADD CONSTRAINT `login_otps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `otps`
--
ALTER TABLE `otps`
  ADD CONSTRAINT `otps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `self_transfers`
--
ALTER TABLE `self_transfers`
  ADD CONSTRAINT `self_transfers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_messages`
--
ALTER TABLE `support_messages`
  ADD CONSTRAINT `support_messages_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transfers`
--
ALTER TABLE `transfers`
  ADD CONSTRAINT `transfers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_images`
--
ALTER TABLE `user_images`
  ADD CONSTRAINT `user_images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
