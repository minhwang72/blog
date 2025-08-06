-- 댓글 테이블을 비밀번호 기반 시스템으로 변경

USE blog_db;

-- 기존 comments 테이블 백업 (필요시)
-- CREATE TABLE comments_backup AS SELECT * FROM comments;

-- 기존 comments 테이블 삭제 (외래키 제약조건 해제 후)
SET foreign_key_checks = 0;
DROP TABLE IF EXISTS comments;
SET foreign_key_checks = 1;

-- 새로운 comments 테이블 생성
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  post_id INT NOT NULL,
  parent_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_parent_id (parent_id),
  INDEX idx_post_created (post_id, created_at),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 확인
DESCRIBE comments;