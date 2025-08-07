#!/usr/bin/env tsx

/**
 * 광고 설정 테이블 생성 스크립트
 */

import * as dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

async function setupAdsTables() {
  let connection;
  
  try {
    console.log('🔧 광고 설정 테이블 생성 중...');
    
    // 데이터베이스 연결
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 광고 설정 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`ad_settings\` (
        \`id\` int AUTO_INCREMENT PRIMARY KEY,
        \`name\` varchar(100) NOT NULL,
        \`position\` enum('top', 'middle', 'bottom', 'sidebar', 'inline') NOT NULL,
        \`ad_code\` longtext NOT NULL,
        \`enabled\` boolean DEFAULT true NOT NULL,
        \`post_types\` varchar(255) DEFAULT 'all',
        \`display_rules\` longtext,
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        \`updated_by\` int NOT NULL,
        INDEX \`idx_ad_name\` (\`name\`),
        INDEX \`idx_ad_position\` (\`position\`),
        INDEX \`idx_ad_enabled\` (\`enabled\`)
      )
    `);
    console.log('✅ ad_settings 테이블 생성 완료');

    console.log('🎉 모든 광고 관련 테이블이 성공적으로 생성되었습니다!');
    
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
  setupAdsTables();
}

export { setupAdsTables };