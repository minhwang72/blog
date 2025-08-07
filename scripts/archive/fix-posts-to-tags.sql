-- posts_to_tags 테이블의 created_at 필드 수정
USE blog_db;

-- 기존 테이블 구조 확인
DESCRIBE posts_to_tags;

-- created_at 필드에 기본값 추가하거나 NULL 허용으로 변경
ALTER TABLE posts_to_tags 
MODIFY COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;

-- 또는 아예 created_at 필드를 제거 (선택사항)
-- ALTER TABLE posts_to_tags DROP COLUMN created_at;

-- 확인
DESCRIBE posts_to_tags;