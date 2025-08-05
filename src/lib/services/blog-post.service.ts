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
    
    // Generate slug from title
    const slug = this.generateSlug(data.title);
    
    // Create post
    const [post] = await db.insert(posts).values({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || this.generateExcerpt(data.content),
      published: true,
      authorId: 1, // Default admin user
      categoryId: category.id,
      viewCount: 0,
    });

    // Handle tags if provided
    if (data.tags && data.tags.length > 0) {
      await this.handleTags(post.insertId, data.tags);
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
    const [newCategory] = await db.insert(categories).values({
      name,
      slug,
      description: `Posts about ${name}`,
    });

    return {
      id: newCategory.insertId,
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
        const [newTag] = await db.insert(tags).values({
          name: tagName,
          slug,
        });
        tagId = newTag.insertId;
      }

      // Create post-tag relationship
      await db.insert(postsToTags).values({
        postId,
        tagId,
      });
    }
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
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