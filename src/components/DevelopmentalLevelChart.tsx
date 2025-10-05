'use client';

import { Card } from './ui/card';
import { DevelopmentalLevel } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DevelopmentalLevelChartProps {
  levels: {
    emotional: DevelopmentalLevel;
    cognitive: DevelopmentalLevel;
    creative: DevelopmentalLevel;
    social: DevelopmentalLevel;
    physical: DevelopmentalLevel;
  };
}

const levelLabels = {
  emotional: '감정 발달',
  cognitive: '인지 발달',
  creative: '창의성',
  social: '사회성',
  physical: '신체 발달',
};

const levelColors = {
  below: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  average: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  above: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
};

const levelText = {
  below: '발달 중',
  average: '평균',
  above: '우수',
};

const levelIcon = {
  below: <TrendingDown className="w-5 h-5" />,
  average: <Minus className="w-5 h-5" />,
  above: <TrendingUp className="w-5 h-5" />,
};

export function DevelopmentalLevelChart({ levels }: DevelopmentalLevelChartProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span> 연령 대비 발달 수준
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(levels).map(([key, level]) => {
          const colors = levelColors[level];
          const label = levelLabels[key as keyof typeof levelLabels];
          const text = levelText[level];
          const icon = levelIcon[level];
          
          return (
            <div key={key} className={`bg-white rounded-lg p-3 border-2 ${colors.border}`}>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-2">{label}</div>
                <div className={`flex items-center justify-center gap-1 ${colors.text}`}>
                  <span className="scale-75">{icon}</span>
                  <span className="font-bold text-sm">{text}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="mt-3 text-xs text-gray-600 leading-relaxed">
        💡 같은 연령대 비교 기준 / 모든 아이는 자신만의 속도로 발달합니다
      </p>
    </Card>
  );
}

