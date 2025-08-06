import { db } from '@/lib/db';
import { posts, categories, tags, postsToTags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
}

export class BlogPostService {
  async createPost(data: CreatePostData) {
    // Get or create category
    const category = await this.getOrCreateCategory(data.category);
    
    // Generate unique slug from title
    const slug = await this.generateUniqueSlug(data.title);
    
    // Create post
    const postResult = await db.insert(posts).values({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || this.generateExcerpt(data.content),
      published: true,
      authorId: 1, // Default admin user
      categoryId: category.id,
      viewCount: 0,
      // createdAt과 updatedAt은 DB에서 자동으로 처리됨
    });

    // insertId 추출
    const postId = postResult.insertId || postResult.lastInsertRowid || postResult[0]?.insertId;
    
    if (!postId) {
      throw new Error(`Failed to get post ID after insert`);
    }

    // Handle tags if provided
    if (data.tags && data.tags.length > 0) {
      await this.handleTags(postId, data.tags);
    }

    return {
      title: data.title,
      slug,
      category: category.name,
    };
  }

  private async getOrCreateCategory(name: string) {
    // Try to find existing category
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new category
    const slug = this.generateSlug(name);
    const newCategoryResult = await db.insert(categories).values({
      name,
      slug,
      description: `Posts about ${name}`,
      // createdAt은 DB에서 자동으로 처리됨
    });

    return {
      id: newCategoryResult.insertId,
      name,
      slug,
    };
  }

  private async handleTags(postId: number, tagNames: string[]) {
    for (const tagName of tagNames) {
      // Get or create tag
      const existing = await db
        .select()
        .from(tags)
        .where(eq(tags.name, tagName))
        .limit(1);

      let tagId: number;
      if (existing.length > 0) {
        tagId = existing[0].id;
      } else {
        const slug = this.generateSlug(tagName);
        const newTagResult = await db.insert(tags).values({
          name: tagName,
          slug,
          // createdAt은 DB에서 자동으로 처리됨
        });
        
        tagId = newTagResult.insertId || newTagResult.lastInsertRowid || newTagResult[0]?.insertId;
        
        if (!tagId) {
          throw new Error(`Failed to get tag ID after insert`);
        }
      }

      // Create post-tag relationship
      await db.insert(postsToTags).values({
        postId,
        tagId,
      });
    }
  }

  private async generateUniqueSlug(text: string): Promise<string> {
    let baseSlug = this.generateSlug(text);
    let slug = baseSlug;
    let counter = 1;

    // 슬러그 중복 확인
    while (true) {
      const existing = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug));

      if (existing.length === 0) {
        break; // 중복되지 않음
      }

      // 중복되면 번호 추가
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  private generateSlug(text: string): string {
    // 한글, 영문, 숫자, 공백, 하이픈만 허용
    let slug = text
      .toLowerCase()
      .replace(/[^\uac00-\ud7af\u1100-\u11ff\u3130-\u318fa-z0-9\s-]/g, '') // 한글, 영문, 숫자, 공백, 하이픈만
      .replace(/\s+/g, '-') // 공백을 하이픈으로
      .replace(/-+/g, '-') // 연속 하이픈을 하나로
      .trim()
      .replace(/^-+|-+$/g, ''); // 앞뒤 하이픈 제거

    // 빈 슬러그면 타임스탬프 사용
    if (!slug) {
      slug = `post-${Date.now()}`;
    }

    return slug;
  }

  private generateExcerpt(content: string): string {
    // Remove markdown formatting and get first 150 characters
    const plainText = content
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/`([^`]+)`/g, '$1') // Remove code
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    return plainText.length > 150 
      ? plainText.substring(0, 150) + '...'
      : plainText;
  }
} 