import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aboutContent } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 최신 about 컨텐츠 조회
    const content = await db
      .select()
      .from(aboutContent)
      .orderBy(desc(aboutContent.updatedAt))
      .limit(1);

    if (content.length === 0) {
      // 기본 컨텐츠가 없으면 정적 컨텐츠 반환
      return NextResponse.json({
        title: '소개',
        content: `
          <div class="text-center mb-12">
            <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              황민
            </div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              안녕하세요!
            </h1>
            <div class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto space-y-4">
              <p>개발자로서의 경험과 일상 속 배움을 기록하며,<br/>기술을 쉽고 재밌게 공유하는 블로그를 운영하고 있습니다.</p>
              <p>웹 개발, 자동화 솔루션, AI 기반 워크플로우까지<br/>다양한 분야에서 쌓은 인사이트를 나누며,<br/>저만의 색깔로 성장하는 과정을 담고 있습니다.</p>
            </div>
          </div>
        `,
        isDefault: true,
      });
    }

    const aboutData = content[0];
    return NextResponse.json({
      title: aboutData.title,
      content: aboutData.content,
      isDefault: false,
    });
  } catch (error) {
    console.error('About content fetch error:', error);
    // 에러 시에도 기본 컨텐츠 반환
    return NextResponse.json({
      title: '소개',
      content: `
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            안녕하세요!
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            개발자 황민입니다.
          </p>
        </div>
      `,
      isDefault: true,
    });
  }
}