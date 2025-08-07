import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const adId = parseInt(params.id);

    const ad = await db
      .select()
      .from(adSettings)
      .where(eq(adSettings.id, adId))
      .limit(1);

    if (ad.length === 0) {
      return NextResponse.json(
        { message: '광고 설정을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const adData = ad[0];

    return NextResponse.json({
      id: adData.id,
      name: adData.name,
      position: adData.position,
      adCode: adData.adCode,
      enabled: adData.enabled,
      postTypes: adData.postTypes,
      displayRules: adData.displayRules,
      createdAt: adData.createdAt?.toISOString(),
      updatedAt: adData.updatedAt?.toISOString(),
    });
  } catch (error) {
    console.error('Ad setting fetch error:', error);
    return NextResponse.json(
      { message: '광고 설정을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const adId = parseInt(params.id);
    const body = await request.json();
    const { name, position, adCode, enabled, postTypes, displayRules } = body;

    if (!name || !position || !adCode) {
      return NextResponse.json(
        { message: '이름, 위치, 광고 코드는 필수입니다.' },
        { status: 400 }
      );
    }

    const adminId = 1; // 임시로 1 사용

    await db
      .update(adSettings)
      .set({
        name,
        position,
        adCode,
        enabled,
        postTypes,
        displayRules: displayRules || null,
        updatedAt: new Date(),
        updatedBy: adminId,
      })
      .where(eq(adSettings.id, adId));

    return NextResponse.json({ 
      success: true,
      message: '광고 설정이 수정되었습니다.'
    });
  } catch (error) {
    console.error('Ad setting update error:', error);
    return NextResponse.json(
      { message: '광고 설정 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const adId = parseInt(params.id);

    // 광고 설정 존재 확인
    const existingAd = await db
      .select({ id: adSettings.id })
      .from(adSettings)
      .where(eq(adSettings.id, adId))
      .limit(1);

    if (existingAd.length === 0) {
      return NextResponse.json(
        { message: '광고 설정을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 광고 설정 삭제
    await db.delete(adSettings).where(eq(adSettings.id, adId));

    return NextResponse.json({ 
      success: true,
      message: '광고 설정이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Ad setting delete error:', error);
    return NextResponse.json(
      { message: '광고 설정 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}