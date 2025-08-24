const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testBlogData() {
  try {
    console.log('🧪 Testing Blog Data Loading...\n');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: undefined
    });

    console.log('✅ Database connected successfully!\n');

    // 1. 총 포스트 수 확인
    const [postCount] = await connection.execute('SELECT COUNT(*) as count FROM posts WHERE published = 1');
    console.log(`📝 Published Posts: ${postCount[0].count}`);

    // 2. 최신 포스트 확인
    const [recentPosts] = await connection.execute(`
      SELECT p.id, p.title, p.slug, p.excerpt, p.view_count as viewCount, 
             p.created_at, c.name as categoryName, u.name as authorName
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.published = 1
      ORDER BY p.created_at DESC
      LIMIT 6
    `);

    console.log(`\n📰 Recent Posts (${recentPosts.length}):`);
    recentPosts.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title}`);
      console.log(`      👁️ Views: ${post.viewCount || 0} | 📅 ${post.created_at.toISOString().split('T')[0]}`);
      if (post.categoryName) console.log(`      📂 Category: ${post.categoryName}`);
    });

    // 3. 카테고리 확인
    const [categories] = await connection.execute('SELECT id, name, slug FROM categories ORDER BY name');
    console.log(`\n📂 Categories (${categories.length}):`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    // 4. 통계 확인
    const [totalViews] = await connection.execute('SELECT SUM(view_count) as total FROM posts WHERE published = 1');
    console.log(`\n📊 Statistics:`);
    console.log(`   📝 Total Posts: ${postCount[0].count}`);
    console.log(`   👁️ Total Views: ${totalViews[0].total || 0}`);
    console.log(`   📂 Total Categories: ${categories.length}`);

    await connection.end();
    console.log('\n✅ All data loaded successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBlogData();