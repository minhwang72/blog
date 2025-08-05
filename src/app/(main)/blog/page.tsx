import Link from 'next/link';
import { db } from '@/lib/db';
import { posts, categories, users } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

async function getPosts() {
  try {
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      return [];
    }

    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        authorName: users.name,
        categoryName: categories.name,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .orderBy(desc(posts.createdAt));
    
    return Array.isArray(allPosts) ? allPosts : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Blog Posts
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Thoughts, stories and ideas about web development and life.
        </p>
      </div>

      <div className="grid gap-8">
        {Array.isArray(posts) && posts.map((post: any) => (
          <article
            key={post.id}
            className="group relative rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={post.createdAt.toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {post.categoryName && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {post.categoryName}
                  </span>
                )}
                {post.updatedAt && post.updatedAt > post.createdAt && (
                  <span className="text-xs">
                    (Updated: {new Date(post.updatedAt).toLocaleDateString('ko-KR')})
                  </span>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
} 