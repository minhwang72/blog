#!/usr/bin/env ts-node

import mysql from 'mysql2/promise';

async function fixAllCreatedAt() {
  console.log('🔧 모든 테이블의 created_at/updated_at 필드 수정 중...\n');

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

    // 모든 테이블의 created_at, updated_at 필드를 NULL 허용으로 변경
    const tables = ['users', 'categories', 'tags', 'posts', 'comments', 'posts_to_tags', 'guestbook'];
    
    for (const table of tables) {
      console.log(`🔧 ${table} 테이블 수정 중...`);
      
      // 테이블 구조 확인
      const [columns] = await connection.execute(`DESCRIBE ${table}`);
      const columnList = columns as any[];
      
      const hasCreatedAt = columnList.some(col => col.Field === 'created_at');
      const hasUpdatedAt = columnList.some(col => col.Field === 'updated_at');
      
      if (hasCreatedAt) {
        try {
          await connection.execute(`
            ALTER TABLE ${table} 
            MODIFY COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
          `);
          console.log(`  ✓ ${table}.created_at 수정 완료`);
        } catch (error) {
          console.log(`  ⚠️ ${table}.created_at 수정 실패: ${error}`);
        }
      }
      
      if (hasUpdatedAt) {
        try {
          await connection.execute(`
            ALTER TABLE ${table} 
            MODIFY COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          `);
          console.log(`  ✓ ${table}.updated_at 수정 완료`);
        } catch (error) {
          console.log(`  ⚠️ ${table}.updated_at 수정 실패: ${error}`);
        }
      }
    }

    console.log('\n📋 수정 후 각 테이블 구조 확인:');
    
    for (const table of tables) {
      console.log(`\n--- ${table} ---`);
      const [columns] = await connection.execute(`DESCRIBE ${table}`);
      const columnList = columns as any[];
      
      const timestampCols = columnList.filter(col => 
        col.Field === 'created_at' || col.Field === 'updated_at'
      );
      
      if (timestampCols.length > 0) {
        console.table(timestampCols);
      } else {
        console.log('  (timestamp 컬럼 없음)');
      }
    }

    await connection.end();
    console.log('\n🎉 모든 작업이 완료되었습니다!');

  } catch (error) {
    console.error('❌ 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  fixAllCreatedAt();
}

export default fixAllCreatedAt;