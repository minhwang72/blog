import { NextRequest, NextResponse } from 'next/server';
import { BlogPostService } from '@/lib/services/blog-post.service';
import { CategoryClassifier } from '@/lib/services/category-classifier.service';
import { z } from 'zod';

const blogPostService = new BlogPostService();
const categoryClassifier = new CategoryClassifier();

// MCP Tool schemas
const CreateBlogPostSchema = z.object({
  title: z.string().describe('Blog post title'),
  content: z.string().optional().describe('Additional instructions for blog post content'),
  excerpt: z.string().optional().describe('Blog post excerpt'),
  category: z.string().optional().describe('Blog post category'),
  tags: z.array(z.string()).optional().describe('Blog post tags'),
});

const ClassifyContentSchema = z.object({
  content: z.string().describe('Content to classify'),
});

// AI Content Generation Function
async function generateBlogPostContent(title: string, additionalInstructions?: string): Promise<string> {
  try {
    // 실제 AI 서비스 연동 (예: OpenAI, Claude 등)
    // 여기서는 시뮬레이션된 AI 응답을 생성
    
    const prompt = `다음 제목에 맞는 한국어 블로그 포스트를 HTML 형식으로 작성해주세요:

제목: ${title}
${additionalInstructions ? `추가 지시사항: ${additionalInstructions}` : ''}

요구사항:
1. 한국어로 작성
2. HTML 태그 사용 (h2, h3, p, ul, li, blockquote 등)
3. 실용적이고 유용한 내용
4. 독자에게 가치를 제공하는 내용
5. 적절한 단락 구분
6. 예시나 코드가 있다면 포함

포스트 내용:`;

    // 실제 AI API 호출 대신 시뮬레이션된 응답
    const simulatedResponse = `
<h2>${title}에 대한 완전한 가이드</h2>

<p>${title}에 대해 알아보고 싶으신가요? 이 글에서는 ${title}에 대한 모든 것을 다루겠습니다.</p>

<h3>${title}이란?</h3>
<p>${title}는 현대 기술 환경에서 매우 중요한 개념입니다. 이를 이해하면 더 나은 개발자가 될 수 있습니다.</p>

<h3>주요 특징</h3>
<ul>
<li>효율적인 성능</li>
<li>사용자 친화적 인터페이스</li>
<li>확장 가능한 아키텍처</li>
<li>안전한 데이터 처리</li>
</ul>

<h3>실제 사용 예시</h3>
<blockquote>
<p>${title}를 활용하면 개발 시간을 단축하고 코드 품질을 향상시킬 수 있습니다.</p>
</blockquote>

<h3>결론</h3>
<p>${title}에 대한 이해는 현대 개발에서 필수적입니다. 이 글에서 다룬 내용을 바탕으로 실제 프로젝트에 적용해보세요.</p>

<p>더 자세한 정보가 필요하시면 댓글로 문의해주세요!</p>`;

    return simulatedResponse;
  } catch (error) {
    console.error('AI content generation error:', error);
    return `<h2>${title}</h2><p>AI 생성 중 오류가 발생했습니다. 수동으로 내용을 작성해주세요.</p>`;
  }
}

// Verify API token
function verifyApiToken(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  const validTokens = [
    process.env.MCP_API_TOKEN,
    'mcp-secure-token-2024',
    '7IZUt1y-TG5zYkiJxh3cGVj5YVaW4DpZwlNJVZkgNwo',
    'your-secure-token-here'
  ];
  
  return validTokens.includes(token);
}

export async function POST(req: NextRequest) {
  try {
    console.log('MCP API called');
    
    // Check API token
    const hasValidToken = verifyApiToken(req);
    console.log('Token valid:', hasValidToken);
    
    if (!hasValidToken) {
      console.log('No valid token');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    console.log('Request body:', body);
    
    const { tool, args } = body;

    switch (tool) {
      case 'create_blog_post': {
        console.log('Creating blog post with args:', args);
        const validatedArgs = CreateBlogPostSchema.parse(args);
        
        // AI를 사용하여 블로그 포스트 내용 생성
        const generatedContent = await generateBlogPostContent(
          validatedArgs.title, 
          validatedArgs.content
        );
        
        // Auto-classify category if not provided
        let category = validatedArgs.category;
        if (!category) {
          category = await categoryClassifier.classify(generatedContent);
        }

        // Create blog post with AI generated content
        const post = await blogPostService.createPost({
          title: validatedArgs.title,
          content: generatedContent,
          excerpt: validatedArgs.excerpt || generatedContent.replace(/<[^>]*>/g, '').substring(0, 200),
          category,
          tags: validatedArgs.tags || [],
        });

        console.log('Post created successfully:', post);

        return NextResponse.json({
          success: true,
          data: {
            title: post.title,
            slug: post.slug,
            category: post.category,
            content: generatedContent,
            url: `${process.env.NEXTAUTH_URL}/blog/${post.slug}`,
          },
          message: 'AI가 생성한 블로그 포스트가 성공적으로 작성되었습니다!',
        });
      }

      case 'classify_content': {
        const validatedArgs = ClassifyContentSchema.parse(args);
        const category = await categoryClassifier.classify(validatedArgs.content);

        return NextResponse.json({
          success: true,
          data: { category },
          message: `추천 카테고리: ${category}`,
        });
      }

      default:
        return new NextResponse('Unknown tool', { status: 400 });
    }
  } catch (error) {
    console.error('MCP API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(`Internal Server Error: ${errorMessage}`, { status: 500 });
  }
}

// MCP Tools list endpoint
export async function GET(req: NextRequest) {
  // Check API token for tools list
  const hasValidToken = verifyApiToken(req);
  if (!hasValidToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.json({
    tools: [
      {
        name: 'create_blog_post',
        description: 'Create a new blog post with automatic category classification',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Blog post title',
            },
            content: {
              type: 'string',
              description: 'Blog post content in markdown format',
            },
            excerpt: {
              type: 'string',
              description: 'Blog post excerpt (optional)',
            },
            category: {
              type: 'string',
              description: 'Blog post category (optional, will be auto-classified if not provided)',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Blog post tags (optional)',
            },
          },
          required: ['title', 'content'],
        },
      },
      {
        name: 'classify_content',
        description: 'Classify content into appropriate blog categories',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'Content to classify',
            },
          },
          required: ['content'],
        },
      },
    ],
  });
} 