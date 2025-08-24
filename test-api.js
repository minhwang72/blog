const { blogService } = require('./src/lib/services/blog.service.ts');

async function testBlogService() {
  try {
    console.log('🧪 Testing Blog Service...\n');

    // 1. 포스트 목록 테스트
    console.log('1️⃣ Testing getPosts...');
    const postsResponse = await blogService.getPosts('all', 1, 5);
    console.log(`✅ Found ${postsResponse.total} total posts`);
    console.log(`📄 Page ${postsResponse.page} with ${postsResponse.posts.length} posts`);
    if (postsResponse.posts.length > 0) {
      console.log(`📝 Latest post: "${postsResponse.posts[0].title}"`);
    }
    console.log('');

    // 2. 카테고리 테스트
    console.log('2️⃣ Testing getCategories...');
    const categories = await blogService.getCategories();
    console.log(`✅ Found ${categories.length} categories:`);
    categories.forEach(cat => console.log(`   📂 ${cat.name} (${cat.slug})`));
    console.log('');

    // 3. 인기 포스트 테스트
    console.log('3️⃣ Testing getPopularPosts...');
    const popularPosts = await blogService.getPopularPosts(3);
    console.log(`✅ Found ${popularPosts.length} popular posts:`);
    popularPosts.forEach(post => {
      console.log(`   🔥 ${post.title} (Views: ${post.viewCount || 0})`);
    });
    console.log('');

    // 4. 통계 테스트
    console.log('4️⃣ Testing getStats...');
    const stats = await blogService.getStats();
    console.log(`✅ Blog Statistics:`);
    console.log(`   📊 Total Posts: ${stats.totalPosts}`);
    console.log(`   👁️ Total Views: ${stats.totalViews}`);
    console.log(`   📂 Total Categories: ${stats.totalCategories}`);
    console.log('');

    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Node.js에서 ES 모듈 import 처리
(async () => {
  try {
    // TypeScript 파일을 동적으로 import
    const { blogService } = await import('./src/lib/services/blog.service.ts');
    
    console.log('🧪 Testing Blog Service...\n');

    const postsResponse = await blogService.getPosts('all', 1, 5);
    console.log(`✅ Found ${postsResponse.total} total posts`);
    console.log(`📄 Showing ${postsResponse.posts.length} posts on page ${postsResponse.page}`);
    
    if (postsResponse.posts.length > 0) {
      console.log('\n📝 Recent Posts:');
      postsResponse.posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title}`);
        console.log(`      👁️ Views: ${post.viewCount || 0} | 📅 ${post.createdAt}`);
      });
    }

    console.log('\n🎉 Blog service is working correctly!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
})();