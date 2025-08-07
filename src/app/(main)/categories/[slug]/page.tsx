import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostCard from '@/components/blog/PostCard';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, decodedSlug))
    .limit(1);

  if (!category[0]) {
    return {
      title: '카테고리를 찾을 수 없습니다',
      description: '요청하신 카테고리를 찾을 수 없습니다.',
    };
  }

  return {
    title: `${category[0].name} 카테고리`,
    description: `${category[0].name} 카테고리의 모든 포스트를 확인하세요.`,
  };
}

async function getCategory(slug: string) {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    return category[0] || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getCategoryPosts(categoryId: number) {
  try {
    const categoryPosts = await db
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
      .where(
        and(
          eq(posts.categoryId, categoryId),
          eq(posts.published, true)
        )
      )
      .orderBy(desc(posts.createdAt));

    return Array.isArray(categoryPosts) ? categoryPosts : [];
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const category = await getCategory(decodedSlug);
  
  if (!category) {
    notFound();
  }

  const categoryPosts = await getCategoryPosts(category.id);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="space-y-12">
          {/* 헤더 섹션 */}
          <div className="text-center space-y-6">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 via-slate-500 to-gray-600 bg-clip-text text-transparent">
                {category.name}
              </h1>
              <div className="absolute -inset-x-6 -inset-y-3 bg-gradient-to-r from-sky-100/50 via-slate-100/50 to-gray-100/50 dark:from-sky-900/20 dark:via-slate-900/20 dark:to-gray-900/20 rounded-3xl blur-3xl -z-10 opacity-30"></div>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {category.name} 카테고리의 포스트들을 확인하세요.
            </p>
          </div>

          {/* 포스트 목록 */}
          <div className="space-y-8">
            {categoryPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📂</div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  포스트가 없습니다
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  이 카테고리에 아직 포스트가 없습니다.
                </p>
                <Link 
                  href="/admin/posts/new" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  포스트 작성하기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 