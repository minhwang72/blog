import { db } from '../src/lib/db';
import { posts, categories } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function testMCPCategory() {
  try {
    console.log('🧪 MCP 카테고리 분류 테스트 중...\n');
    
    // 테스트용 포스트 데이터
    const testPosts = [
      {
        title: '일상의 작은 기쁨들',
        content: '오늘은 정말 좋은 날씨였다. 산책을 다녀오면서 느낀 일상의 소소한 기쁨들에 대해 이야기해보려고 한다.',
        summary: '일상에서 발견하는 작은 기쁨들에 대한 이야기',
        category: '일상',
        slug: 'daily-joys-test'
      },
      {
        title: 'React 18의 새로운 기능들',
        content: 'React 18에서 추가된 새로운 기능들을 살펴보고, 실제 프로젝트에서 어떻게 활용할 수 있는지 알아보자.',
        summary: 'React 18의 새로운 기능들과 활용 방법',
        category: '개발',
        slug: 'react-18-features-test'
      },
      {
        title: 'MCP를 활용한 AI 에이전트 개발',
        content: 'Model Context Protocol을 사용하여 AI 에이전트를 개발하는 방법과 실제 구현 사례를 소개한다.',
        summary: 'MCP를 활용한 AI 에이전트 개발 방법',
        category: 'MCP·에이전트',
        slug: 'mcp-agent-development-test'
      },
      {
        title: '카테고리 없는 테스트 포스트',
        content: '카테고리를 지정하지 않은 테스트 포스트입니다. 기본 카테고리로 분류되어야 합니다.',
        summary: '카테고리 미지정 테스트',
        category: null,
        slug: 'no-category-test'
      }
    ];

    console.log('📝 테스트 포스트 생성 중...\n');

    for (const testPost of testPosts) {
      console.log(`🔍 테스트: ${testPost.title}`);
      console.log(`   📂 지정 카테고리: ${testPost.category || '미지정'}`);
      
      // MCP API 로직을 직접 구현하여 테스트
      let categoryId = 1; // 기본값 (개발)
      
      if (testPost.category) {
        // 제공된 카테고리로 기존 카테고리 찾기
        const existingCategory = await db.select().from(categories).where(eq(categories.name, testPost.category)).limit(1);
        if (existingCategory.length > 0) {
          categoryId = existingCategory[0].id;
          console.log(`   ✅ 기존 카테고리 사용: ${testPost.category} (ID: ${categoryId})`);
        } else {
          // 새 카테고리 생성
          const newCategoryResult = await db.insert(categories).values({
            name: testPost.category,
            slug: testPost.category.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
            description: `${testPost.category} 관련 포스트`
          });
          categoryId = newCategoryResult.insertId || 1;
          console.log(`   🆕 새 카테고리 생성: ${testPost.category} (ID: ${categoryId})`);
        }
      } else {
        console.log(`   ℹ️ 카테고리 미지정으로 기본 카테고리 사용 (ID: ${categoryId})`);
      }

      // 포스트 생성 (테스트용이므로 published: false)
      const [post] = await db.insert(posts).values({
        title: testPost.title,
        slug: testPost.slug,
        content: testPost.content,
        excerpt: testPost.summary || '',
        published: false, // 테스트용이므로 미발행
        authorId: 1,
        categoryId: categoryId,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`   ✅ 포스트 생성 완료 (ID: ${post.insertId})`);
      console.log('');
    }

    // 생성된 테스트 포스트 확인
    console.log('📋 생성된 테스트 포스트 확인:');
    const testPostsResult = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        categoryName: categories.name,
        published: posts.published,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.published, false))
      .orderBy(posts.createdAt);

    testPostsResult.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   🔗 슬러그: ${post.slug}`);
      console.log(`   📂 카테고리: ${post.categoryName || '미분류'}`);
      console.log(`   📊 상태: ${post.published ? '게시됨' : '초안'}`);
      console.log('');
    });

    // 테스트 포스트 정리 (삭제)
    console.log('🧹 테스트 포스트 정리 중...');
    await db.delete(posts).where(eq(posts.published, false));
    console.log('✅ 테스트 포스트 삭제 완료');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    process.exit(0);
  }
}

testMCPCategory();
