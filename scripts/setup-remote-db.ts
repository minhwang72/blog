import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const databaseName = process.env.DB_NAME || 'blog_db';

async function setupRemoteDatabase() {
  console.log('🔗 원격 서버 연결 중...');
  console.log(`Host: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`User: ${dbConfig.user}`);
  console.log(`Database: ${databaseName}`);

  try {
    // 데이터베이스 없이 연결
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ 원격 서버 연결 성공!');

    // 데이터베이스 생성
    console.log(`\n🗄️ ${databaseName} 데이터베이스 생성 중...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ 데이터베이스 생성 완료!');
    
    await connection.end();

    // 데이터베이스 지정해서 재연결
    const dbConfigWithDB = { ...dbConfig, database: databaseName };
    const connectionWithDB = await mysql.createConnection(dbConfigWithDB);
    console.log('✅ 데이터베이스 연결 성공!');

    // 기존 테이블 확인
    console.log('\n📋 기존 테이블 확인 중...');
    const [tables] = await connectionWithDB.query('SHOW TABLES');
    console.log('기존 테이블:', tables);

    // 외래키 제약 조건 비활성화
    await connectionWithDB.execute('SET foreign_key_checks = 0');

    // 기존 테이블 삭제 (있다면)
    const dropTables = ['posts_to_tags', 'comments', 'posts', 'tags', 'categories', 'guestbook', 'users'];
    for (const table of dropTables) {
      try {
        await connectionWithDB.execute(`DROP TABLE IF EXISTS ${table}`);
        console.log(`🗑️ ${table} 테이블 삭제 완료`);
      } catch (error) {
        console.log(`⚠️ ${table} 테이블 삭제 실패 (존재하지 않을 수 있음)`);
      }
    }

    // 외래키 제약 조건 활성화
    await connectionWithDB.execute('SET foreign_key_checks = 1');

    console.log('\n🏗️ 새 테이블 생성 중...');

    // users 테이블 생성
    await connectionWithDB.execute(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX email_idx (email),
        INDEX role_idx (role),
        INDEX created_at_idx (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ users 테이블 생성 완료');

    // categories 테이블 생성
    await connectionWithDB.execute(`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX slug_idx (slug),
        INDEX name_idx (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ categories 테이블 생성 완료');

    // tags 테이블 생성
    await connectionWithDB.execute(`
      CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX slug_idx (slug),
        INDEX name_idx (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ tags 테이블 생성 완료');

    // posts 테이블 생성
    await connectionWithDB.execute(`
      CREATE TABLE posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) UNIQUE NOT NULL,
        content LONGTEXT NOT NULL,
        excerpt TEXT,
        published BOOLEAN DEFAULT false,
        view_count INT DEFAULT 0,
        author_id INT NOT NULL,
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX slug_idx (slug),
        INDEX published_idx (published),
        INDEX author_idx (author_id),
        INDEX category_idx (category_id),
        INDEX created_at_idx (created_at),
        INDEX published_created_idx (published, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ posts 테이블 생성 완료');

    // comments 테이블 생성
    await connectionWithDB.execute(`
      CREATE TABLE comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        post_id INT NOT NULL,
        author_id INT,
        parent_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
        INDEX post_idx (post_id),
        INDEX author_idx (author_id),
        INDEX parent_idx (parent_id),
        INDEX post_created_idx (post_id, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ comments 테이블 생성 완료');

    // posts_to_tags 테이블 생성
    await connectionWithDB.execute(`
      CREATE TABLE posts_to_tags (
        post_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
        INDEX tag_idx (tag_id),
        INDEX post_idx (post_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ posts_to_tags 테이블 생성 완료');

    // guestbook 테이블 생성
    await connectionWithDB.execute(`
      CREATE TABLE guestbook (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX created_at_idx (created_at),
        INDEX name_idx (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ guestbook 테이블 생성 완료');

    console.log('\n🌱 초기 데이터 삽입 중...');

    // 기본 관리자 계정 생성
    await connectionWithDB.execute(`
      INSERT INTO users (name, email, role, password) 
      VALUES ('관리자', 'admin@example.com', 'admin', 'hashed_password_here')
    `);
    console.log('✅ 관리자 계정 생성 완료');

    // 기본 카테고리 생성
    const categories = [
      ['개발', 'development', '개발 관련 포스트'],
      ['일상', 'daily', '일상 이야기'],
      ['프로젝트', 'project', '프로젝트 소개'],
      ['학습', 'learning', '학습 기록']
    ];

    for (const [name, slug, description] of categories) {
      await connectionWithDB.execute(
        'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
        [name, slug, description]
      );
    }
    console.log('✅ 기본 카테고리 생성 완료');

    // 기본 태그 생성
    const tags = [
      ['JavaScript', 'javascript'],
      ['TypeScript', 'typescript'],
      ['React', 'react'],
      ['Next.js', 'nextjs'],
      ['Node.js', 'nodejs'],
      ['데이터베이스', 'database'],
      ['개발일지', 'dev-log']
    ];

    for (const [name, slug] of tags) {
      await connectionWithDB.execute(
        'INSERT INTO tags (name, slug) VALUES (?, ?)',
        [name, slug]
      );
    }
    console.log('✅ 기본 태그 생성 완료');

    // 테이블 확인
    console.log('\n📊 생성된 테이블 확인...');
    const [newTables] = await connectionWithDB.query('SHOW TABLES');
    console.log('생성된 테이블:', newTables);

    // 각 테이블의 레코드 수 확인
    const tableNames = ['users', 'categories', 'tags', 'posts', 'comments', 'posts_to_tags', 'guestbook'];
    for (const tableName of tableNames) {
      try {
        const [result] = await connectionWithDB.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`📊 ${tableName}: ${(result as any)[0].count}개 레코드`);
      } catch (error) {
        console.log(`⚠️ ${tableName} 테이블 확인 실패`);
      }
    }

    await connectionWithDB.end();
    console.log('\n🎉 원격 데이터베이스 설정 완료!');

  } catch (error) {
    console.error('❌ 원격 데이터베이스 설정 실패:', error);
    throw error;
  }
}

// 스크립트 실행
setupRemoteDatabase()
  .then(() => {
    console.log('\n✅ 모든 작업이 완료되었습니다!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ 작업 실패:', error);
    process.exit(1);
  });