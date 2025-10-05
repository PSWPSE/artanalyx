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
    <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-3xl">📊</span> 연령 대비 발달 수준 평가
      </h3>
      
      <div className="space-y-4">
        {Object.entries(levels).map(([key, level]) => {
          const colors = levelColors[level];
          const label = levelLabels[key as keyof typeof levelLabels];
          const text = levelText[level];
          const icon = levelIcon[level];
          
          return (
            <div key={key} className="bg-white rounded-lg p-4 border-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-semibold text-lg text-gray-800">{label}</span>
                </div>
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${colors.bg} ${colors.text} ${colors.border}`}>
                  {icon}
                  <span className="font-bold text-base">{text}</span>
                </div>
              </div>
              
              {/* 시각적 바 */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full ${colors.bg} border-r-4 ${colors.border} transition-all duration-500`}
                    style={{ 
                      width: level === 'below' ? '50%' : level === 'average' ? '75%' : '100%' 
                    }}
                  />
                </div>
                <span className={`text-sm font-medium ${colors.text}`}>
                  {level === 'below' ? '50%' : level === 'average' ? '75%' : '100%'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong>💡 참고:</strong> 이 평가는 같은 연령대의 아이들과 비교한 상대적 수준입니다. 
          모든 아이는 자신만의 속도로 발달하며, '발달 중'은 문제가 아니라 성장의 과정입니다.
        </p>
      </div>
    </Card>
  );
}

