const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: false
    });

    console.log('✅ Database connected successfully!');

    // Test posts table
    const [posts] = await connection.execute('SELECT COUNT(*) as count FROM posts');
    console.log('📝 Total posts:', posts[0].count);

    // Test categories table
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    console.log('📂 Total categories:', categories[0].count);

    // Test recent posts
    const [recent] = await connection.execute('SELECT id, title, created_at FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 3');
    console.log('📰 Recent posts:');
    recent.forEach(post => {
      console.log(`  - ${post.title} (ID: ${post.id})`);
    });

    await connection.end();
    console.log('✅ Connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    if (error.code) console.error('Error code:', error.code);
  }
}

testConnection();