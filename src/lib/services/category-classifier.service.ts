import OpenAI from 'openai';

export class CategoryClassifier {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async classify(content: string): Promise<string> {
    const prompt = `
다음 블로그 포스트 내용을 분석하여 가장 적절한 카테고리를 선택해주세요.

가능한 카테고리:
- 개발 (Development): 프로그래밍, 코딩, 기술 관련
- 일상 (Daily): 개인적인 일상, 경험담
- 학습 (Learning): 새로운 기술 학습, 튜토리얼
- 리뷰 (Review): 제품, 서비스, 도서 리뷰
- 생각 (Thoughts): 개인적인 생각, 철학, 관점

포스트 내용:
${content.substring(0, 1000)}...

카테고리만 응답해주세요 (예: 개발, 일상, 학습, 리뷰, 생각)
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '당신은 블로그 포스트를 카테고리별로 분류하는 전문가입니다. 주어진 내용을 분석하여 가장 적절한 카테고리를 선택해주세요.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 50,
      });

      const category = completion.choices[0]?.message?.content?.trim() || '일상';
      
      // 카테고리 정규화
      return this.normalizeCategory(category);
    } catch (error) {
      console.error('Category classification error:', error);
      return '일상'; // 기본값
    }
  }

  private normalizeCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      '개발': '개발',
      'development': '개발',
      'programming': '개발',
      '코딩': '개발',
      '기술': '개발',
      '일상': '일상',
      'daily': '일상',
      'life': '일상',
      '경험': '일상',
      '학습': '학습',
      'learning': '학습',
      'tutorial': '학습',
      '튜토리얼': '학습',
      '리뷰': '리뷰',
      'review': '리뷰',
      '평가': '리뷰',
      '생각': '생각',
      'thoughts': '생각',
      '관점': '생각',
      '철학': '생각',
    };

    const normalized = categoryMap[category.toLowerCase()] || category;
    return normalized;
  }
} 