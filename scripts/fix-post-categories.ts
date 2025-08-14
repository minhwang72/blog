import { db } from '../src/lib/db';
import { posts, categories } from '../src/lib/db/schema';
import { eq, like } from 'drizzle-orm';

async function fixPostCategories() {
  try {
    console.log('🔍 포스트 카테고리 분석 및 수정 중...\n');
    
    // 모든 게시된 포스트 조회
    const publishedPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        categoryId: posts.categoryId,
        content: posts.content,
      })
      .from(posts)
      .where(eq(posts.published, true));

    console.log(`📊 총 ${publishedPosts.length}개의 게시된 포스트를 분석합니다.\n`);

    // MCP·에이전트 카테고리 찾기
    const mcpCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.name, 'MCP·에이전트'))
      .limit(1);

    if (mcpCategory.length === 0) {
      console.log('❌ MCP·에이전트 카테고리를 찾을 수 없습니다.');
      return;
    }

    const mcpCategoryId = mcpCategory[0].id;
    console.log(`✅ MCP·에이전트 카테고리 ID: ${mcpCategoryId}\n`);

    // 각 포스트 분석 및 카테고리 수정
    for (const post of publishedPosts) {
      console.log(`📝 포스트 분석: ${post.title}`);
      
      // MCP 관련 키워드 확인
      const mcpKeywords = ['MCP', 'Model Context Protocol', 'AI', '에이전트', '자동화', '바이브코딩'];
      const hasMCPContent = mcpKeywords.some(keyword => 
        post.title.toLowerCase().includes(keyword.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(keyword.toLowerCase()) ||
        post.content.toLowerCase().includes(keyword.toLowerCase())
      );

      if (hasMCPContent && post.categoryId !== mcpCategoryId) {
        console.log(`   🔄 MCP 관련 내용 발견! 카테고리를 "MCP·에이전트"로 변경합니다.`);
        
        // 카테고리 업데이트
        await db.update(posts)
          .set({ categoryId: mcpCategoryId })
          .where(eq(posts.id, post.id));
        
        console.log(`   ✅ 카테고리 변경 완료: ID ${post.categoryId} → ${mcpCategoryId}`);
      } else if (hasMCPContent) {
        console.log(`   ✅ 이미 올바른 카테고리("MCP·에이전트")에 있습니다.`);
      } else {
        console.log(`   ℹ️ MCP 관련 내용이 아니므로 현재 카테고리 유지.`);
      }
      console.log('');
    }

    // 수정 후 결과 확인
    console.log('📋 수정 후 포스트 카테고리 현황:');
    const updatedPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        categoryName: categories.name,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.published, true));

    updatedPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   📂 카테고리: ${post.categoryName || '미분류'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    process.exit(0);
  }
}

fixPostCategories();
