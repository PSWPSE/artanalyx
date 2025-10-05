import { put, del } from '@vercel/blob';

/**
 * Vercel Blob에 이미지 업로드
 * @param fileBuffer - 파일 버퍼
 * @param fileName - 파일명
 * @returns 업로드된 이미지 URL과 파일명
 */
export async function uploadImageToBlob(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ url: string; publicId: string }> {
  try {
    // 안전한 파일명 생성
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blobFileName = `artanalyx/artwork_${timestamp}_${sanitizedFileName}`;

    // Vercel Blob에 업로드
    const blob = await put(blobFileName, fileBuffer, {
      access: 'public',
      contentType: getContentType(fileName),
      addRandomSuffix: false,
    });

    console.log('✅ Image uploaded to Vercel Blob:', blob.url);

    return {
      url: blob.url,
      publicId: blobFileName, // 삭제를 위해 파일명 저장
    };
  } catch (error) {
    console.error('❌ Vercel Blob upload failed:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
}

/**
 * Vercel Blob에서 이미지 삭제
 * @param blobUrl - 삭제할 Blob URL
 */
export async function deleteImageFromBlob(blobUrl: string): Promise<void> {
  try {
    await del(blobUrl);
    console.log('✅ Image deleted from Vercel Blob:', blobUrl);
  } catch (error) {
    console.error('❌ Failed to delete image from Vercel Blob:', error);
    throw new Error('이미지 삭제에 실패했습니다.');
  }
}

/**
 * 24시간 후 자동 삭제 예약 (프라이버시 보호)
 * @param blobUrl - 삭제할 Blob URL
 */
export function scheduleImageDeletion(blobUrl: string): void {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  
  setTimeout(async () => {
    try {
      await deleteImageFromBlob(blobUrl);
      console.log('🗑️ Scheduled deletion completed:', blobUrl);
    } catch (error) {
      console.error('❌ Scheduled deletion failed:', error);
    }
  }, TWENTY_FOUR_HOURS);
}

/**
 * 파일명에서 Content-Type 추론
 */
function getContentType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const contentTypeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  };

  return contentTypeMap[extension || ''] || 'image/jpeg';
}

