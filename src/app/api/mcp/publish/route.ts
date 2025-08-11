import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, publishedAt } = body
    
    console.log('포스트 발행 요청:', { slug, publishedAt })

    // 포스트 발행 상태로 업데이트
    await db.update(posts)
      .set({
        published: true,
        updatedAt: new Date()
      })
      .where(eq(posts.slug, slug))

    // 업데이트된 포스트 조회
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug))

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Post published successfully',
      post
    })
  } catch (error) {
    console.error('포스트 발행 오류:', error)
    return NextResponse.json(
      { error: 'Failed to publish post', details: (error as Error).message },
      { status: 500 }
    )
  }
}
