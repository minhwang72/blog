import { db } from '@/lib/db'
import { posts, categories, users, comments } from '@/lib/db/schema'
import { eq, desc, and, like, sql, or } from 'drizzle-orm'
import { BlogPost, BlogCategory, PostsResponse, SearchParams, SearchResult, BlogStats } from '@/types/blog'
import { cache, createCacheKey, CACHE_TTL } from '@/lib/cache'

export class BlogService {
  // 캐시된 포스트 목록 조회
  async getPosts(
    categorySlug: string = 'all',
    page: number = 1,
    limit: number = 10
  ): Promise<PostsResponse> {
    const cacheKey = createCacheKey('posts', categorySlug, page, limit)
    
    // 캐시 확인
    const cached = await cache.get<PostsResponse>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      let whereConditions = [eq(posts.published, true)]
      
      if (categorySlug !== 'all') {
        whereConditions.push(eq(categories.slug, categorySlug))
      }

      const offset = (page - 1) * limit

      // 총 개수 조회
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(and(...whereConditions))

      const total = totalResult[0]?.count || 0

      // 포스트 목록 조회
      const postsData = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          content: posts.content,
          featuredImage: posts.featuredImage,
          published: posts.published,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          authorId: posts.authorId,
          authorName: users.name,
          categoryId: posts.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          viewCount: posts.viewCount,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(and(...whereConditions))
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset)

      const result: PostsResponse = {
        posts: postsData as BlogPost[],
        total,
        page,
        limit,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }

      // 캐시 저장
      await cache.set(cacheKey, result, CACHE_TTL.POSTS)
      
      return result
    } catch (error) {
      console.error('Error fetching posts:', error)
      return {
        posts: [],
        total: 0,
        page,
        limit,
        hasNext: false,
        hasPrev: false,
      }
    }
  }

  // 캐시된 포스트 상세 조회
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const cacheKey = createCacheKey('post', slug)
    
    // 캐시 확인
    const cached = await cache.get<BlogPost>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const postData = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          content: posts.content,
          featuredImage: posts.featuredImage,
          published: posts.published,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          authorId: posts.authorId,
          authorName: users.name,
          categoryId: posts.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          viewCount: posts.viewCount,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(and(eq(posts.slug, slug), eq(posts.published, true)))
        .limit(1)

      if (!postData.length) return null

      const post = postData[0] as BlogPost

      // 캐시 저장
      await cache.set(cacheKey, post, CACHE_TTL.POST_DETAIL)
      
      return post
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }
  }

  // 캐시된 인기 포스트 조회
  async getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
    const cacheKey = createCacheKey('popular', limit)
    
    // 캐시 확인
    const cached = await cache.get<BlogPost[]>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const popularPosts = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          content: posts.content,
          featuredImage: posts.featuredImage,
          published: posts.published,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          authorId: posts.authorId,
          authorName: users.name,
          categoryId: posts.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          viewCount: posts.viewCount,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(eq(posts.published, true))
        .orderBy(desc(posts.viewCount))
        .limit(limit)

      const result = popularPosts as BlogPost[]

      // 캐시 저장
      await cache.set(cacheKey, result, CACHE_TTL.POPULAR_POSTS)
      
      return result
    } catch (error) {
      console.error('Error fetching popular posts:', error)
      return []
    }
  }

  // 캐시된 카테고리 목록 조회
  async getCategories(): Promise<BlogCategory[]> {
    const cacheKey = createCacheKey('categories')
    
    // 캐시 확인
    const cached = await cache.get<BlogCategory[]>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const categoriesData = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          createdAt: categories.createdAt,
        })
        .from(categories)
        .orderBy(categories.name)

      const result = categoriesData as BlogCategory[]

      // 캐시 저장
      await cache.set(cacheKey, result, CACHE_TTL.CATEGORIES)
      
      return result
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  // 캐시된 검색 결과
  async searchPosts(params: SearchParams): Promise<SearchResult> {
    const { q = '', category, page = 1, limit = 10 } = params
    const cacheKey = createCacheKey('search', q, category || 'all', page, limit)
    
    // 캐시 확인
    const cached = await cache.get<SearchResult>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      let whereConditions = [eq(posts.published, true)]
      
      if (q) {
        whereConditions.push(
          or(
            like(posts.title, `%${q}%`),
            like(posts.content, `%${q}%`),
            like(posts.excerpt, `%${q}%`)
          )!
        )
      }
      
      if (category && category !== 'all') {
        whereConditions.push(eq(categories.slug, category))
      }

      const offset = (page - 1) * limit

      // 총 개수 조회
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(and(...whereConditions))

      const total = totalResult[0]?.count || 0

      // 검색 결과 조회
      const searchResults = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          content: posts.content,
          featuredImage: posts.featuredImage,
          published: posts.published,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          authorId: posts.authorId,
          authorName: users.name,
          categoryId: posts.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          viewCount: posts.viewCount,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(and(...whereConditions))
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset)

      const result: SearchResult = {
        posts: searchResults as BlogPost[],
        total,
        query: q,
      }

      // 캐시 저장
      await cache.set(cacheKey, result, CACHE_TTL.SEARCH_RESULTS)
      
      return result
    } catch (error) {
      console.error('Error searching posts:', error)
      return {
        posts: [],
        total: 0,
        query: q,
      }
    }
  }

  // 조회수 증가 (캐시 무효화)
  async incrementViewCount(postId: number): Promise<void> {
    try {
      await db
        .update(posts)
        .set({ viewCount: sql`${posts.viewCount} + 1` })
        .where(eq(posts.id, postId))

      // 관련 캐시 무효화
      await cache.delPattern(createCacheKey('post:*'))
      await cache.delPattern(createCacheKey('popular:*'))
      await cache.delPattern(createCacheKey('posts:*'))
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  // 블로그 통계 (캐시된)
  async getStats(): Promise<BlogStats> {
    const cacheKey = createCacheKey('stats')
    
    // 캐시 확인
    const cached = await cache.get<BlogStats>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const [postCount, totalViews, categoryCount] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.published, true)),
        db.select({ total: sql<number>`sum(${posts.viewCount})` }).from(posts).where(eq(posts.published, true)),
        db.select({ count: sql<number>`count(*)` }).from(categories),
      ])

      const stats = {
        totalPosts: postCount[0]?.count || 0,
        totalViews: totalViews[0]?.total || 0,
        totalCategories: categoryCount[0]?.count || 0,
      }

      // 캐시 저장
      await cache.set(cacheKey, stats, CACHE_TTL.STATS)
      
      return stats
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        totalPosts: 0,
        totalViews: 0,
        totalCategories: 0,
      }
    }
  }
}

// 싱글톤 블로그 서비스 인스턴스
export const blogService = new BlogService()