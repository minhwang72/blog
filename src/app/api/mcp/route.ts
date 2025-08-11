import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, users, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const MCP_SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mcp.eungming.com/mcp'
  : 'http://localhost:8787/mcp'
const MCP_TOKEN = process.env.MCP_TOKEN || '0a295dd2818cb5eb5cfcae08b94b39b9620221b35bd2379294f9cf12fcae9e92'

// Streamable HTTP MCP 엔드포인트 - 단일 엔드포인트로 모든 요청 처리
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('MCP Streamable HTTP 요청:', body)

    // MCP 프로토콜 메시지 처리
    if (body.method) {
      switch (body.method) {
        case 'initialize':
          const initResponse = {
            jsonrpc: '2.0',
            id: body.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: {
                  listChanged: true,
                  call: true
                }
              },
              serverInfo: {
                name: 'blog-mcp-server',
                version: '1.0.0',
                capabilities: {
                  tools: {
                    listChanged: true,
                    call: true
                  }
                }
              }
            }
          }
          return NextResponse.json(initResponse)

        case 'tools/list':
          const toolsResponse = {
            jsonrpc: '2.0',
            id: body.id,
            result: {
              tools: [
                {
                  name: 'blog.createPost',
                  description: '블로그에 새 포스트 생성',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        description: '포스트 제목'
                      },
                      content: {
                        type: 'string',
                        description: '포스트 내용 (Markdown 지원)'
                      },
                      summary: {
                        type: 'string',
                        description: '포스트 요약'
                      },
                      tags: {
                        type: 'array',
                        items: { type: 'string' },
                        description: '태그 목록'
                      },
                      category: {
                        type: 'string',
                        description: '카테고리'
                      },
                      slug: {
                        type: 'string',
                        description: '포스트 슬러그 (선택사항)'
                      }
                    },
                    required: ['title', 'content']
                  }
                },
                {
                  name: 'blog.getPosts',
                  description: '블로그 포스트 목록 조회',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      limit: {
                        type: 'number',
                        description: '조회할 포스트 수 (기본값: 10)'
                      },
                      offset: {
                        type: 'number',
                        description: '시작 위치 (기본값: 0)'
                      }
                    }
                  }
                }
              ]
            }
          }
          return NextResponse.json(toolsResponse)

        case 'tools/call':
          try {
            const result = await handleToolCall(body.params.name, body.params.arguments)
            const callResponse = {
              jsonrpc: '2.0',
              id: body.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
                  }
                ]
              }
            }
            return NextResponse.json(callResponse)
          } catch (error) {
            console.error('Tool call error:', error)
            const errorResponse = {
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32603,
                message: (error as Error).message
              }
            }
            return NextResponse.json(errorResponse)
          }

        default:
          const defaultResponse = {
            jsonrpc: '2.0',
            id: body.id,
            error: {
              code: -32601,
              message: `Method not found: ${body.method}`
            }
          }
          return NextResponse.json(defaultResponse)
      }
    }

    // 기존 블로그 포스트 생성 로직 (하위 호환성)
    const { title, content, summary, tags, category, slug, publishedAt } = body
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
    console.error('MCP API error:', error)
    return NextResponse.json(
      { error: 'Failed to process MCP request', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// 도구 호출 처리 함수
async function handleToolCall(name: string, args: any) {
  switch (name) {
    case 'blog.createPost':
      const { title, content, summary, tags, category, slug } = args
      console.log('블로그 포스트 생성 요청:', { title, slug, summary })

      // slug 생성 (제공되지 않은 경우)
      const finalSlug = slug || title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')

      // 기본 사용자 확인/생성
      let defaultUser = await db.select().from(users).where(eq(users.id, 1)).limit(1)
      if (defaultUser.length === 0) {
        console.log('기본 사용자 생성 중...')
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
        authorId: 1,
        categoryId: 1,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      return {
        success: true,
        post,
        message: '블로그 포스트가 성공적으로 생성되었습니다.'
      }

    case 'blog.getPosts':
      const { limit = 10, offset = 0 } = args
      const postsList = await db.select().from(posts)
        .limit(limit)
        .offset(offset)
        .orderBy(posts.createdAt)

      return {
        success: true,
        posts: postsList,
        total: postsList.length,
        message: '블로그 포스트 목록을 조회했습니다.'
      }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

// GET 요청 처리 (하위 호환성)
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
