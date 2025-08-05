import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import PostCard from '@/components/blog/PostCard';

interface TagPageProps {
  params: {
    slug: string;
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const postsWithTags = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">포스트</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {postsWithTags.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
} 