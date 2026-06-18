CREATE TABLE `bill_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `payment_kind` enum('bill','airtime') NOT NULL DEFAULT 'bill',
  `bill_category` enum('water','electricity','gas','internet','cable','phone','tax','insurance','waste','hoa','tuition','mortgage') NOT NULL DEFAULT 'electricity',
  `provider_name` varchar(120) NOT NULL,
  `customer_reference` varchar(120) NOT NULL,
  `from_account` enum('savings','current') NOT NULL DEFAULT 'current',
  `amount` decimal(12,2) NOT NULL,
  `note` text DEFAULT NULL,
  `status` enum('pending','confirmed','rejected') NOT NULL DEFAULT 'pending',
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_bill_payments_user_id` (`user_id`),
  KEY `idx_bill_payments_status` (`status`),
  CONSTRAINT `fk_bill_payments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
