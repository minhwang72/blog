import mysql from 'mysql2/promise';

async function syncRemoteDBSchema() {
  const dbConfig = {
    host: 'monsilserver.iptime.org',
    port: 3306,
    user: 'min',
    password: 'f8tgw3lshms!',
    database: 'blog_db',
  };

  try {
    console.log('🔗 원격 DB 연결 중...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ 연결 성공!\n');

    // 외래키 제약조건 해제
    await connection.execute('SET foreign_key_checks = 0');
    console.log('🔓 외래키 제약조건 해제');

    // 1. guestbook 테이블 삭제 (더 이상 사용하지 않음)
    console.log('🗑️ guestbook 테이블 삭제...');
    await connection.execute('DROP TABLE IF EXISTS guestbook');
    console.log('✅ guestbook 테이블 삭제 완료');

    // 2. users 테이블 수정
    console.log('\n👤 users 테이블 수정...');
    
    // password를 NOT NULL로 변경
    await connection.execute(`
      ALTER TABLE users 
      MODIFY COLUMN password VARCHAR(255) NOT NULL
    `);
    console.log('✅ users.password를 NOT NULL로 변경');

    // avatar 컬럼 추가
    try {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN avatar VARCHAR(255) AFTER password
      `);
      console.log('✅ users.avatar 컬럼 추가');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ users.avatar 컬럼이 이미 존재함');
      } else {
        throw error;
      }
    }

    // bio 컬럼 추가
    try {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN bio TEXT AFTER avatar
      `);
      console.log('✅ users.bio 컬럼 추가');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ users.bio 컬럼이 이미 존재함');
      } else {
        throw error;
      }
    }

    // updated_at을 NOT NULL로 변경
    await connection.execute(`
      ALTER TABLE users 
      MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    `);
    console.log('✅ users.updated_at을 NOT NULL로 변경');

    // created_at을 NOT NULL로 변경
    await connection.execute(`
      ALTER TABLE users 
      MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    `);
    console.log('✅ users.created_at을 NOT NULL로 변경');

    // 3. categories 테이블 수정
    console.log('\n📝 categories 테이블 수정...');
    
    // name과 slug 컬럼 길이를 100으로 변경
    await connection.execute(`
      ALTER TABLE categories 
      MODIFY COLUMN name VARCHAR(100) NOT NULL UNIQUE
    `);
    await connection.execute(`
      ALTER TABLE categories 
      MODIFY COLUMN slug VARCHAR(100) NOT NULL UNIQUE
    `);
    console.log('✅ categories.name, slug 길이를 100으로 변경');

    // 4. tags 테이블 수정
    console.log('\n🏷️ tags 테이블 수정...');
    
    // name과 slug 컬럼 길이를 100으로 변경
    await connection.execute(`
      ALTER TABLE tags 
      MODIFY COLUMN name VARCHAR(100) NOT NULL UNIQUE
    `);
    await connection.execute(`
      ALTER TABLE tags 
      MODIFY COLUMN slug VARCHAR(100) NOT NULL UNIQUE
    `);
    console.log('✅ tags.name, slug 길이를 100으로 변경');

    // 5. posts 테이블 수정
    console.log('\n📄 posts 테이블 수정...');
    
    // title과 slug 컬럼 길이를 255로 변경
    await connection.execute(`
      ALTER TABLE posts 
      MODIFY COLUMN title VARCHAR(255) NOT NULL
    `);
    await connection.execute(`
      ALTER TABLE posts 
      MODIFY COLUMN slug VARCHAR(255) NOT NULL UNIQUE
    `);
    console.log('✅ posts.title, slug 길이를 255로 변경');

    // published를 NOT NULL로 변경
    await connection.execute(`
      ALTER TABLE posts 
      MODIFY COLUMN published BOOLEAN DEFAULT TRUE NOT NULL
    `);
    console.log('✅ posts.published를 NOT NULL로 변경');

    // view_count를 NOT NULL로 변경
    await connection.execute(`
      ALTER TABLE posts 
      MODIFY COLUMN view_count INT DEFAULT 0 NOT NULL
    `);
    console.log('✅ posts.view_count를 NOT NULL로 변경');

    // category_id를 NOT NULL로 변경
    await connection.execute(`
      ALTER TABLE posts 
      MODIFY COLUMN category_id INT NOT NULL
    `);
    console.log('✅ posts.category_id를 NOT NULL로 변경');

    // 외래키 제약조건 다시 활성화
    await connection.execute('SET foreign_key_checks = 1');
    console.log('\n🔒 외래키 제약조건 활성화');

    // 최종 테이블 구조 확인
    console.log('\n📋 동기화된 테이블 목록:');
    const [tables] = await connection.execute('SHOW TABLES');
    console.table(tables);

    // 각 테이블의 구조 간단 확인
    const tableNames = (tables as any[]).map(row => Object.values(row)[0]);
    
    for (const tableName of tableNames) {
      console.log(`\n📊 ${tableName} 구조:`);
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = 'blog_db' AND TABLE_NAME = '${tableName}'
        ORDER BY ORDINAL_POSITION
      `);
      console.table(columns);
    }

    await connection.end();
    console.log('\n🎉 원격 DB 스키마 동기화 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  }
}

syncRemoteDBSchema();