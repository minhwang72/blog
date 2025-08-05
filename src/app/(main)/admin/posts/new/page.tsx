import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';

export const metadata = {
  title: '새 게시물 작성 - 은밍 블로그',
  description: '새로운 블로그 게시물을 작성하는 페이지입니다.',
};

export default async function NewPostPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const allCategories = await db.select().from(categories);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">새 게시물 작성</h1>
      <PostForm categories={allCategories} />
    </div>
  );
} 