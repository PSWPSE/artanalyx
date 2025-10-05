'use client';

import { Card } from './ui/card';
import { AnalysisResult as AnalysisResultType } from '@/types';
import { Lightbulb, TrendingUp, Target, Heart, BookOpen, Users, Palette, Clock, Calendar, Flag, AlertTriangle, UserCheck, Activity } from 'lucide-react';
import { DevelopmentalLevelChart } from './DevelopmentalLevelChart';

interface AnalysisResultProps {
  result: AnalysisResultType;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const insightIcons = {
    emotional: <Heart className="w-6 h-6 text-red-500" />,
    cognitive: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    creative: <Target className="w-6 h-6 text-purple-500" />,
    developmental: <TrendingUp className="w-6 h-6 text-green-500" />,
    social: <Users className="w-6 h-6 text-blue-500" />,
    drawingElements: <Palette className="w-6 h-6 text-pink-500" />,
    selfConcept: <UserCheck className="w-6 h-6 text-indigo-500" />,
    physical: <Activity className="w-6 h-6 text-orange-500" />,
  };

  const insightLabels = {
    emotional: '감정 발달',
    cognitive: '인지 발달',
    creative: '창의성',
    developmental: '전반적 발달',
    social: '사회성 및 대인관계',
    drawingElements: '그림 요소 분석',
    selfConcept: '자아 개념 및 자존감',
    physical: '신체 발달',
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
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(result.insights).map(([key, value]) => (
          <Card key={key} className="p-8 hover:shadow-lg transition-shadow border-2">
            <div className="flex items-start gap-4">
              <div className="mt-1.5 flex-shrink-0">
                {insightIcons[key as keyof typeof insightIcons]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                  {insightLabels[key as keyof typeof insightLabels]}
                </h3>
                <p 
                  className="text-base text-gray-800 leading-loose"
                  dangerouslySetInnerHTML={{
                    __html: value.replace(
                      /([가-힣A-Za-z]+)\(([^)]+)\)/g,
                      '<span class="inline-block"><strong class="text-blue-700 font-semibold">$1</strong><span class="text-sm text-gray-600 bg-blue-50 px-2 py-0.5 rounded ml-1">($2)</span></span>'
                    )
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Phase 2: 발달 수준 차트 */}
      <DevelopmentalLevelChart levels={result.developmentalLevels} />

      {/* Phase 2: Red Flags (있을 경우만) */}
      {result.redFlags && result.redFlags.length > 0 && (
        <Card className="p-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300">
          <h3 className="font-bold text-2xl text-gray-900 mb-5 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            주의가 필요한 부분
          </h3>
          <ul className="space-y-4">
            {result.redFlags.map((flag, index) => (
              <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border-2 border-yellow-200">
                <span className="text-yellow-600 text-xl font-bold mt-0.5 flex-shrink-0">⚠️</span>
                <span className="text-base text-gray-800 leading-relaxed font-medium">{flag}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Phase 2: 전문가 상담 안내 (있을 경우만) */}
      {result.professionalConsultation && (
        <Card className="p-8 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300">
          <h3 className="font-bold text-2xl text-gray-900 mb-5 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-red-600" />
            전문가 상담 권장
          </h3>
          <div className="bg-white p-6 rounded-lg border-2 border-red-200">
            <p className="text-lg text-gray-800 leading-loose font-medium mb-4">
              {result.professionalConsultation}
            </p>
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>📞 도움을 받을 수 있는 곳:</strong><br/>
                • 아동발달센터, 소아정신건강의학과<br/>
                • 학교 상담실 또는 교육청 wee센터<br/>
                • 아동 미술치료센터
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 강점 */}
      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <h3 className="font-bold text-2xl text-gray-900 mb-5 flex items-center gap-3">
          <span className="text-3xl">✨</span> 발견된 강점
        </h3>
        <ul className="space-y-4">
          {result.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-green-600 text-xl font-bold mt-0.5 flex-shrink-0">•</span>
              <span className="text-base text-gray-800 leading-relaxed font-medium">{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 발전 가능 영역 */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <h3 className="font-bold text-2xl text-gray-900 mb-5 flex items-center gap-3">
          <span className="text-3xl">🌱</span> 발전 가능 영역
        </h3>
        <ul className="space-y-4">
          {result.areasForGrowth.map((area, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-blue-600 text-xl font-bold mt-0.5 flex-shrink-0">•</span>
              <span className="text-base text-gray-800 leading-relaxed font-medium">{area}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 추천사항 */}
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <h3 className="font-bold text-2xl text-gray-900 mb-5 flex items-center gap-3">
          <span className="text-3xl">💡</span> 구체적 추천사항
        </h3>
        <ul className="space-y-5">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="text-purple-600 text-xl font-bold flex-shrink-0 bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-base text-gray-800 leading-relaxed font-medium pt-0.5">{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 부모님을 위한 가이드 */}
      <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-300">
        <h3 className="font-bold text-2xl text-gray-900 mb-5 flex items-center gap-3">
          <span className="text-3xl">👨‍👩‍👧</span> 부모님을 위한 종합 가이드
        </h3>
        <div className="space-y-5 text-lg text-gray-800 leading-loose">
          {result.parentalGuidance.split('\n\n').map((paragraph, index) => {
            // [제목] 형식을 강조 표시
            if (paragraph.trim().startsWith('[') && paragraph.includes(']')) {
              const titleMatch = paragraph.match(/\[([^\]]+)\]/);
              if (titleMatch) {
                const title = titleMatch[1];
                const content = paragraph.replace(/\[([^\]]+)\]\s*/, '');
                return (
                  <div key={index} className="mb-4">
                    <h4 className="font-bold text-xl text-orange-700 mb-2 flex items-center gap-2">
                      <span className="text-orange-500">▶</span> {title}
                    </h4>
                    <p className="font-medium pl-6 whitespace-pre-line">{content}</p>
                  </div>
                );
              }
            }
            // 일반 단락
            return paragraph.trim() ? (
              <p key={index} className="font-medium whitespace-pre-line">{paragraph}</p>
            ) : null;
          })}
        </div>
      </Card>

      {/* 실행 계획 (Phase 1) */}
      <Card className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-300">
        <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-3xl">📅</span> 단계별 실행 계획
        </h3>
        
        <div className="space-y-6">
          {/* 즉시 실천 */}
          <div className="bg-white rounded-lg p-6 border-2 border-red-200">
            <h4 className="font-bold text-xl text-red-700 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-500" />
              즉시 실천 (오늘부터 1주일)
            </h4>
            <ul className="space-y-3">
              {result.actionPlan.immediate.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-600 text-lg font-bold mt-0.5 flex-shrink-0">🔥</span>
                  <span className="text-base text-gray-800 leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 단기 목표 */}
          <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
            <h4 className="font-bold text-xl text-blue-700 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              단기 목표 (1-3개월)
            </h4>
            <ul className="space-y-3">
              {result.actionPlan.shortTerm.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-600 text-lg font-bold mt-0.5 flex-shrink-0">🎯</span>
                  <span className="text-base text-gray-800 leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 장기 목표 */}
          <div className="bg-white rounded-lg p-6 border-2 border-green-200">
            <h4 className="font-bold text-xl text-green-700 mb-4 flex items-center gap-2">
              <Flag className="w-6 h-6 text-green-500" />
              장기 목표 (6-12개월)
            </h4>
            <ul className="space-y-3">
              {result.actionPlan.longTerm.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 text-lg font-bold mt-0.5 flex-shrink-0">🌟</span>
                  <span className="text-base text-gray-800 leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* 주의사항 */}
      <Card className="p-6 bg-gray-50 border-gray-300">
        <p className="text-sm text-gray-700 leading-relaxed">
          ℹ️ <strong>참고사항:</strong> 이 분석 결과는 AI 기반 미술 심리 분석으로, 참고 자료로 활용하시기 바랍니다. 
          전문적인 상담이 필요한 경우 아동 심리 전문가와 상담하시는 것을 권장합니다.
        </p>
      </Card>
    </div>
  );
}













