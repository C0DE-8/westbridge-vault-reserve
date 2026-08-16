ALTER TABLE `support_messages`
  ADD COLUMN `attachment_url` varchar(255) DEFAULT NULL AFTER `created_at`,
  ADD COLUMN `attachment_name` varchar(255) DEFAULT NULL AFTER `attachment_url`,
  ADD COLUMN `attachment_type` varchar(120) DEFAULT NULL AFTER `attachment_name`,
  ADD COLUMN `attachment_size` int unsigned DEFAULT NULL AFTER `attachment_type`;

CREATE INDEX `idx_support_messages_attachment_url` ON `support_messages` (`attachment_url`);
