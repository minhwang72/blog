import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    // 모든 카테고리 조회
    const allCategories = await db.select().from(categories);

    // 각 카테고리의 게시물 수 계산
    const categoriesWithCount = await Promise.all(
      allCategories.map(async (category) => {
        const postCount = await db
          .select({ count: posts.id })
          .from(posts)
          .where(
            and(
              eq(posts.categoryId, category.id),
              eq(posts.published, true)
            )
          );

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          postCount: postCount.length,
        };
      })
    );

    // 게시물 수가 0보다 큰 카테고리만 반환
    const activeCategories = categoriesWithCount.filter(
      (category) => category.postCount > 0
    );

    return NextResponse.json(activeCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug, description } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { message: '카테고리 이름과 슬러그는 필수입니다.' },
        { status: 400 }
      );
    }

    // 중복 슬러그 확인
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { message: '이미 존재하는 슬러그입니다.' },
        { status: 409 }
      );
    }

    // 새 카테고리 생성
    const result = await db.insert(categories).values({
      name,
      slug,
      description: description || null,
    });

    // 생성된 카테고리 조회
    const createdCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    return NextResponse.json({
      id: createdCategory[0].id,
      name,
      slug,
      description: description || null,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: '카테고리 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 