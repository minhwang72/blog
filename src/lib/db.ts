import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './db/schema';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config({ path: '.env.local' });

// 환경변수 검증 및 보안 강화
const isProduction = process.env.NODE_ENV === 'production';

// 환경변수 검증 함수 개선
function validateDatabaseEnvs() {
  const requiredEnvs = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
  
  if (missingEnvs.length > 0) {
    console.error('❌ 누락된 데이터베이스 환경변수:', missingEnvs);
    throw new Error(`Missing required database environment variables: ${missingEnvs.join(', ')}`);
  }
  
  // 보안을 위해 민감 정보 로그 제거
  console.log('✅ 데이터베이스 환경변수 검증 완료');
  if (!isProduction) {
    console.log(`DB 연결 정보: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`);
  }
}

// 데이터베이스 연결 풀 생성
const poolConnection = (() => {
  try {
    validateDatabaseEnvs();
    
    // 연결 설정 개선
    const config: mysql.PoolOptions = {
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      connectionLimit: isProduction ? 10 : 5,
      queueLimit: 0,
      ssl: undefined,
    };
    
    return mysql.createPool(config);
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    throw error;
  }
})();

export const db = drizzle(poolConnection, { schema, mode: 'default' }); 