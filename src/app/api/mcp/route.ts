import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, users, categories } from '@/lib/db/schema'
import { eq, like, desc, and } from 'drizzle-orm'

const MCP_SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mcp.eungming.com/mcp'
  : 'http://localhost:8787/mcp'
const MCP_TOKEN = process.env.MCP_TOKEN || '0a295dd2818cb5eb5cfcae08b94b39b9620221b35bd2379294f9cf12fcae9e92'

// GET 요청 처리 - 포스트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = request.nextUrl.pathname
    const action = searchParams.get('action')

    console.log('MCP API GET 요청:', { path, action, searchParams: Object.fromEntries(searchParams) })

    // /api/mcp?action=posts - 포스트 목록 조회
    if (action === 'posts' || path.endsWith('/posts')) {
      const q = searchParams.get('q')
      const tag = searchParams.get('tag')
      const status = searchParams.get('status')
      const limit = parseInt(searchParams.get('limit') || '50')
      const offset = parseInt(searchParams.get('offset') || '0')

      console.log('포스트 목록 조회:', { q, tag, status, limit, offset })

      let postsList
      
      if (q && status === 'published') {
        postsList = await db.select().from(posts)
          .where(and(like(posts.title, `%${q}%`), eq(posts.published, true)))
          .limit(limit)
          .offset(offset)
          .orderBy(desc(posts.createdAt))
      } else if (q) {
        postsList = await db.select().from(posts)
          .where(like(posts.title, `%${q}%`))
          .limit(limit)
          .offset(offset)
          .orderBy(desc(posts.createdAt))
      } else if (status === 'published') {
        postsList = await db.select().from(posts)
          .where(eq(posts.published, true))
          .limit(limit)
          .offset(offset)
          .orderBy(desc(posts.createdAt))
      } else {
        postsList = await db.select().from(posts)
          .limit(limit)
          .offset(offset)
          .orderBy(desc(posts.createdAt))
      }

      console.log(`포스트 목록 조회 완료: ${postsList.length}개`)

      return NextResponse.json({
        posts: postsList,
        total: postsList.length,
        success: true
      })
    }

    // /api/mcp?action=post&slug={slug} - 특정 포스트 조회
    if (action === 'post') {
      const slug = searchParams.get('slug')
      if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
      }

      console.log('특정 포스트 조회:', slug)

      const [post] = await db.select().from(posts).where(eq(posts.slug, slug))
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      return NextResponse.json(post)
    }

    // 기본 GET 요청 - MCP 프로토콜 응답
    console.log(`MCP API 기본 요청 - action: ${action}`)
    
    if (!action) {
      return NextResponse.json({
        message: 'MCP API is running',
        available_actions: ['posts', 'post'],
        usage: {
          posts: '/api/mcp?action=posts',
          post: '/api/mcp?action=post&slug={slug}'
        }
      })
    }

    // action이 있지만 처리되지 않은 경우
    return NextResponse.json({
      error: 'Invalid action',
      available_actions: ['posts', 'post']
    }, { status: 400 })
  } catch (error) {
    console.error('MCP API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// POST 요청 처리
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const path = request.nextUrl.pathname
    console.log('MCP API 요청:', { path, body })

    // /api/mcp/draft - 초안 저장
    if (path === '/api/mcp/draft') {
      const { slug, title, content, summary, tags, category } = body
      
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
    }

    // /api/mcp/publish - 포스트 발행
    if (path === '/api/mcp/publish') {
      const { slug, publishedAt } = body
      
      await db.update(posts)
        .set({
          published: true,
          updatedAt: new Date()
        })
        .where(eq(posts.slug, slug))

      const [post] = await db.select().from(posts).where(eq(posts.slug, slug))

      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        message: 'Post published successfully',
        post
      })
    }

    // /api/mcp/publish-to-blog - 블로그에 발행 (이미 발행된 상태이므로 성공 응답)
    if (path === '/api/mcp/publish-to-blog') {
      const { slug } = body
      
      const [post] = await db.select().from(posts).where(eq(posts.slug, slug))
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        message: 'Post already published to blog',
        post
      })
    }

    // MCP 프로토콜 메시지 처리 (기존 로직)
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
