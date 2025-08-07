#!/usr/bin/env tsx

/**
 * 관리자 테이블 생성 스크립트
 */

import * as dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

async function setupAdminTables() {
  let connection;
  
  try {
    console.log('🔧 관리자 테이블 생성 중...');
    
    // 데이터베이스 연결
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 관리자 계정 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`admins\` (
        \`id\` int AUTO_INCREMENT PRIMARY KEY,
        \`username\` varchar(50) NOT NULL UNIQUE,
        \`password\` varchar(255) NOT NULL,
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_admin_username\` (\`username\`)
      )
    `);
    console.log('✅ admins 테이블 생성 완료');

    // 관리자 세션 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`admin_sessions\` (
        \`id\` varchar(255) PRIMARY KEY,
        \`admin_id\` int NOT NULL,
        \`expires_at\` timestamp NOT NULL,
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_admin_session_admin_id\` (\`admin_id\`),
        INDEX \`idx_admin_session_expires_at\` (\`expires_at\`)
      )
    `);
    console.log('✅ admin_sessions 테이블 생성 완료');

    // 소개 페이지 컨텐츠 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`about_content\` (
        \`id\` int AUTO_INCREMENT PRIMARY KEY,
        \`title\` varchar(255) NOT NULL,
        \`content\` longtext NOT NULL,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`updated_by\` int NOT NULL
      )
    `);
    console.log('✅ about_content 테이블 생성 완료');

    console.log('🎉 모든 관리자 테이블이 성공적으로 생성되었습니다!');
    
  } catch (error: any) {
    console.error('❌ 테이블 생성 실패:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  setupAdminTables();
}

export { setupAdminTables };