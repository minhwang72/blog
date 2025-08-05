import Link from 'next/link';
import { notFound } from 'next/navigation';
import { desc, eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts, categories } from '@/lib/db/schema';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, params.slug),
  });

  if (!category) {
    return {
      title: '찾을 수 없음 - 은밍의 블로그',
      description: '요청하신 페이지를 찾을 수 없습니다.',
    };
  }

  return {
    title: `${category.name} - 은밍의 블로그`,
    description: `${category.name} 카테고리의 글 목록입니다.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, params.slug),
  });

  if (!category) {
    notFound();
  }

  const categoryPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      createdAt: posts.createdAt,
      authorId: posts.authorId,
      authorName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.authorId, categories.id))
    .where(
      and(
        eq(posts.categoryId, category.id),
        eq(posts.published, true)
      )
    )
    .orderBy(desc(posts.createdAt));

  return (
    <div className="py-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {category.description}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {categoryPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-start justify-between group"
            >
              <div className="relative w-full">
                <div className="relative aspect-[16/9] w-full rounded-2xl bg-gray-100 dark:bg-gray-800 sm:aspect-[2/1] lg:aspect-[3/2]">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-300 dark:text-gray-600">
                    📝
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4">
                  <div className="flex items-center gap-x-4 text-xs text-white">
                    <time dateTime={post.createdAt.toISOString()}>
                      {formatDate(post.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <div className="text-gray-600 dark:text-gray-400">
                    {post.authorName}
                  </div>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
} 