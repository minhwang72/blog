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
      // 기본 컨텐츠가 없으면 초기값 반환
      return NextResponse.json({
        id: null,
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
        updatedAt: new Date().toISOString(),
        updatedBy: 1,
      });
    }

    const aboutData = content[0];
    return NextResponse.json({
      id: aboutData.id,
      title: aboutData.title,
      content: aboutData.content,
      updatedAt: aboutData.updatedAt?.toISOString(),
      updatedBy: aboutData.updatedBy,
    });
  } catch (error) {
    console.error('About content fetch error:', error);
    return NextResponse.json(
      { message: '소개 페이지 내용을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    // 기존 컨텐츠 확인
    const existingContent = await db
      .select()
      .from(aboutContent)
      .orderBy(desc(aboutContent.updatedAt))
      .limit(1);

    const adminId = 1; // 임시로 1 사용, 나중에 세션에서 가져올 수 있음

    if (existingContent.length === 0) {
      // 새로 생성
      await db.insert(aboutContent).values({
        title,
        content,
        updatedBy: adminId,
      });
    } else {
      // 기존 것 업데이트
      await db
        .update(aboutContent)
        .set({
          title,
          content,
          updatedAt: new Date(),
          updatedBy: adminId,
        });
    }

    return NextResponse.json({
      success: true,
      message: '소개 페이지가 수정되었습니다.',
    });
  } catch (error) {
    console.error('About content update error:', error);
    return NextResponse.json(
      { message: '소개 페이지 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}