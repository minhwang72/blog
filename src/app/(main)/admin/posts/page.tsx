import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PostList from '@/components/admin/PostList';
import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const metadata = {
  title: '게시물 관리 - 은밍 블로그',
  description: '블로그 게시물을 관리하는 페이지입니다.',
};

export default async function PostsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const allPosts = await db.query.posts.findMany({
    with: {
      author: true,
      category: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">게시물 관리</h1>
        <a
          href="/admin/posts/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          새 게시물 작성
        </a>
      </div>
      <PostList posts={allPosts} />
    </div>
  );
} 