'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { FILE_CONSTRAINTS, ERROR_MESSAGES } from '@/lib/constants';
import { useAnalysisStore } from '@/store/analysisStore';

export function ImageUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { setUploadedImage, setError } = useAnalysisStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 파일 크기 검증
    if (file.size > FILE_CONSTRAINTS.maxSize) {
      setError(ERROR_MESSAGES.FILE_TOO_LARGE);
      return;
    }

    // 파일 타입 검증
    if (!FILE_CONSTRAINTS.allowedTypes.includes(file.type)) {
      setError(ERROR_MESSAGES.INVALID_FILE_TYPE);
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 파일 업로드
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || ERROR_MESSAGES.UPLOAD_FAILED);
      }

      setUploadedImage(result.data.url);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || ERROR_MESSAGES.UPLOAD_FAILED);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [setUploadedImage, setError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const clearImage = () => {
    setPreview(null);
    setUploadedImage(null);
  };

  return (
    <Card className="p-6">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-sm text-gray-600">업로드 중...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-base font-medium text-gray-700 mb-1">
                    {isDragActive
                      ? '여기에 이미지를 놓아주세요'
                      : '그림 이미지를 드래그하거나 클릭하여 업로드'}
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, WEBP 파일 (최대 10MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={preview}
              alt="업로드된 그림"
              fill
              className="object-contain"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-white hover:bg-gray-100"
          >
            <X className="w-4 h-4 mr-1" />
            삭제
          </Button>

          {uploading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}







