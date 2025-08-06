-- 데이터베이스 생성 스크립트
CREATE DATABASE IF NOT EXISTS blog_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 권한 설정 (필요시)
-- GRANT ALL PRIVILEGES ON blog_db.* TO 'your_user'@'localhost';
-- FLUSH PRIVILEGES;

USE blog_db;