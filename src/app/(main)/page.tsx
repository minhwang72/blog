import { db } from '@/lib/db';
import { categories, posts, users } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { Metadata } from 'next';
import PostCard from '@/components/blog/PostCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'min.log | 황민 블로그',
  description: '개발, 일상, 그리고 배움에 대한 기록',
};

async function getPosts(categorySlug?: string) {
  try {
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      return [];
    }

    // Drizzle ORM 타입 문제로 인해 any 사용
    const allPosts: any = await db
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
        categorySlug: categories.slug,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));
    
    return Array.isArray(allPosts) ? allPosts : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

interface PageProps {
  searchParams: { category?: string };
}

export default async function Home({ searchParams }: PageProps) {
  const categorySlug = searchParams.category || 'all';
  const posts = await getPosts(categorySlug);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            개발, 일상 그리고 배움에 대한 기록
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            프로그래밍, 일상 생활, 그리고 새로운 것을 배우는 과정을 기록합니다.
            <br />
            <span className="text-primary font-medium">MCP</span>로 더 스마트하게 글을 작성해보세요.
          </p>
        </div>
        
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{posts.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">총 포스트</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {posts.reduce((sum, post: any) => sum + (post.viewCount || 0), 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">총 조회수</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(posts.map((post: any) => post.categoryName)).size}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">카테고리</div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {categorySlug === 'all' ? '최근 포스트' : `${posts[0]?.categoryName || '카테고리'} 포스트`}
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {posts.length}개의 포스트
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              아직 포스트가 없습니다
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              MCP를 사용해서 첫 번째 포스트를 작성해보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
} 