import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface Params {
  id: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const adId = parseInt(params.id);
    const { enabled } = await request.json();

    await db
      .update(adSettings)
      .set({
        enabled,
        updatedAt: new Date(),
      })
      .where(eq(adSettings.id, adId));

    return NextResponse.json({ 
      success: true,
      message: enabled ? '광고가 활성화되었습니다.' : '광고가 비활성화되었습니다.'
    });
  } catch (error) {
    console.error('Ad toggle error:', error);
    return NextResponse.json(
      { message: '광고 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}