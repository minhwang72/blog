import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// DB 호스트 자동 감지
const isProduction = process.env.NODE_ENV === 'production';
const DB_HOST = isProduction ? '192.168.0.19' : (process.env.DB_HOST || 'monsilserver.iptime.org');

const connection = mysql.createPool({
  host: DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(connection, { mode: 'default', schema }); 