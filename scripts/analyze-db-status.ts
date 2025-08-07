#!/usr/bin/env tsx

/**
 * 원격 DB 상태 및 테이블 분석 스크립트
 */

import * as dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

async function analyzeDatabase() {
  let connection;
  
  try {
    console.log('🔍 원격 데이터베이스 연결 중...');
    console.log(`📍 DB 정보: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    
    // 데이터베이스 연결
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ 데이터베이스 연결 성공!\n');

    // 모든 테이블 목록 조회
    console.log('📊 === 테이블 목록 ===');
    const [tables] = await connection.execute('SHOW TABLES');
    console.table(tables);

    // 각 테이블별 데이터 개수 확인
    console.log('\n📈 === 테이블별 데이터 개수 ===');
    const tableNames = (tables as any[]).map(row => Object.values(row)[0]);
    
    for (const tableName of tableNames) {
      const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      const count = (countResult as any)[0].count;
      console.log(`${tableName}: ${count}개`);
    }

    // 핵심 테이블 구조 확인
    console.log('\n🏗️  === 핵심 테이블 구조 ===');
    
    const importantTables = ['posts', 'categories', 'users', 'comments', 'admins', 'admin_sessions', 'about_content', 'ad_settings'];
    
    for (const tableName of importantTables) {
      if (tableNames.includes(tableName)) {
        console.log(`\n--- ${tableName} 테이블 구조 ---`);
        const [structure] = await connection.execute(`DESCRIBE \`${tableName}\``);
        console.table(structure);
        
        // 샘플 데이터 (최대 3개)
        console.log(`--- ${tableName} 샘플 데이터 ---`);
        const [samples] = await connection.execute(`SELECT * FROM \`${tableName}\` LIMIT 3`);
        if ((samples as any[]).length > 0) {
          console.table(samples);
        } else {
          console.log('데이터 없음');
        }
      } else {
        console.log(`❌ ${tableName} 테이블이 존재하지 않습니다.`);
      }
    }

    // 특별 확인: about_content 테이블
    console.log('\n🔍 === about_content 테이블 상세 확인 ===');
    if (tableNames.includes('about_content')) {
      const [aboutData] = await connection.execute('SELECT * FROM about_content ORDER BY updated_at DESC LIMIT 1');
      if ((aboutData as any[]).length > 0) {
        const content = (aboutData as any)[0];
        console.log('✅ about_content 데이터 존재:');
        console.log(`- ID: ${content.id}`);
        console.log(`- 제목: ${content.title}`);
        console.log(`- 내용 길이: ${content.content?.length || 0}자`);
        console.log(`- 마지막 업데이트: ${content.updated_at}`);
        console.log(`- 업데이트한 관리자: ${content.updated_by}`);
      } else {
        console.log('❌ about_content 테이블에 데이터가 없습니다.');
      }
    }

    // 관리자 계정 확인
    console.log('\n👤 === 관리자 계정 확인 ===');
    if (tableNames.includes('admins')) {
      const [adminData] = await connection.execute('SELECT id, username, created_at FROM admins');
      if ((adminData as any[]).length > 0) {
        console.table(adminData);
      } else {
        console.log('❌ 관리자 계정이 없습니다.');
      }
    }

    // 게시글 상태 확인
    console.log('\n📝 === 게시글 상태 확인 ===');
    if (tableNames.includes('posts')) {
      const [postStats] = await connection.execute(`
        SELECT 
          COUNT(*) as total_posts,
          SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published_posts,
          SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) as draft_posts
        FROM posts
      `);
      console.table(postStats);
      
      // 최근 게시글 목록
      console.log('--- 최근 게시글 5개 ---');
      const [recentPosts] = await connection.execute(`
        SELECT id, title, published, created_at, view_count 
        FROM posts 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      console.table(recentPosts);
    }

    console.log('\n🎉 DB 분석 완료!');
    
  } catch (error: any) {
    console.error('❌ DB 분석 실패:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  analyzeDatabase();
}

export { analyzeDatabase };