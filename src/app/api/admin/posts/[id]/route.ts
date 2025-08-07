import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const postId = parseInt(params.id);

    const postData = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        excerpt: posts.excerpt,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        categoryId: posts.categoryId,
        authorName: users.name,
        categoryName: categories.name,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.id, postId))
      .limit(1);

    if (postData.length === 0) {
      return NextResponse.json(
        { message: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const post = postData[0];

    return NextResponse.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      published: post.published,
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      authorId: post.authorId,
      categoryId: post.categoryId,
      authorName: post.authorName,
      categoryName: post.categoryName,
    });
  } catch (error) {
    console.error('Post fetch error:', error);
    return NextResponse.json(
      { message: '포스트를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const postId = parseInt(params.id);
    const body = await request.json();
    const { title, content, excerpt, categoryId, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    // 슬러그 업데이트 (제목이 변경된 경우)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + postId;

    await db
      .update(posts)
      .set({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        categoryId: categoryId || null,
        published,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    return NextResponse.json({ 
      success: true,
      message: '포스트가 수정되었습니다.'
    });
  } catch (error) {
    console.error('Post update error:', error);
    return NextResponse.json(
      { message: '포스트 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const postId = parseInt(params.id);

    // 포스트 존재 확인
    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { message: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 포스트 삭제
    await db.delete(posts).where(eq(posts.id, postId));

    return NextResponse.json({ 
      success: true,
      message: '포스트가 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Post delete error:', error);
    return NextResponse.json(
      { message: '포스트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}