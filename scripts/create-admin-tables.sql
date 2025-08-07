-- 관리자 계정 테이블 생성
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admin_username` (`username`)
);

-- 관리자 세션 테이블 생성
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` varchar(255) PRIMARY KEY,
  `admin_id` int NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_admin_session_admin_id` (`admin_id`),
  INDEX `idx_admin_session_expires_at` (`expires_at`)
);

-- 소개 페이지 컨텐츠 테이블 생성
CREATE TABLE IF NOT EXISTS `about_content` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int NOT NULL
);