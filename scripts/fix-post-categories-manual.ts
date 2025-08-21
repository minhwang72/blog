import { db } from '../src/lib/db'
import { posts, categories } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'

// 포스트 ID별 카테고리 매핑
const postCategoryMapping = {
  28: 'MCP·에이전트', // "MCP로 만든 AI 에이전트가 실제로 돈을 벌어준 이야기"
  27: 'MCP·에이전트', // "AI 에이전트 시대의 개발자: 2025년 필수 스킬셋"
  17: 'MCP·에이전트', // "바이브코딩으로 MCP 블로그 시스템 구축하기"
  16: 'MCP·에이전트'  // "MCP로 자동화하는 나의 블로그"
}

async function fixPostCategoriesManual() {
  console.log('🔧 포스트 카테고리 수동 수정 시작...\n')

  try {
    // 모든 카테고리 가져오기
    const allCategories = await db.select().from(categories)
    const categoryMap = new Map(allCategories.map(c => [c.name, c.id]))
    
    console.log(`📂 사용 가능한 카테고리: ${allCategories.map(c => `${c.id}:${c.name}`).join(', ')}\n`)

    for (const [postId, categoryName] of Object.entries(postCategoryMapping)) {
      const categoryId = categoryMap.get(categoryName)
      
      if (!categoryId) {
        console.log(`❌ 카테고리 "${categoryName}"를 찾을 수 없음`)
        continue
      }

      console.log(`📝 포스트 ID ${postId}: "${categoryName}" 카테고리로 수정`)
      
      await db.update(posts)
        .set({ categoryId: categoryId })
        .where(eq(posts.id, parseInt(postId)))
      
      console.log(`   ✅ 업데이트 완료: categoryId ${categoryId}`)
    }

    console.log('\n🎉 모든 포스트 카테고리 수정 완료!')

    // 수정 결과 확인
    console.log('\n📊 수정 결과:')
    const updatedPosts = await db.select({
      id: posts.id,
      title: posts.title,
      categoryId: posts.categoryId
    }).from(posts).where(eq(posts.id, 16)).or(eq(posts.id, 17)).or(eq(posts.id, 27)).or(eq(posts.id, 28))

    for (const post of updatedPosts) {
      const category = allCategories.find(c => c.id === post.categoryId)
      console.log(`   ID ${post.id}: ${category?.name || '알 수 없음'} (${post.categoryId})`)
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error)
  } finally {
    process.exit(0)
  }
}

fixPostCategoriesManual()
