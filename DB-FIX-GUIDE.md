# 🛠️ 데이터베이스 수정 가이드

포스트 ID가 null로 생성되는 문제를 해결하기 위한 완전한 데이터베이스 재구축 가이드입니다.

## 🔍 문제 상황

- 포스트 생성 시 ID가 null로 설정됨
- posts_to_tags 테이블에도 null 값들이 생성됨
- AUTO_INCREMENT가 제대로 작동하지 않음

## 🚀 해결 방법

### 방법 1: 자동 스크립트 실행 (권장)

```bash
# 1. 데이터베이스 완전 재구축
yarn db:fix

# 2. 또는 재구축 + 새 마이그레이션 생성
yarn db:reset
```

### 방법 2: 직접 SQL 실행

1. **MySQL 클라이언트 접속**
   ```bash
   mysql -u [사용자명] -p [데이터베이스명]
   ```

2. **SQL 파일 실행**
   ```sql
   source /path/to/scripts/fix-database.sql;
   ```

3. **또는 내용 복사해서 실행**
   - `scripts/fix-database.sql` 파일의 내용을 복사해서 MySQL 클라이언트에 붙여넣기

## 📊 수정된 스키마 특징

### 🔧 개선 사항

1. **완전한 AUTO_INCREMENT 설정**
   ```sql
   id INT AUTO_INCREMENT PRIMARY KEY
   ```

2. **성능 최적화 인덱스**
   - 검색/필터링에 자주 사용되는 컬럼들에 인덱스 추가
   - 복합 인덱스로 쿼리 성능 향상

3. **외래키 제약조건**
   - CASCADE 설정으로 데이터 일관성 보장
   - 참조 무결성 강화

4. **MySQL 8.0 최적화**
   - utf8mb4 charset
   - InnoDB 엔진
   - 적절한 데이터 타입 선택

### 📋 테이블 구조

#### users 테이블
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  avatar VARCHAR(255) NULL,
  bio TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### posts 테이블
```sql
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
  
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

#### posts_to_tags 테이블
```sql
CREATE TABLE posts_to_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## 🎯 기본 데이터

### 👤 관리자 계정
- **이름**: 황민
- **이메일**: zxcyui6181@naver.com
- **역할**: admin

### 📂 기본 카테고리
- 개발 (development)
- 일상 (daily)
- 리뷰 (review)
- 학습 (learning)
- 프로젝트 (project)

### 🏷️ 기본 태그
- React, Next.js, TypeScript, JavaScript
- Node.js, MySQL, CSS, HTML
- Git, Docker, AWS
- 개발일기, 튜토리얼, 팁, 에러해결

## ✅ 확인 사항

### 1. AUTO_INCREMENT 확인
```sql
SHOW TABLE STATUS LIKE 'posts';
SHOW TABLE STATUS LIKE 'users';
```

### 2. 테이블 생성 확인
```sql
SHOW TABLES;
```

### 3. 외래키 제약조건 확인
```sql
SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_SCHEMA = 'blog_db';
```

### 4. 인덱스 확인
```sql
SHOW INDEXES FROM posts;
```

## 🧪 테스트

### 1. 새 포스트 생성 테스트
```bash
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer your-token" \
-d '{"tool": "create_blog_post", "args": {"title": "테스트 포스트", "content": "테스트 내용"}}' \
http://localhost:3000/api/mcp/
```

### 2. ID 값 확인
```sql
SELECT id, title FROM posts ORDER BY id DESC LIMIT 5;
```

## 🔄 롤백 방법

만약 문제가 발생하면 기존 백업에서 복구하거나:

```sql
-- 기존 Drizzle 스키마로 복구
yarn db:push
```

## 📞 지원

문제가 계속 발생하면:
1. MySQL 에러 로그 확인
2. 환경변수(.env) 설정 확인
3. 데이터베이스 권한 확인
4. 포트 및 연결 상태 확인

---

**⚠️ 주의**: 이 스크립트는 기존 데이터를 모두 삭제하고 새로 생성합니다. 중요한 데이터가 있다면 미리 백업하세요!