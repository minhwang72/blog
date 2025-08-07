import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './db/schema';

const dummyPost = {
  id: 1,
  title: 'Dummy Post',
  slug: 'dummy-post',
  excerpt: 'This is a dummy post for build time.',
  content: 'Dummy content',
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: 1,
  authorName: 'Dummy Author',
  published: true,
  categoryId: 1
};

const dummyCategory = {
  id: 1,
  name: 'Dummy Category',
  slug: 'dummy-category',
  description: 'This is a dummy category'
};

// 빌드 시 더미 데이터베이스 객체 생성
const dummyDb = {
  query: {
    users: {
      findFirst: async () => null,
      findMany: async () => [],
    },
    posts: {
      findFirst: async () => dummyPost,
      findMany: async () => [dummyPost],
    },
    categories: {
      findFirst: async () => dummyCategory,
      findMany: async () => [dummyCategory],
    },
    tags: {
      findFirst: async () => null,
      findMany: async () => [],
    },
  },
  select: () => ({
    from: (table: any) => {
      const data = table === schema.categories ? [dummyCategory] : [dummyPost];
      return {
        leftJoin: () => ({
          leftJoin: () => ({
            where: () => ({
              orderBy: () => ({
                execute: async () => data,
              }),
              execute: async () => data,
            }),
            orderBy: () => ({
              execute: async () => data,
            }),
            execute: async () => data,
          }),
          where: () => ({
            orderBy: () => ({
              execute: async () => data,
            }),
            execute: async () => data,
          }),
          orderBy: () => ({
            execute: async () => data,
          }),
          execute: async () => data,
        }),
        where: () => ({
          orderBy: () => ({
            execute: async () => data,
          }),
          execute: async () => data,
        }),
        orderBy: () => ({
          execute: async () => data,
        }),
        execute: async () => data,
      };
    },
  }),
  insert: () => ({
    values: () => ({
      execute: async () => [],
    }),
  }),
  update: () => ({
    set: () => ({
      where: () => ({
        execute: async () => [],
      }),
    }),
  }),
  delete: () => ({
    where: () => ({
      execute: async () => [],
    }),
  }),
};

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
  console.log(`DB 연결 정보: ${process.env.DB_USER}@${DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
}

// 빌드 시 데이터베이스 연결 건너뛰기
const poolConnection = process.env.SKIP_DATABASE_CONNECTION === 'true'
  ? mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'dummy',
      password: 'dummy',
      database: 'dummy',
    })
  : (() => {
      validateDatabaseEnvs();
      return mysql.createPool({
        host: DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10,
      });
    })();

export const db = process.env.SKIP_DATABASE_CONNECTION === 'true'
  ? dummyDb
  : drizzle(poolConnection, { schema, mode: 'default' }); 