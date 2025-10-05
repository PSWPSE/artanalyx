'use client';

import { Card } from './ui/card';
import { AnalysisResult as AnalysisResultType } from '@/types';
import { Lightbulb, TrendingUp, Target, Heart, BookOpen } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResultType;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const insightIcons = {
    emotional: <Heart className="w-5 h-5 text-red-500" />,
    cognitive: <Lightbulb className="w-5 h-5 text-yellow-500" />,
    creative: <Target className="w-5 h-5 text-purple-500" />,
    developmental: <TrendingUp className="w-5 h-5 text-green-500" />,
  };

  const insightLabels = {
    emotional: '감정 발달',
    cognitive: '인지 발달',
    creative: '창의성',
    developmental: '전반적 발달',
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">분석 결과</h2>
            <p className="text-sm text-gray-600">
              {result.childAge}세 ({result.ageGroup === 'infant' ? '영유아' : result.ageGroup === 'child' ? '아동' : '초등학생'})
            </p>
          </div>
        </div>
      </Card>

      {/* 주요 인사이트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(result.insights).map(([key, value]) => (
          <Card key={key} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {insightIcons[key as keyof typeof insightIcons]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {insightLabels[key as keyof typeof insightLabels]}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 강점 */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-green-500">✨</span> 발견된 강점
        </h3>
        <ul className="space-y-2">
          {result.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-green-500 mt-0.5">•</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 발전 가능 영역 */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-blue-500">🌱</span> 발전 가능 영역
        </h3>
        <ul className="space-y-2">
          {result.areasForGrowth.map((area, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>{area}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 추천사항 */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-purple-500">💡</span> 구체적 추천사항
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-purple-500 mt-0.5">{index + 1}.</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 부모님을 위한 가이드 */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50">
        <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-orange-500">👨‍👩‍👧</span> 부모님을 위한 가이드
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {result.parentalGuidance}
        </p>
      </Card>

      {/* 주의사항 */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          ℹ️ 이 분석 결과는 AI 기반 미술 심리 분석으로, 참고 자료로 활용하시기 바랍니다. 
          전문적인 상담이 필요한 경우 아동 심리 전문가와 상담하시는 것을 권장합니다.
        </p>
      </Card>
    </div>
  );
}













