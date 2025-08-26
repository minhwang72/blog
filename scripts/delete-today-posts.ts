import { db } from '../src/lib/db'
import { posts } from '../src/lib/db/schema'
import { gte, and } from 'drizzle-orm'

async function deleteTodayPosts() {
  console.log('🗑️ 오늘 생성된 포스트 삭제 시작...')

  try {
    // 오늘 날짜 (한국 시간 기준)
    const today = new Date()
    const kstOffset = 9 * 60 * 60 * 1000 // 9시간을 밀리초로 변환
    const kstToday = new Date(today.getTime() + kstOffset)
    const todayStart = new Date(kstToday.getFullYear(), kstToday.getMonth(), kstToday.getDate())
    
    console.log(`📅 삭제 대상 날짜: ${todayStart.toISOString().split('T')[0]} (KST)`)

    // 오늘 생성된 포스트 조회
    const todayPosts = await db.select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      createdAt: posts.createdAt
    }).from(posts)
      .where(gte(posts.createdAt, todayStart))

    console.log(`📋 오늘 생성된 포스트 목록 (${todayPosts.length}개):`)
    todayPosts.forEach(post => {
      const createdAtKST = new Date(post.createdAt.getTime() + kstOffset)
      console.log(`   ID ${post.id}: ${post.title}`)
      console.log(`      생성일시: ${createdAtKST.toLocaleString('ko-KR')}`)
      console.log(`      슬러그: ${post.slug}`)
      console.log()
    })

    if (todayPosts.length === 0) {
      console.log('✅ 오늘 생성된 포스트가 없습니다.')
      return
    }

    // 오늘 생성된 포스트만 삭제
    const deleteResult = await db.delete(posts)
      .where(gte(posts.createdAt, todayStart))
    
    console.log('✅ 오늘 생성된 포스트 삭제 완료!')
    console.log(`   삭제된 포스트 수: ${todayPosts.length}개`)

    // 삭제 확인
    const remainingTodayPosts = await db.select().from(posts)
      .where(gte(posts.createdAt, todayStart))
    console.log(`   남은 오늘 포스트 수: ${remainingTodayPosts.length}개`)

    // 전체 포스트 수 확인
    const totalPosts = await db.select().from(posts)
    console.log(`   전체 포스트 수: ${totalPosts.length}개`)

  } catch (error) {
    console.error('❌ 포스트 삭제 중 오류 발생:', error)
  } finally {
    process.exit(0)
  }
}

deleteTodayPosts()