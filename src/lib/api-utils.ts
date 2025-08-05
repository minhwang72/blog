import { NextResponse } from 'next/server';

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    if (error instanceof Error && error.message === 'Request timeout') {
      return NextResponse.json(
        { error: '요청 시간이 초과되었습니다.' },
        { status: 408 }
      ) as T;
    }
    throw error;
  }
} 