-- ======================================
-- 블로그 데이터베이스 완전 재구축 스크립트
-- MySQL 8.0 최적화된 스키마
-- ======================================

-- 데이터베이스 생성 (존재하지 않을 경우)
CREATE DATABASE IF NOT EXISTS blog_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE blog_db;

-- 기존 테이블 삭제 (외래키 제약조건 때문에 순서 중요)
SET foreign_key_checks = 0;
DROP TABLE IF EXISTS posts_to_tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS guestbook;
DROP TABLE IF EXISTS users;
SET foreign_key_checks = 1;

-- ======================================
-- 1. users 테이블 (사용자)
-- ======================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  avatar VARCHAR(255) NULL,
  bio TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 인덱스
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- 2. categories 테이블 (카테고리)
-- ======================================
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- 인덱스
  INDEX idx_slug (slug),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- 3. tags 테이블 (태그)
-- ======================================
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- 인덱스
  INDEX idx_slug (slug),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- 4. posts 테이블 (포스트)
-- ======================================
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content LONGTEXT NOT NULL,
  excerpt TEXT NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  author_id INT NOT NULL,
  category_id INT NULL,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 인덱스
  INDEX idx_slug (slug),
  INDEX idx_published (published),
  INDEX idx_author_id (author_id),
  INDEX idx_category_id (category_id),
  INDEX idx_created_at (created_at),
  INDEX idx_published_created (published, created_at),
  
  -- 외래키
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- 5. comments 테이블 (댓글)
-- ======================================
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INT NOT NULL,
  author_id INT NOT NULL,
  parent_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 인덱스
  INDEX idx_post_id (post_id),
  INDEX idx_author_id (author_id),
  INDEX idx_parent_id (parent_id),
  INDEX idx_post_created (post_id, created_at),
  
  -- 외래키
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- 6. posts_to_tags 테이블 (포스트-태그 관계)
-- ======================================
CREATE TABLE posts_to_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- 복합 기본키
  PRIMARY KEY (post_id, tag_id),
  
  -- 인덱스
  INDEX idx_tag_id (tag_id),
  INDEX idx_post_id (post_id),
  
  -- 외래키
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- 7. guestbook 테이블 (방명록)
-- ======================================
CREATE TABLE guestbook (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- 인덱스
  INDEX idx_created_at (created_at),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- 8. 기본 데이터 삽입
-- ======================================

-- 관리자 사용자 추가
INSERT INTO users (name, email, password, role) VALUES 
('황민', 'zxcyui6181@naver.com', '$2b$10$example.hash.for.default.password', 'admin');

-- 기본 카테고리 추가
INSERT INTO categories (name, slug, description) VALUES 
('개발', 'development', '웹 개발, 프로그래밍 관련 글'),
('일상', 'daily', '일상의 소소한 이야기'),
('리뷰', 'review', '제품, 서비스 리뷰'),
('학습', 'learning', '새로운 기술 학습 과정'),
('프로젝트', 'project', '개인/팀 프로젝트 소개');

-- 기본 태그 추가
INSERT INTO tags (name, slug) VALUES 
('React', 'react'),
('Next.js', 'nextjs'),
('TypeScript', 'typescript'),
('JavaScript', 'javascript'),
('Node.js', 'nodejs'),
('MySQL', 'mysql'),
('CSS', 'css'),
('HTML', 'html'),
('Git', 'git'),
('Docker', 'docker'),
('AWS', 'aws'),
('개발일기', 'dev-diary'),
('튜토리얼', 'tutorial'),
('팁', 'tip'),
('에러해결', 'troubleshooting');

-- ======================================
-- 9. 데이터 확인 쿼리
-- ======================================

-- 테이블 구조 확인
-- DESCRIBE users;
-- DESCRIBE categories;
-- DESCRIBE tags;
-- DESCRIBE posts;
-- DESCRIBE comments;
-- DESCRIBE posts_to_tags;
-- DESCRIBE guestbook;

-- 데이터 확인
-- SELECT * FROM users;
-- SELECT * FROM categories;
-- SELECT * FROM tags;

-- AUTO_INCREMENT 값 확인
-- SHOW TABLE STATUS LIKE 'posts';
-- SHOW TABLE STATUS LIKE 'users';

COMMIT;