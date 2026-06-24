ALTER TABLE `accounts`
  ADD COLUMN `routing_name` varchar(120) DEFAULT NULL AFTER `c_account_number`,
  ADD COLUMN `routing_number` varchar(32) DEFAULT NULL AFTER `routing_name`,
  ADD COLUMN `routing_type` varchar(40) DEFAULT 'ABA' AFTER `routing_number`,
  ADD COLUMN `routing_assigned_at` timestamp NULL DEFAULT NULL AFTER `routing_type`;

CREATE INDEX `idx_accounts_routing_number` ON `accounts` (`routing_number`);
