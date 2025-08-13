import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, users, categories } from '@/lib/db/schema'
import { eq, like, desc, and } from 'drizzle-orm'

const MCP_SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mcp.eungming.com/mcp'
  : 'http://localhost:8787/mcp'
const MCP_TOKEN = process.env.MCP_TOKEN || '0a295dd2818cb5eb5cfcae08b94b39b9620221b35bd2379294f9cf12fcae9e92'

// 글 길이에 따른 광고 배치 전략
function getAdPositions(contentLength: number) {
  const positions: Array<{ position: 'top' | 'middle' | 'bottom', priority: number }> = [];
  
  if (contentLength >= 5000) {
    // 긴 글: 상단, 중간, 하단 (3개)
    positions.push({ position: 'top', priority: 1 });
    positions.push({ position: 'middle', priority: 2 });
    positions.push({ position: 'bottom', priority: 3 });
  } else if (contentLength >= 2000) {
    // 중간 글: 상단, 중간, 하단 (3개)
    positions.push({ position: 'top', priority: 1 });
    positions.push({ position: 'middle', priority: 2 });
    positions.push({ position: 'bottom', priority: 3 });
  } else if (contentLength >= 1000) {
    // 짧은 글: 상단, 하단 (2개)
    positions.push({ position: 'top', priority: 1 });
    positions.push({ position: 'bottom', priority: 2 });
  } else {
    // 매우 짧은 글: 하단만 (1개)
    positions.push({ position: 'bottom', priority: 1 });
  }
  
  return positions;
}

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

      // 광고 배치 정보 추가
      const adPositions = getAdPositions(post.content.length)
      const postWithAds = {
        ...post,
        adPositions,
        contentLength: post.content.length,
        adStrategy: {
          totalAds: adPositions.length,
          positions: adPositions.map(p => p.position),
          recommendations: adPositions.length > 0 ? [
            '글 길이에 따라 자동으로 광고가 배치됩니다.',
            `현재 ${post.content.length}자로 ${adPositions.length}개의 광고가 배치됩니다.`,
            '광고는 사용자 경험을 해치지 않도록 적절한 간격으로 배치됩니다.'
          ] : [
            '글 길이가 1000자 미만이어서 광고가 배치되지 않습니다.',
            '더 많은 광고를 표시하려면 글을 길게 작성하세요.'
          ]
        }
      }

      return NextResponse.json(postWithAds)
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
        
        // 광고 배치 정보 추가
        const adPositions = getAdPositions(content.length)
        
        return NextResponse.json({
          success: true,
          message: 'Draft updated successfully',
          slug,
          adPositions,
          contentLength: content.length,
          adStrategy: {
            totalAds: adPositions.length,
            positions: adPositions.map(p => p.position),
            recommendations: adPositions.length > 0 ? [
              '글 길이에 따라 자동으로 광고가 배치됩니다.',
              `현재 ${content.length}자로 ${adPositions.length}개의 광고가 배치됩니다.`,
              '광고는 사용자 경험을 해치지 않도록 적절한 간격으로 배치됩니다.'
            ] : [
              '글 길이가 1000자 미만이어서 광고가 배치되지 않습니다.',
              '더 많은 광고를 표시하려면 글을 길게 작성하세요.'
            ]
          }
        })
      } else {
        // 새 포스트 생성 (초안 상태)
        await db.insert(posts).values({
          title,
          slug,
          content,
          excerpt: summary || '',
          published: false,
          authorId: 1,
          categoryId: 1,
          viewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        // 생성된 포스트 조회
        const [createdPost] = await db.select().from(posts).where(eq(posts.slug, slug))

        // 광고 배치 정보 추가
        const adPositions = getAdPositions(content.length)
        
        return NextResponse.json({
          success: true,
          message: 'Draft created successfully',
          slug,
          postId: createdPost?.id,
          adPositions,
          contentLength: content.length,
          adStrategy: {
            totalAds: adPositions.length,
            positions: adPositions.map(p => p.position),
            recommendations: adPositions.length > 0 ? [
              '글 길이에 따라 자동으로 광고가 배치됩니다.',
              `현재 ${content.length}자로 ${adPositions.length}개의 광고가 배치됩니다.`,
              '광고는 사용자 경험을 해치지 않도록 적절한 간격으로 배치됩니다.'
            ] : [
              '글 길이가 1000자 미만이어서 광고가 배치되지 않습니다.',
              '더 많은 광고를 표시하려면 글을 길게 작성하세요.'
            ]
          }
        })
      }
    }

    // /api/mcp/publish - 포스트 발행
    if (path === '/api/mcp/publish') {
      const { slug } = body
      
      if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
      }

      const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1)
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      await db.update(posts)
        .set({
          published: true,
          updatedAt: new Date()
        })
        .where(eq(posts.slug, slug))

      // 광고 배치 정보 추가
      const adPositions = getAdPositions(post.content.length)
      
      return NextResponse.json({
        success: true,
        message: 'Post published successfully',
        slug,
        adPositions,
        contentLength: post.content.length,
        adStrategy: {
          totalAds: adPositions.length,
          positions: adPositions.map(p => p.position),
          recommendations: adPositions.length > 0 ? [
            '글 길이에 따라 자동으로 광고가 배치됩니다.',
            `현재 ${post.content.length}자로 ${adPositions.length}개의 광고가 배치됩니다.`,
            '광고는 사용자 경험을 해치지 않도록 적절한 간격으로 배치됩니다.'
          ] : [
            '글 길이가 1000자 미만이어서 광고가 배치되지 않습니다.',
            '더 많은 광고를 표시하려면 글을 길게 작성하세요.'
          ]
        }
      })
    }

    // 기본 POST 요청 처리
    console.log('MCP API 기본 POST 요청:', body)
    
    return NextResponse.json({
      message: 'MCP API POST endpoint',
      received: body,
      available_endpoints: ['/api/mcp/draft', '/api/mcp/publish']
    })
  } catch (error) {
    console.error('MCP API POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
        authorId: 1, // 기본 작성자 ID
        categoryId: 1, // 기본 카테고리 ID
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
