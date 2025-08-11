import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, users, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, title, content, summary, tags, category } = body
    
    console.log('초안 저장 요청:', { slug, title, summary })

    // 기본 사용자 확인/생성
    let defaultUser = await db.select().from(users).where(eq(users.id, 1)).limit(1)
    if (defaultUser.length === 0) {
      await db.insert(users).values({
        name: 'Admin',
        email: 'admin@eungming.com',
        password: 'dummy',
        role: 'admin'
      })
    }

    // 기본 카테고리 확인/생성
    let defaultCategory = await db.select().from(categories).where(eq(categories.id, 1)).limit(1)
    if (defaultCategory.length === 0) {
      await db.insert(categories).values({
        name: '기본',
        slug: 'default',
        description: '기본 카테고리'
      })
    }

    // 기존 포스트 확인
    const existingPost = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1)
    
    if (existingPost.length > 0) {
      // 기존 포스트 업데이트
      await db.update(posts)
        .set({
          title,
          content,
          excerpt: summary || '',
          updatedAt: new Date()
        })
        .where(eq(posts.slug, slug))
      
      return NextResponse.json({
        success: true,
        message: 'Draft updated successfully',
        slug
      })
    } else {
      // 새 포스트 생성 (초안 상태)
      const [post] = await db.insert(posts).values({
        title,
        slug,
        content,
        excerpt: summary || '',
        published: false, // 초안 상태
        authorId: 1,
        categoryId: 1,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      return NextResponse.json({
        success: true,
        message: 'Draft saved successfully',
        post
      })
    }
  } catch (error) {
    console.error('초안 저장 오류:', error)
    return NextResponse.json(
      { error: 'Failed to save draft', details: (error as Error).message },
      { status: 500 }
    )
  }
}
