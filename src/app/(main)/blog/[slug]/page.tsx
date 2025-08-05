import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts, categories } from '@/lib/db/schema';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorId: posts.authorId,
      authorName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.authorId, categories.id))
    .where(eq(posts.slug, params.slug))
    .limit(1);

  if (!post[0]) {
    return {
      title: '찾을 수 없음 - 황민 블로그',
      description: '요청하신 페이지를 찾을 수 없습니다.',
    };
  }

  const description = post[0].excerpt || 
    post[0].content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';

  return {
    title: post[0].title,
    description,
    keywords: [post[0].title, "황민", "블로그", "개발", "프로그래밍"],
    authors: [{ name: "황민" }],
    openGraph: {
      title: post[0].title,
      description,
      type: "article",
      publishedTime: post[0].createdAt.toISOString(),
      modifiedTime: post[0].updatedAt.toISOString(),
      authors: ["황민"],
      url: `https://blog.eungming.com/blog/${post[0].slug}`,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: post[0].title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post[0].title,
      description,
      creator: "@minhwang72",
    },
    alternates: {
      canonical: `/blog/${post[0].slug}`,
    },
  };
}

async function getPost(slug: string) {
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      excerpt: posts.excerpt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorId: posts.authorId,
      authorName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.authorId, categories.id))
    .where(eq(posts.slug, slug))
    .limit(1);
  return post[0];
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={post.createdAt.toISOString()}>
            {format(post.createdAt, 'PPP', { locale: ko })}
          </time>
          {post.updatedAt && post.updatedAt > post.createdAt && (
            <span>
              (Updated: {format(post.updatedAt, 'PPP', { locale: ko })})
            </span>
          )}
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
} 