import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug } = body
    
    console.log('블로그 발행 요청:', { slug })

    // 포스트 조회
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug))
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 이미 발행된 상태이므로 성공 응답
    return NextResponse.json({
      success: true,
      message: 'Post already published to blog',
      post
    })
  } catch (error) {
    console.error('블로그 발행 오류:', error)
    return NextResponse.json(
      { error: 'Failed to publish to blog', details: (error as Error).message },
      { status: 500 }
    )
  }
}
