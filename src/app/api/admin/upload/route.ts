import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 관리자 권한 확인
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // 파일 타입 확인
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 업로드 디렉토리 생성
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'images');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // 디렉토리가 이미 존재하는 경우 무시
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    // 파일 저장
    await writeFile(filePath, buffer);

    // 접근 가능한 URL 반환
    const fileUrl = `/uploads/images/${fileName}`;

    return NextResponse.json({ 
      url: fileUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}