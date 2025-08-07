#!/usr/bin/env tsx

/**
 * 관리자 계정 생성 스크립트
 * 지정된 계정 정보로 관리자를 생성합니다.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// 환경변수 파일들을 순서대로 로드
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

import { db } from '../src/lib/db';
import { admins } from '../src/lib/db/schema';
import bcrypt from 'bcryptjs';

const ADMIN_USERNAME = 'mhwang';
const ADMIN_PASSWORD = 'f8tgw3lshms!';

async function createAdmin() {
  try {
    console.log('🔐 관리자 계정 생성 중...');
    console.log('환경변수 확인:', {
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD ? '***' : 'undefined'
    });

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // 관리자 계정 생성
    const result = await db.insert(admins).values({
      username: ADMIN_USERNAME,
      password: hashedPassword,
    });

    console.log('✅ 관리자 계정이 성공적으로 생성되었습니다!');
    console.log(`👤 아이디: ${ADMIN_USERNAME}`);
    console.log(`🔑 비밀번호: ${ADMIN_PASSWORD}`);
    console.log('');
    console.log('⚠️  보안 주의사항:');
    console.log('- 비밀번호는 안전하게 보관하세요.');
    console.log('- 로그인 후 비밀번호를 변경하는 것을 권장합니다.');
    console.log('- 이 스크립트는 프로덕션에서 삭제하거나 보안 처리하세요.');

    process.exit(0);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️  관리자 계정이 이미 존재합니다.');
      console.log(`👤 기존 아이디: ${ADMIN_USERNAME}`);
    } else {
      console.error('❌ 관리자 계정 생성 실패:', error.message);
      console.error('전체 오류:', error);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  createAdmin();
}

export { createAdmin };