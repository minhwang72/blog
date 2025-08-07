import mysql from 'mysql2/promise';

async function checkRemoteDBSchema() {
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

    // 모든 테이블 목록 조회
    console.log('📋 테이블 목록:');
    const [tables] = await connection.execute('SHOW TABLES');
    console.table(tables);

    // 각 테이블의 구조 확인
    const tableNames = (tables as any[]).map(row => Object.values(row)[0]);
    
    for (const tableName of tableNames) {
      console.log(`\n🏗️ ${tableName} 테이블 구조:`);
      const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
      console.table(columns);

      // 인덱스 정보
      console.log(`\n📊 ${tableName} 인덱스 정보:`);
      const [indexes] = await connection.execute(`SHOW INDEX FROM ${tableName}`);
      console.table(indexes);
    }

    // 외래키 제약조건 확인
    console.log('\n🔗 외래키 제약조건:');
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
    `);
    console.table(foreignKeys);

    await connection.end();
    console.log('\n✅ DB 스키마 확인 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  }
}

checkRemoteDBSchema();