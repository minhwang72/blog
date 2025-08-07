import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import PostCard from '@/components/blog/PostCard';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '태그',
  description: '태그별로 정리된 포스트를 확인하세요.',
};

async function getPostsWithTags() {
  try {
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      return [];
    }

    const postsWithTags = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        excerpt: posts.excerpt,
        slug: posts.slug,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        categoryId: posts.categoryId,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));

    return Array.isArray(postsWithTags) ? postsWithTags : [];
  } catch (error) {
    console.error('Error fetching posts with tags:', error);
    return [];
  }
}

export default async function TagsPage() {
  const postsWithTags = await getPostsWithTags();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">태그</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(postsWithTags) && postsWithTags.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
} 