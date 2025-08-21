import { db } from '../src/lib/db'
import { posts } from '../src/lib/db/schema'

async function deleteAllPosts() {
  console.log('🗑️ 모든 포스트 삭제 시작...')

  try {
    // 모든 포스트 조회
    const allPosts = await db.select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug
    }).from(posts)

    console.log(`📋 삭제할 포스트 목록 (${allPosts.length}개):`)
    allPosts.forEach(post => {
      console.log(`   ID ${post.id}: ${post.title} (${post.slug})`)
    })

    if (allPosts.length === 0) {
      console.log('✅ 삭제할 포스트가 없습니다.')
      return
    }

    // 사용자 확인
    console.log('\n⚠️ 정말로 모든 포스트를 삭제하시겠습니까? (y/N)')
    
    // 모든 포스트 삭제
    const deleteResult = await db.delete(posts)
    
    console.log('✅ 모든 포스트 삭제 완료!')
    console.log(`   삭제된 포스트 수: ${allPosts.length}개`)

    // 삭제 확인
    const remainingPosts = await db.select().from(posts)
    console.log(`   남은 포스트 수: ${remainingPosts.length}개`)

  } catch (error) {
    console.error('❌ 포스트 삭제 중 오류 발생:', error)
  } finally {
    process.exit(0)
  }
}

deleteAllPosts()
