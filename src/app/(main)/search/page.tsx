import { Suspense } from 'react';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { desc, like } from 'drizzle-orm';
import PostCard from '@/components/blog/PostCard';
import SearchBar from '@/components/ui/SearchBar';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const searchResults = query
    ? await db
        .select()
        .from(posts)
        .where(like(posts.title, `%${query}%`))
        .orderBy(desc(posts.createdAt))
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar />
      </div>
      <h1 className="text-2xl font-bold mb-6">
        {query ? `"${query}" 검색 결과` : '검색어를 입력하세요'}
      </h1>
      <Suspense fallback={<div>검색 중...</div>}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {query && searchResults.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            검색 결과가 없습니다.
          </p>
        )}
      </Suspense>
    </div>
  );
} 