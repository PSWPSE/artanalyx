'use client';

import { useState } from 'react';
import { Palette, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { AgeSelector } from '@/components/AgeSelector';
import { AnalysisResult } from '@/components/AnalysisResult';
import { AnalysisHistory } from '@/components/AnalysisHistory';
import { AnalysisComparison } from '@/components/AnalysisComparison';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAnalysisStore } from '@/store/analysisStore';
import { determineAgeGroup } from '@/lib/openai';
import { ERROR_MESSAGES } from '@/lib/constants';
import { saveAnalysisToHistory, getPreviousAnalysisByAge } from '@/lib/analysisHistory';
import { AnalysisResult as AnalysisResultType } from '@/types';

export default function Home() {
  const {
    uploadedImage,
    childAge,
    currentAnalysis,
    uploadStatus,
    error,
    setUploadStatus,
    setCurrentAnalysis,
    addToHistory,
    setError,
    clearAnalysis,
  } = useAnalysisStore();

  const [progress, setProgress] = useState(0);
  const [previousAnalysis, setPreviousAnalysis] = useState<AnalysisResultType | null>(null);

  const handleAnalyze = async () => {
    if (!uploadedImage || !childAge) {
      setError('이미지와 나이를 모두 입력해주세요.');
      return;
    }

    setUploadStatus('analyzing');
    setError(null);
    setProgress(0);

    // 진행률 애니메이션
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const ageGroup = determineAgeGroup(childAge);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: uploadedImage,
          childAge,
          ageGroup,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || ERROR_MESSAGES.ANALYSIS_FAILED);
      }

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setCurrentAnalysis(result.data);
        addToHistory(result.data);
        
        // Phase 3: localStorage에 저장
        saveAnalysisToHistory(result.data);
        
        // Phase 3: 같은 나이의 이전 분석 찾기
        const previous = getPreviousAnalysisByAge(childAge, result.data.id);
        setPreviousAnalysis(previous);
        
        setUploadStatus('completed');
        setProgress(0);
      }, 500);

    } catch (error: unknown) {
      clearInterval(progressInterval);
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.ANALYSIS_FAILED;
      setError(errorMessage);
      setUploadStatus('error');
      setProgress(0);
    }
  };

  const handleReset = () => {
    clearAnalysis();
    setProgress(0);
  };

  const isReadyToAnalyze = uploadedImage && childAge && uploadStatus === 'idle';
  const isAnalyzing = uploadStatus === 'analyzing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">아동 미술 심리 분석</h1>
              <p className="text-sm text-gray-600">AI 기반 전문 분석 서비스</p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!currentAnalysis ? (
          <div className="space-y-6">
            {/* 안내 메시지 */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    아이의 그림으로 마음을 이해해보세요
                  </h2>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    전문가 수준의 AI 분석으로 아이의 감정, 인지 발달, 창의성을 파악하고
                    실질적인 양육 가이드를 제공합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* 분석 진행 중 */}
            {isAnalyzing && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <div>
                    <p className="font-medium text-gray-900">AI 분석 진행 중...</p>
                    <p className="text-sm text-gray-600">
                      전문적인 분석을 수행하고 있습니다. 잠시만 기다려주세요.
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* 업로드 및 선택 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1. 그림 업로드
                </h3>
                <ImageUploader />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  2. 나이 선택
                </h3>
                <AgeSelector />
              </div>
            </div>

            {/* 분석 시작 버튼 */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!isReadyToAnalyze || isAnalyzing}
                className="px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI 분석 시작
                  </>
                )}
              </Button>
            </div>

            {/* 안내 사항 */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                📋 분석 전 확인사항
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 그림이 선명하고 전체가 잘 보이는지 확인해주세요</li>
                <li>• 자연광에서 촬영한 사진이 가장 정확한 분석 결과를 제공합니다</li>
                <li>• 그림자나 반사광이 최소화된 이미지를 사용해주세요</li>
                <li>• 한 번에 한 작품만 분석 가능합니다</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 홈으로 돌아가기 버튼 (상단) */}
            <div className="flex justify-between items-center">
              <Button
                size="lg"
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
              >
                🏠 홈으로 돌아가기
              </Button>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{currentAnalysis.childAge}세</span> 분석 결과
              </div>
            </div>
            
            {/* Phase 3: 이전 분석과 비교 */}
            {previousAnalysis && (
              <AnalysisComparison current={currentAnalysis} previous={previousAnalysis} />
            )}
            
            {/* Phase 3: 분석 이력 */}
            <AnalysisHistory 
              currentId={currentAnalysis.id}
              onSelect={(selected) => setPreviousAnalysis(selected)}
            />
            
            {/* 분석 결과 */}
            <AnalysisResult result={currentAnalysis} />

            {/* 새로운 분석 버튼 (하단) */}
            <div className="flex justify-center mt-12 pb-8">
              <Button
                size="lg"
                onClick={handleReset}
                className="px-10 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                ✨ 새로운 그림 분석하기
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 아동 미술 심리 분석 서비스</p>
            <p className="mt-1">
              AI 기반 분석 결과는 참고용이며, 전문가 상담을 대체하지 않습니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
