#!/usr/bin/env ts-node

import mysql from 'mysql2/promise';

async function fixCreatedAt() {
  console.log('🔧 created_at 필드 수정 중...\n');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blog_db',
  };

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ 데이터베이스에 연결되었습니다.\n');

    // posts_to_tags 테이블 구조 확인
    console.log('📋 posts_to_tags 테이블 구조:');
    const [columns] = await connection.execute('DESCRIBE posts_to_tags');
    console.table(columns);
    console.log('');

    // created_at 필드를 NULL 허용으로 변경
    console.log('🔧 created_at 필드를 NULL 허용으로 변경 중...');
    await connection.execute(`
      ALTER TABLE posts_to_tags 
      MODIFY COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✅ created_at 필드 수정 완료');

    // 수정 후 구조 확인
    console.log('\n📋 수정된 posts_to_tags 테이블 구조:');
    const [newColumns] = await connection.execute('DESCRIBE posts_to_tags');
    console.table(newColumns);

    await connection.end();
    console.log('\n🎉 모든 작업이 완료되었습니다!');

  } catch (error) {
    console.error('❌ 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  fixCreatedAt();
}

export default fixCreatedAt;