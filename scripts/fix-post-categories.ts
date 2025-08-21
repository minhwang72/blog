import { db } from '../src/lib/db'
import { posts, categories } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'
import { CategoryClassifier } from '../src/lib/services/category-classifier.service'

const categoryClassifier = new CategoryClassifier()

async function fixPostCategories() {
  console.log('🔧 포스트 카테고리 수정 시작...\n')

  try {
    // 모든 포스트 가져오기
    const allPosts = await db.select().from(posts).orderBy(posts.id)
    const allCategories = await db.select().from(categories)
    
    console.log(`📊 총 ${allPosts.length}개 포스트 확인`)
    console.log(`📂 사용 가능한 카테고리: ${allCategories.map(c => `${c.id}:${c.name}`).join(', ')}\n`)

    // 카테고리 ID 매핑
    const categoryMap = new Map(allCategories.map(c => [c.name, c.id]))

    for (const post of allPosts) {
      console.log(`\n📝 포스트 ID ${post.id}: "${post.title}"`)
      console.log(`   현재 카테고리: ${post.categoryId}`)
      
      // 자동 분류 실행
      const classifiedCategory = await categoryClassifier.classify(post.title, post.content)
      const confidence = await categoryClassifier.getConfidence(post.title, post.content)
      const scores = await categoryClassifier.getDetailedScores(post.title, post.content)
      
      console.log(`   자동 분류 결과: ${classifiedCategory} (신뢰도: ${(confidence * 100).toFixed(1)}%)`)
      
      // 카테고리 ID 찾기
      const newCategoryId = categoryMap.get(classifiedCategory)
      
      if (!newCategoryId) {
        console.log(`   ❌ 카테고리 "${classifiedCategory}"를 찾을 수 없음`)
        continue
      }
      
      // 카테고리가 다른 경우에만 업데이트
      if (post.categoryId !== newCategoryId) {
        console.log(`   🔄 카테고리 변경: ${post.categoryId} → ${newCategoryId} (${classifiedCategory})`)
        
        await db.update(posts)
          .set({ categoryId: newCategoryId })
          .where(eq(posts.id, post.id))
        
        console.log(`   ✅ 업데이트 완료`)
      } else {
        console.log(`   ✅ 이미 올바른 카테고리`)
      }
      
      // 점수 출력
      const sortedScores = Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([cat, score]) => `${cat}: ${score}점`)
        .join(', ')
      console.log(`   📊 점수: ${sortedScores}`)
    }

    console.log('\n🎉 모든 포스트 카테고리 수정 완료!')

  } catch (error) {
    console.error('❌ 오류 발생:', error)
  } finally {
    process.exit(0)
  }
}

fixPostCategories()
