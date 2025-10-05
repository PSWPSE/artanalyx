'use client';

import { Card } from './ui/card';
import { AnalysisResult, DevelopmentalLevel } from '@/types';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { calculateProgress } from '@/lib/analysisHistory';

interface AnalysisComparisonProps {
  current: AnalysisResult;
  previous: AnalysisResult;
}

const levelPoints = { below: 1, average: 2, above: 3 };
const levelText = { below: '발달 중', average: '평균', above: '우수' };

export function AnalysisComparison({ current, previous }: AnalysisComparisonProps) {
  const progress = calculateProgress(current, previous);
  
  const getLevelChange = (currentLevel: DevelopmentalLevel, previousLevel: DevelopmentalLevel) => {
    const change = levelPoints[currentLevel] - levelPoints[previousLevel];
    if (change > 0) return { icon: <TrendingUp className="w-5 h-5 text-green-600" />, color: 'text-green-600', text: '향상' };
    if (change < 0) return { icon: <TrendingDown className="w-5 h-5 text-red-600" />, color: 'text-red-600', text: '변화' };
    return { icon: <Minus className="w-5 h-5 text-gray-600" />, color: 'text-gray-600', text: '유지' };
  };

  const levelLabels = {
    emotional: '감정 발달',
    cognitive: '인지 발달',
    creative: '창의성',
    social: '사회성',
    physical: '신체 발달',
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
      <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-3xl">📈</span> 이전 분석과의 비교
      </h3>

      {/* 전반적 변화 */}
      <div className="mb-6 p-6 bg-white rounded-lg border-2 border-green-200">
        <div className="flex items-center gap-4">
          {progress.direction === 'improved' && (
            <>
              <TrendingUp className="w-12 h-12 text-green-600" />
              <div>
                <h4 className="font-bold text-xl text-green-700">전반적으로 {progress.percentage}% 향상되었어요!</h4>
                <p className="text-gray-700 mt-1">아이가 여러 영역에서 꾸준히 발달하고 있습니다.</p>
              </div>
            </>
          )}
          {progress.direction === 'stable' && (
            <>
              <Minus className="w-12 h-12 text-blue-600" />
              <div>
                <h4 className="font-bold text-xl text-blue-700">안정적으로 발달하고 있어요</h4>
                <p className="text-gray-700 mt-1">현재 수준을 잘 유지하고 있습니다.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 영역별 비교 */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg text-gray-800">영역별 변화</h4>
        
        {Object.entries(current.developmentalLevels).map(([key, currentLevel]) => {
          const previousLevel = previous.developmentalLevels[key as keyof typeof previous.developmentalLevels];
          const change = getLevelChange(currentLevel, previousLevel);
          const label = levelLabels[key as keyof typeof levelLabels];
          
          return (
            <div key={key} className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">{label}</span>
                
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm">{levelText[previousLevel]}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className={`font-bold ${change.color}`}>{levelText[currentLevel]}</span>
                  {change.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 기간 정보 */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <strong>📅 비교 기간:</strong> {new Date(previous.createdAt).toLocaleDateString('ko-KR')} → {new Date(current.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>
    </Card>
  );
}

