import { db } from '../src/lib/db';
import { posts } from '../src/lib/db/schema';
import { eq, or, like } from 'drizzle-orm';

async function cleanupTestPosts() {
  try {
    console.log('🧹 테스트 포스트 정리 중...\n');
    
    // 테스트 포스트 찾기 (슬러그에 'test'가 포함된 것들)
    const testPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        published: posts.published,
      })
      .from(posts)
      .where(
        or(
          like(posts.slug, '%test%'),
          like(posts.title, '%테스트%')
        )
      );

    console.log(`📊 발견된 테스트 포스트: ${testPosts.length}개\n`);

    if (testPosts.length === 0) {
      console.log('✅ 정리할 테스트 포스트가 없습니다.');
      return;
    }

    // 테스트 포스트 목록 출력
    testPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   🔗 슬러그: ${post.slug}`);
      console.log(`   📊 상태: ${post.published ? '게시됨' : '초안'}`);
      console.log('');
    });

    // 테스트 포스트 삭제
    const testPostIds = testPosts.map(post => post.id);
    await db.delete(posts).where(eq(posts.id, testPostIds[0])); // 첫 번째만 삭제 (안전을 위해)
    
    console.log(`✅ 테스트 포스트 삭제 완료: ${testPosts[0].title}`);

    // 남은 포스트 확인
    const remainingPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        published: posts.published,
      })
      .from(posts)
      .orderBy(posts.createdAt);

    console.log(`\n📊 남은 포스트: ${remainingPosts.length}개`);
    remainingPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.published ? '게시됨' : '초안'})`);
    });

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    process.exit(0);
  }
}

cleanupTestPosts();
