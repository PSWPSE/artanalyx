import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToBlob, scheduleImageDeletion } from '@/lib/vercel-blob';
import { FILE_CONSTRAINTS, ERROR_MESSAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 검증
    if (file.size > FILE_CONSTRAINTS.maxSize) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.FILE_TOO_LARGE },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
    if (!allowedTypes.includes(file.type as typeof allowedTypes[number])) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Vercel Blob에 업로드
    console.log('📤 Uploading to Vercel Blob...');
    const result = await uploadImageToBlob(buffer, file.name);

    // 24시간 후 자동 삭제 예약 (프라이버시 보호)
    scheduleImageDeletion(result.url);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        filename: file.name,
        size: file.size,
        contentType: file.type,
        storage: 'vercel-blob',
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.UPLOAD_FAILED },
      { status: 500 }
    );
  }
}

