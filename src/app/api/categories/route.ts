import { NextResponse } from 'next/server';
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