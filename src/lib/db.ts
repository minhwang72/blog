import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './db/schema';

// DB 호스트 자동 감지
const isProduction = process.env.NODE_ENV === 'production';
const DB_HOST = isProduction ? '192.168.0.19' : (process.env.DB_HOST || 'monsilserver.iptime.org');

// 환경변수 검증
function validateDatabaseEnvs() {
  const requiredEnvs = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
  
  if (missingEnvs.length > 0) {
    console.error('❌ 누락된 데이터베이스 환경변수:', missingEnvs);
    throw new Error(`Missing required database environment variables: ${missingEnvs.join(', ')}`);
  }
  
  console.log('✅ 데이터베이스 환경변수 검증 완료');
  console.log(`DB 연결 정보: ${process.env.DB_USER}@${DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`);
}

// 데이터베이스 연결 풀 생성
const poolConnection = (() => {
  try {
    validateDatabaseEnvs();
    return mysql.createPool({
      host: DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10,
    });
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    throw error;
  }
})();

export const db = drizzle(poolConnection, { schema, mode: 'default' }); 