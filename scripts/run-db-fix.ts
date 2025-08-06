#!/usr/bin/env ts-node

/**
 * 데이터베이스 재구축 스크립트
 * 
 * 사용법:
 * 1. yarn ts-node scripts/run-db-fix.ts
 * 2. 또는 직접 MySQL에서 scripts/fix-database.sql 실행
 */

import * as fs from 'fs';
import * as path from 'path';
import mysql from 'mysql2/promise';

async function runDatabaseFix() {
  console.log('🔧 데이터베이스 재구축을 시작합니다...\n');

  // 환경변수에서 DB 정보 가져오기 (database 제외하고 연결)
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  };

  const databaseName = process.env.DB_NAME || 'blog_db';

  console.log('📊 데이터베이스 연결 정보:');
  console.log(`  호스트: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`  데이터베이스: ${databaseName}`);
  console.log(`  사용자: ${dbConfig.user}\n`);

  try {
    // MySQL 연결 (데이터베이스 없이)
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ MySQL 서버에 연결되었습니다.\n');

    // 데이터베이스 생성
    console.log('🚀 데이터베이스를 생성합니다...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();
    console.log('✅ 데이터베이스가 생성되었습니다.\n');

    // 다시 데이터베이스를 지정해서 연결
    const dbConfigWithDB = { ...dbConfig, database: databaseName };
    const connectionWithDB = await mysql.createConnection(dbConfigWithDB);
    console.log('✅ 데이터베이스에 연결되었습니다.\n');

    // SQL 파일 읽기
    const sqlPath = path.join(__dirname, 'fix-database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📂 SQL 스크립트를 읽었습니다.');
    console.log(`  파일: ${sqlPath}\n`);

    // SQL을 개별 명령어로 분리해서 실행
    console.log('🚀 SQL 스크립트를 실행합니다...');
    
    // 먼저 기존 테이블 삭제
    console.log('  🗑️ 기존 테이블 삭제 중...');
    await connectionWithDB.execute('SET foreign_key_checks = 0');
    const dropTables = ['posts_to_tags', 'comments', 'posts', 'tags', 'categories', 'guestbook', 'users'];
    for (const table of dropTables) {
      try {
        await connectionWithDB.execute(`DROP TABLE IF EXISTS ${table}`);
        console.log(`    ✓ ${table} 테이블 삭제`);
      } catch (error) {
        console.log(`    - ${table} 테이블 없음`);
      }
    }
    await connectionWithDB.execute('SET foreign_key_checks = 1');
    console.log('');

    // 개별 테이블 생성
    console.log('  📝 테이블 생성 중...');
    
    // users 테이블
    await connectionWithDB.execute(\`
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
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`);
    console.log('    ✓ users 테이블 생성');

    // categories 테이블
    await connectionWithDB.execute(\`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`);
    console.log('    ✓ categories 테이블 생성');

    // tags 테이블
    await connectionWithDB.execute(\`
      CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`);
    console.log('    ✓ tags 테이블 생성');

    // posts 테이블
    await connectionWithDB.execute(\`
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
        INDEX idx_slug (slug),
        INDEX idx_published (published),
        INDEX idx_author_id (author_id),
        INDEX idx_category_id (category_id),
        INDEX idx_created_at (created_at),
        INDEX idx_published_created (published, created_at),
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`);
    console.log('    ✓ posts 테이블 생성');

    // comments 테이블
    await connectionWithDB.execute(\`
      CREATE TABLE comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        post_id INT NOT NULL,
        author_id INT NOT NULL,
        parent_id INT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_post_id (post_id),
        INDEX idx_author_id (author_id),
        INDEX idx_parent_id (parent_id),
        INDEX idx_post_created (post_id, created_at),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`);
    console.log('    ✓ comments 테이블 생성');

    // posts_to_tags 테이블
    await connectionWithDB.execute(\`
      CREATE TABLE posts_to_tags (
        post_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (post_id, tag_id),
        INDEX idx_tag_id (tag_id),
        INDEX idx_post_id (post_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`);
    console.log('    ✓ posts_to_tags 테이블 생성');

    // guestbook 테이블
    await connectionWithDB.execute(\`
      CREATE TABLE guestbook (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`);
    console.log('    ✓ guestbook 테이블 생성');

    console.log('');

    // 기본 데이터 삽입
    console.log('  📊 기본 데이터 삽입 중...');
    
    // 관리자 사용자
    await connectionWithDB.execute(\`
      INSERT INTO users (name, email, password, role) VALUES 
      ('황민', 'zxcyui6181@naver.com', '$2b$10$example.hash.for.default.password', 'admin')
    \`);
    console.log('    ✓ 관리자 계정 생성');

    // 기본 카테고리
    await connectionWithDB.execute(\`
      INSERT INTO categories (name, slug, description) VALUES 
      ('개발', 'development', '웹 개발, 프로그래밍 관련 글'),
      ('일상', 'daily', '일상의 소소한 이야기'),
      ('리뷰', 'review', '제품, 서비스 리뷰'),
      ('학습', 'learning', '새로운 기술 학습 과정'),
      ('프로젝트', 'project', '개인/팀 프로젝트 소개')
    \`);
    console.log('    ✓ 기본 카테고리 생성');

    // 기본 태그
    await connectionWithDB.execute(\`
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
      ('에러해결', 'troubleshooting')
    \`);
    console.log('    ✓ 기본 태그 생성');
    
    console.log('✅ 데이터베이스 재구축이 완료되었습니다!\n');

    // 확인 쿼리들
    console.log('🔍 결과 확인 중...\n');

    // 테이블 목록 확인
    const [tables] = await connectionWithDB.execute('SHOW TABLES');
    console.log('📋 생성된 테이블 목록:');
    (tables as any[]).forEach((table: any) => {
      console.log(`  ✓ ${Object.values(table)[0]}`);
    });
    console.log('');

    // 사용자 확인
    const [users] = await connectionWithDB.execute('SELECT id, name, email, role FROM users');
    console.log('👤 사용자 목록:');
    (users as any[]).forEach((user: any) => {
      console.log(`  ✓ ID: ${user.id}, 이름: ${user.name}, 이메일: ${user.email}, 역할: ${user.role}`);
    });
    console.log('');

    // 카테고리 확인
    const [categories] = await connectionWithDB.execute('SELECT id, name, slug FROM categories');
    console.log('📂 카테고리 목록:');
    (categories as any[]).forEach((category: any) => {
      console.log(`  ✓ ID: ${category.id}, 이름: ${category.name}, 슬러그: ${category.slug}`);
    });
    console.log('');

    // 태그 확인
    const [tags] = await connectionWithDB.execute('SELECT id, name, slug FROM tags');
    console.log('🏷️ 태그 목록:');
    (tags as any[]).forEach((tag: any) => {
      console.log(`  ✓ ID: ${tag.id}, 이름: ${tag.name}, 슬러그: ${tag.slug}`);
    });
    console.log('');

    // AUTO_INCREMENT 확인
    const [postStatus] = await connectionWithDB.execute('SHOW TABLE STATUS LIKE "posts"');
    const [userStatus] = await connectionWithDB.execute('SHOW TABLE STATUS LIKE "users"');
    
    console.log('🔢 AUTO_INCREMENT 확인:');
    console.log(`  posts 테이블: ${(postStatus as any[])[0]?.Auto_increment || 'N/A'}`);
    console.log(`  users 테이블: ${(userStatus as any[])[0]?.Auto_increment || 'N/A'}`);
    console.log('');

    await connectionWithDB.end();
    console.log('🎉 모든 작업이 완료되었습니다!');
    console.log('\n💡 이제 다음 단계를 진행하세요:');
    console.log('  1. yarn drizzle-kit generate (새 마이그레이션 생성)');
    console.log('  2. 애플리케이션 재시작');
    console.log('  3. MCP를 통해 새 포스트 생성 테스트');

  } catch (error) {
    console.error('❌ 오류가 발생했습니다:', error);
    console.log('\n🔧 해결 방법:');
    console.log('  1. MySQL 서버가 실행 중인지 확인');
    console.log('  2. 환경변수(.env)가 올바른지 확인');
    console.log('  3. 데이터베이스 권한이 충분한지 확인');
    console.log('  4. 직접 MySQL 클라이언트에서 scripts/fix-database.sql 실행');
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  runDatabaseFix();
}

export default runDatabaseFix;