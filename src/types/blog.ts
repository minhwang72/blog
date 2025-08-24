// 블로그 관련 타입 정의
export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string | null
  featuredImage?: string | null
  published: boolean
  authorId: number
  categoryId?: number | null
  viewCount: number
  createdAt: Date
  updatedAt: Date
  
  // 조인된 필드들
  authorName?: string | null
  categoryName?: string | null
  categorySlug?: string | null
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
  description?: string | null
  createdAt?: Date | null
}

export interface BlogTag {
  id: number
  name: string
  slug: string
  createdAt?: Date | null
}

export interface BlogComment {
  id: number
  content: string
  name: string
  password: string
  postId: number
  parentId?: number | null
  createdAt?: Date | null
  updatedAt?: Date | null
  
  // 조인된 필드들
  replies?: BlogComment[]
}

// API 응답 타입들
export interface PostsResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface CategoriesResponse {
  categories: BlogCategory[]
}

export interface PostWithRelations extends BlogPost {
  category?: BlogCategory | null
  tags?: BlogTag[]
  comments?: BlogComment[]
}

// 폼 데이터 타입들
export interface CreatePostData {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  published: boolean
  categoryId?: number
  tagIds?: number[]
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: number
}

export interface CreateCommentData {
  content: string
  name: string
  password: string
  postId: number
  parentId?: number
}

// 검색 관련 타입들
export interface SearchParams {
  q?: string
  category?: string
  tag?: string
  page?: number
  limit?: number
  sort?: 'newest' | 'oldest' | 'popular'
}

export interface SearchResult {
  posts: BlogPost[]
  total: number
  query: string
}

// 통계 타입
export interface BlogStats {
  totalPosts: number
  totalViews: number
  totalCategories: number
}