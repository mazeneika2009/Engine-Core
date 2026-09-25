-- Engine Core schema (MySQL 8+)
-- Run with: npm run migrate --workspace apps/server

CREATE DATABASE IF NOT EXISTS `engine_core`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `engine_core`;

CREATE TABLE IF NOT EXISTS `workflows` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 0,
  `nodes` JSON NOT NULL,
  `connections` JSON NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_workflows_active` (`active`),
  KEY `idx_workflows_updated` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `executions` (
  `id` VARCHAR(36) NOT NULL,
  `workflow_id` VARCHAR(36) NOT NULL,
  `status` ENUM('running','success','failed') NOT NULL DEFAULT 'running',
  `execution_data` JSON NULL,
  `error_details` JSON NULL,
  `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finished_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_executions_workflow` (`workflow_id`),
  KEY `idx_executions_status` (`status`),
  KEY `idx_executions_started` (`started_at`),
  CONSTRAINT `fk_executions_workflow`
    FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `credentials` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `data` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_credentials_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
