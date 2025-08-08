import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, users, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const MCP_SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mcp.eungming.com'
  : 'http://localhost:3000'
const MCP_TOKEN = process.env.MCP_TOKEN || '0a295dd2818cb5eb5cfcae08b94b39b9620221b35bd2379294f9cf12fcae9e92'

export async function GET() {
  try {
    console.log(`MCP 서버에 연결 시도: ${MCP_SERVER_URL}`)
    
    // MCP 표준 프로토콜로 tools/list 요청
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'list-tools',
        method: 'tools/list'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`MCP 서버 오류: ${response.status} - ${errorText}`)
      throw new Error(`MCP server error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('MCP 서버 응답:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('MCP sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync with MCP server', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, summary, tags, category, slug, publishedAt } = await request.json()
    console.log('블로그 API에 포스트 생성 요청:', { title, slug, summary })

    // slug 생성 (제공되지 않은 경우)
    const finalSlug = slug || title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')

    // 기본 사용자 확인/생성
    let defaultUser = await db.select().from(users).where(eq(users.id, 1)).limit(1)
    if (defaultUser.length === 0) {
      console.log('기본 사용자 생성 중...')
      await db.insert(users).values({
        name: 'Admin',
        email: 'admin@eungming.com',
        password: 'dummy', // 실제 환경에서는 해시된 비밀번호 사용
        role: 'admin'
      })
    }

    // 기본 카테고리 확인/생성
    let defaultCategory = await db.select().from(categories).where(eq(categories.id, 1)).limit(1)
    if (defaultCategory.length === 0) {
      console.log('기본 카테고리 생성 중...')
      await db.insert(categories).values({
        name: '기본',
        slug: 'default',
        description: '기본 카테고리'
      })
    }

    // 블로그 데이터베이스에 포스트 저장
    const [post] = await db.insert(posts).values({
      title,
      slug: finalSlug,
      content,
      excerpt: summary || '',
      published: true,
      authorId: 1, // 기본 작성자 ID
      categoryId: 1, // 기본 카테고리 ID
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('포스트 생성 성공:', post)
    return NextResponse.json({ 
      success: true, 
      post,
      message: 'Post created successfully from MCP'
    })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create post', details: (error as Error).message },
      { status: 500 }
    )
  }
}
