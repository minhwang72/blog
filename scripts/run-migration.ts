import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'monsilserver.iptime.org',
    port: 3306,
    user: 'min',
    password: 'f8tgw3lshms!',
    database: 'blog_db',
  });

  try {
    console.log('데이터베이스 연결 성공');
    
    // 마이그레이션 파일 읽기
    const migrationPath = join(process.cwd(), 'drizzle', '0002_add_featured_image.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('마이그레이션 SQL:', migrationSQL);
    
    // 마이그레이션 실행
    await connection.execute(migrationSQL);
    
    console.log('✅ featured_image 컬럼 추가 완료!');
    
    // 컬럼이 제대로 추가되었는지 확인
    const [rows] = await connection.execute(`
      DESCRIBE posts
    `);
    
    console.log('현재 posts 테이블 구조:');
    console.table(rows);
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
