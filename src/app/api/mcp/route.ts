import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const MCP_SERVER_URL = 'https://mcp.eungming.com/mcp'
const MCP_TOKEN = process.env.MCP_TOKEN || 'NOu4W2VTPtUVkWcPIGe994JNRbAnjuX5CVb9XZGfMrA='

export async function GET() {
  try {
    // MCP 서버에서 포스트 목록 가져오기
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 'sync-posts',
        tool: 'post.list',
        params: { status: 'published' }
      })
    })

    if (!response.ok) {
      throw new Error(`MCP server error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('MCP sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync with MCP server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, summary, tags, category } = await request.json()

    // 블로그 데이터베이스에 포스트 저장
    const [post] = await db.insert(posts).values({
      title,
      content,
      summary: summary || '',
      tags: tags ? JSON.stringify(tags) : '[]',
      category: category || 'general',
      status: 'published',
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()

    return NextResponse.json({ 
      success: true, 
      post,
      message: 'Post created successfully from MCP'
    })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
