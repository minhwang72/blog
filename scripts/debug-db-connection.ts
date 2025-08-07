#!/usr/bin/env tsx

/**
 * 데이터베이스 연결 디버깅 스크립트
 * 실서버에서 데이터베이스 연결 문제를 진단합니다.
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function debugDatabaseConnection() {
  console.log('🔍 데이터베이스 연결 디버깅 시작...\n');
  
  // 환경변수 확인
  console.log('📋 환경변수 확인:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`DB_HOST: ${process.env.DB_HOST || '❌ 설정되지 않음'}`);
  console.log(`DB_PORT: ${process.env.DB_PORT || '❌ 설정되지 않음'}`);
  console.log(`DB_USER: ${process.env.DB_USER || '❌ 설정되지 않음'}`);
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
  console.log(`DB_NAME: ${process.env.DB_NAME || '❌ 설정되지 않음'}`);
  console.log('');

  // 필수 환경변수 체크
  const requiredEnvs = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
  
  if (missingEnvs.length > 0) {
    console.log('❌ 누락된 환경변수:');
    missingEnvs.forEach(env => console.log(`  - ${env}`));
    console.log('\n💡 해결방법: .env 파일에 모든 필수 환경변수를 설정하세요.');
    return;
  }

  // 데이터베이스 없이 연결 테스트 (서버 연결 확인)
  console.log('🔗 MySQL 서버 연결 테스트...');
  try {
    const connectionWithoutDB = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      // database 제외하고 연결
    });

    console.log('✅ MySQL 서버 연결 성공');
    
    // 사용 가능한 데이터베이스 목록 확인
    console.log('\n📋 사용 가능한 데이터베이스 목록:');
    const [databases] = await connectionWithoutDB.execute('SHOW DATABASES');
    console.table(databases);
    
    // 지정된 데이터베이스 존재 확인
    const targetDatabase = process.env.DB_NAME;
    const dbExists = (databases as any[]).some(db => 
      Object.values(db).includes(targetDatabase)
    );
    
    if (dbExists) {
      console.log(`✅ 데이터베이스 '${targetDatabase}' 존재함`);
      
      // 데이터베이스 선택하여 연결 테스트
      await connectionWithoutDB.execute(`USE \`${targetDatabase}\``);
      console.log(`✅ 데이터베이스 '${targetDatabase}' 선택 성공`);
      
      // 테이블 목록 확인
      const [tables] = await connectionWithoutDB.execute('SHOW TABLES');
      console.log('\n📋 테이블 목록:');
      console.table(tables);
      
    } else {
      console.log(`❌ 데이터베이스 '${targetDatabase}'가 존재하지 않습니다.`);
      console.log('\n💡 해결방법:');
      console.log(`1. 데이터베이스 생성: CREATE DATABASE \`${targetDatabase}\`;`);
      console.log(`2. 또는 DB_NAME 환경변수를 올바른 데이터베이스 이름으로 변경`);
    }
    
    await connectionWithoutDB.end();
    
  } catch (error: any) {
    console.log('❌ MySQL 서버 연결 실패');
    console.log(`오류: ${error.message}`);
    console.log('\n💡 해결방법:');
    console.log('1. DB_HOST, DB_PORT가 올바른지 확인');
    console.log('2. DB_USER, DB_PASSWORD가 올바른지 확인');
    console.log('3. 방화벽 설정 확인');
    console.log('4. MySQL 서버가 실행 중인지 확인');
  }

  // 최종 연결 테스트 (원래 설정대로)
  console.log('\n🔗 원래 설정으로 연결 테스트...');
  try {
    const fullConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    console.log('✅ 데이터베이스 연결 성공!');
    
    // 간단한 쿼리 테스트
    const [result] = await fullConnection.execute('SELECT 1 as test');
    console.log('✅ 쿼리 테스트 성공:', result);
    
    await fullConnection.end();
    
  } catch (error: any) {
    console.log('❌ 데이터베이스 연결 실패');
    console.log(`오류: ${error.message}`);
  }
}

if (require.main === module) {
  debugDatabaseConnection().catch(console.error);
}

export { debugDatabaseConnection };