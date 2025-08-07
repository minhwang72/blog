import mysql from 'mysql2/promise';

async function updateCommentsSchema() {
  const dbConfig = {
    host: 'monsilserver.iptime.org',
    port: 3306,
    user: 'min',
    password: 'f8tgw3lshms!',
    database: 'blog_db',
  };

  try {
    console.log('🔗 원격 DB 연결 중...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ 연결 성공!');

    // 외래키 제약조건 해제
    console.log('🔓 외래키 제약조건 해제...');
    await connection.execute('SET foreign_key_checks = 0');

    // 기존 comments 테이블 삭제
    console.log('🗑️ 기존 comments 테이블 삭제...');
    await connection.execute('DROP TABLE IF EXISTS comments');

    // 외래키 제약조건 다시 활성화
    await connection.execute('SET foreign_key_checks = 1');
    console.log('🔒 외래키 제약조건 활성화...');

    // 새로운 comments 테이블 생성
    console.log('🏗️ 새로운 comments 테이블 생성...');
    const createTableSQL = `
      CREATE TABLE comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        post_id INT NOT NULL,
        parent_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
        INDEX idx_post_id (post_id),
        INDEX idx_parent_id (parent_id),
        INDEX idx_post_created (post_id, created_at),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await connection.execute(createTableSQL);
    console.log('✅ comments 테이블 생성 완료!');

    // 테이블 구조 확인
    console.log('📋 테이블 구조 확인...');
    const [rows] = await connection.execute('DESCRIBE comments');
    console.table(rows);

    await connection.end();
    console.log('🎉 댓글 스키마 업데이트 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  }
}

updateCommentsSchema();