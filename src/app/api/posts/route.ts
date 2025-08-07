import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET() {
  try {
    // published = true인 게시글만 조회
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorName: users.name,
        categoryName: categories.name,
        categoryId: posts.categoryId,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));

    return NextResponse.json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { title, content, excerpt, slug, categoryId, published } = data;

    await db.insert(posts).values({
      title,
      content,
      excerpt,
      slug,
      categoryId,
      published,
      authorId: 1, // 임시로 관리자 ID를 1로 설정
    });

    const newPost = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        createdAt: posts.createdAt,
        authorName: users.name,
        categoryName: categories.name,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.slug, slug))
      .limit(1);

    return NextResponse.json(newPost[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 