import { db } from '../src/lib/db';
import { categories, posts } from '../src/lib/db/schema';
import { eq, and } from 'drizzle-orm';

async function checkCategories() {
  try {
    console.log('🔍 카테고리 확인 중...\n');
    
    // 모든 카테고리 조회
    const allCategories = await db.select().from(categories);
    
    console.log(`📊 총 ${allCategories.length}개의 카테고리가 있습니다.\n`);

    if (allCategories.length === 0) {
      console.log('❌ 카테고리가 없습니다.');
      return;
    }

    // 각 카테고리의 포스트 수 계산
    for (const category of allCategories) {
      const postCount = await db
        .select({ count: posts.id })
        .from(posts)
        .where(
          and(
            eq(posts.categoryId, category.id),
            eq(posts.published, true)
          )
        );

      console.log(`${category.id}. ${category.name}`);
      console.log(`   🔗 슬러그: ${category.slug}`);
      console.log(`   📝 설명: ${category.description || '설명 없음'}`);
      console.log(`   📅 생성일: ${category.createdAt?.toLocaleDateString('ko-KR')}`);
      console.log(`   📊 게시된 포스트 수: ${postCount.length}개`);
      console.log('');
    }

    // 전체 포스트 수도 확인
    const allPosts = await db.select().from(posts);
    const publishedPosts = await db.select().from(posts).where(eq(posts.published, true));
    
    console.log(`📈 전체 포스트 수: ${allPosts.length}개`);
    console.log(`📊 게시된 포스트 수: ${publishedPosts.length}개`);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    process.exit(0);
  }
}

checkCategories();
