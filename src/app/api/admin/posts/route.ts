import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 포스트 목록 조회 (관리자용 - 모든 포스트 포함)
    const postsData = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorName: users.name,
        categoryName: categories.name,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // 전체 포스트 수 조회
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts);

    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      posts: postsData.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        published: post.published,
        createdAt: post.createdAt?.toISOString(),
        updatedAt: post.updatedAt?.toISOString(),
        authorName: post.authorName,
        categoryName: post.categoryName,
        viewCount: post.viewCount || 0,
      })),
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error('Posts fetch error:', error);
    return NextResponse.json(
      { message: '포스트 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, categoryId, published = false } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    // 슬러그 생성 (간단한 방식)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + Date.now();

    // 관리자 ID 찾기 (임시로 1 사용, 나중에 세션에서 가져올 수 있음)
    const adminId = 1;

    const result = await db.insert(posts).values({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      authorId: adminId,
      categoryId: categoryId || null,
      published,
    });

    return NextResponse.json({ 
      success: true, 
      postId: result.insertId,
      message: '포스트가 생성되었습니다.'
    });
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { message: '포스트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}