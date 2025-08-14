import { db } from '../src/lib/db';
import { posts, users, categories } from '../src/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

async function checkAllPosts() {
  try {
    console.log('🔍 모든 포스트 확인 중...\n');
    
    // 모든 포스트 조회 (게시된 것과 초안 모두)
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorName: users.name,
        categoryName: categories.name,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .orderBy(desc(posts.createdAt));

    console.log(`📊 총 ${allPosts.length}개의 포스트가 있습니다.\n`);

    if (allPosts.length === 0) {
      console.log('❌ 포스트가 없습니다.');
      return;
    }

    // 게시된 포스트와 초안 분리
    const publishedPosts = allPosts.filter(post => post.published);
    const draftPosts = allPosts.filter(post => !post.published);

    console.log(`📤 게시된 포스트: ${publishedPosts.length}개`);
    publishedPosts.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title}`);
      console.log(`      📂 카테고리: ${post.categoryName || '미분류'}`);
      console.log(`      📅 작성일: ${post.createdAt?.toLocaleDateString('ko-KR')}`);
      console.log(`      👁️ 조회수: ${post.viewCount || 0}`);
      console.log(`      🔗 슬러그: ${post.slug}`);
      console.log('');
    });

    console.log(`📝 초안 포스트: ${draftPosts.length}개`);
    draftPosts.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title}`);
      console.log(`      📂 카테고리: ${post.categoryName || '미분류'}`);
      console.log(`      📅 작성일: ${post.createdAt?.toLocaleDateString('ko-KR')}`);
      console.log(`      🔗 슬러그: ${post.slug}`);
      console.log('');
    });

    // 카테고리별 통계
    console.log('📊 카테고리별 통계:');
    const categoryStats = new Map<string, { published: number, draft: number }>();
    
    allPosts.forEach(post => {
      const categoryName = post.categoryName || '미분류';
      if (!categoryStats.has(categoryName)) {
        categoryStats.set(categoryName, { published: 0, draft: 0 });
      }
      
      const stats = categoryStats.get(categoryName)!;
      if (post.published) {
        stats.published++;
      } else {
        stats.draft++;
      }
    });

    categoryStats.forEach((stats, category) => {
      console.log(`   ${category}: 게시 ${stats.published}개, 초안 ${stats.draft}개`);
    });

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    process.exit(0);
  }
}

checkAllPosts();
