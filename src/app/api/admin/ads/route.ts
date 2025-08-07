import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adSettings } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const ads = await db
      .select()
      .from(adSettings)
      .orderBy(desc(adSettings.createdAt));

    return NextResponse.json(
      ads.map(ad => ({
        id: ad.id,
        name: ad.name,
        position: ad.position,
        adCode: ad.adCode,
        enabled: ad.enabled,
        postTypes: ad.postTypes,
        displayRules: ad.displayRules,
        createdAt: ad.createdAt?.toISOString(),
        updatedAt: ad.updatedAt?.toISOString(),
      }))
    );
  } catch (error) {
    console.error('Ad settings fetch error:', error);
    return NextResponse.json(
      { message: '광고 설정을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, adCode, enabled = true, postTypes = 'all', displayRules } = body;

    if (!name || !position || !adCode) {
      return NextResponse.json(
        { message: '이름, 위치, 광고 코드는 필수입니다.' },
        { status: 400 }
      );
    }

    const adminId = 1; // 임시로 1 사용, 나중에 세션에서 가져올 수 있음

    const result = await db.insert(adSettings).values({
      name,
      position,
      adCode,
      enabled,
      postTypes,
      displayRules: displayRules || null,
      updatedBy: adminId,
    });

    return NextResponse.json({ 
      success: true, 
      adId: result.insertId,
      message: '광고 설정이 생성되었습니다.'
    });
  } catch (error) {
    console.error('Ad setting creation error:', error);
    return NextResponse.json(
      { message: '광고 설정 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}