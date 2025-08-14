import { db } from '../src/lib/db';
import { posts, users, categories } from '../src/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

async function checkPublishedPosts() {
  try {
    console.log('🔍 게시된 포스트 확인 중...\n');
    
    // published = true인 게시글만 조회
    const publishedPosts = await db
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
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));

    console.log(`📊 총 ${publishedPosts.length}개의 게시된 포스트가 있습니다.\n`);

    if (publishedPosts.length === 0) {
      console.log('❌ 게시된 포스트가 없습니다.');
      return;
    }

    publishedPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   📝 작성자: ${post.authorName || 'Unknown'}`);
      console.log(`   📂 카테고리: ${post.categoryName || '미분류'}`);
      console.log(`   📅 작성일: ${post.createdAt?.toLocaleDateString('ko-KR')}`);
      console.log(`   👁️ 조회수: ${post.viewCount || 0}`);
      console.log(`   🔗 슬러그: ${post.slug}`);
      console.log(`   📄 요약: ${post.excerpt?.substring(0, 100) || '요약 없음'}...`);
      console.log('');
    });

    // 전체 포스트 수도 확인
    const allPosts = await db.select().from(posts);
    console.log(`📈 전체 포스트 수: ${allPosts.length}개`);
    console.log(`📊 게시된 포스트 비율: ${((publishedPosts.length / allPosts.length) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    process.exit(0);
  }
}

checkPublishedPosts();
