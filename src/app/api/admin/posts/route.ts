import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // 상태 필터 추가
    const offset = (page - 1) * limit;

    console.log('API 호출 - status:', status, 'page:', page, 'limit:', limit);

    // 상태 필터 조건 생성
    let whereConditions = [];
    if (status === 'published') {
      whereConditions.push(eq(posts.published, true));
      console.log('필터: published 포스트만');
    } else if (status === 'draft') {
      whereConditions.push(eq(posts.published, false));
      console.log('필터: draft 포스트만');
    } else {
      console.log('필터: 모든 포스트');
    }

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
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // 전체 포스트 수 조회 (필터 적용)
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(whereConditions.length > 0 ? whereConditions[0] : undefined);

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
    const { title, content, excerpt, featuredImage, categoryId, published = false } = body;

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
      featuredImage: featuredImage || null,
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