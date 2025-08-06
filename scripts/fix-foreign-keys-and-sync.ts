import mysql from 'mysql2/promise';

async function fixForeignKeysAndSync() {
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

    // 1. posts 테이블의 외래키 제약조건 삭제
    console.log('\n🔗 posts 테이블 외래키 제약조건 삭제...');
    try {
      await connection.execute('ALTER TABLE posts DROP FOREIGN KEY posts_ibfk_2');
      console.log('✅ posts_ibfk_2 (category_id) 외래키 삭제');
    } catch (error: any) {
      console.log('⚠️ posts_ibfk_2 외래키가 이미 없거나 오류:', error.message);
    }

    try {
      await connection.execute('ALTER TABLE posts DROP FOREIGN KEY posts_ibfk_1');
      console.log('✅ posts_ibfk_1 (author_id) 외래키 삭제');
    } catch (error: any) {
      console.log('⚠️ posts_ibfk_1 외래키가 이미 없거나 오류:', error.message);
    }

    // 2. posts 테이블 컬럼 수정
    console.log('\n📄 posts 테이블 컬럼 수정...');

    // category_id를 NOT NULL로 변경
    await connection.execute(`
      ALTER TABLE posts 
      MODIFY COLUMN category_id INT NOT NULL
    `);
    console.log('✅ posts.category_id를 NOT NULL로 변경');

    // 3. 외래키 제약조건 다시 생성
    console.log('\n🔗 외래키 제약조건 재생성...');
    
    await connection.execute(`
      ALTER TABLE posts 
      ADD CONSTRAINT posts_ibfk_1 
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    `);
    console.log('✅ posts -> users 외래키 재생성');

    await connection.execute(`
      ALTER TABLE posts 
      ADD CONSTRAINT posts_ibfk_2 
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    `);
    console.log('✅ posts -> categories 외래키 재생성');

    // 외래키 제약조건 다시 활성화
    await connection.execute('SET foreign_key_checks = 1');
    console.log('\n🔒 외래키 제약조건 활성화');

    // 최종 외래키 제약조건 확인
    console.log('\n🔗 최종 외래키 제약조건:');
    const [foreignKeys] = await connection.execute(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE REFERENCED_TABLE_SCHEMA = 'blog_db' 
        AND REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY TABLE_NAME, COLUMN_NAME
    `);
    console.table(foreignKeys);

    // posts 테이블 구조 확인
    console.log('\n📄 posts 테이블 최종 구조:');
    const [postsColumns] = await connection.execute('DESCRIBE posts');
    console.table(postsColumns);

    await connection.end();
    console.log('\n🎉 외래키 및 스키마 동기화 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  }
}

fixForeignKeysAndSync();