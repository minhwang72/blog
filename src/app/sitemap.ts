import { MetadataRoute } from 'next'
import { blogService } from '@/lib/services/blog.service'
import { getEnv } from '@/lib/env'

const SITE_URL = getEnv('NEXT_PUBLIC_SITE_URL') || 'https://www.eungming.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  try {
    // 블로그 포스트들
    const postsResponse = await blogService.getPosts('all', 1, 1000) // 최대 1000개
    const postPages: MetadataRoute.Sitemap = postsResponse.posts.map(post => ({
      url: `${SITE_URL}/blog/${post.id}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // 카테고리들
    const categories = await blogService.getCategories()
    const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...postPages, ...categoryPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
} 