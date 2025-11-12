-- Admin Dashboard Database Schema
-- This table stores the count of calculations performed by the public app

CREATE TABLE IF NOT EXISTS calculation_count (
  id INT PRIMARY KEY AUTO_INCREMENT,
  count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initialize with count of 0
INSERT INTO calculation_count (count) VALUES (0) ON DUPLICATE KEY UPDATE count = count;
