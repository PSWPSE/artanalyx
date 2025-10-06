'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { AGE_GROUPS } from '@/lib/constants';
import { useAnalysisStore } from '@/store/analysisStore';
import { AnalysisMode } from '@/types';

export function AgeSelector() {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const { setChildAge, analysisMode, setAnalysisMode } = useAnalysisStore();

  const handleAgeChange = (age: number) => {
    setSelectedAge(age);
    setChildAge(age);
  };

  // 연령대별 그룹화
  const ageGroups = [
    { ...AGE_GROUPS.infant, key: 'infant' },
    { ...AGE_GROUPS.child, key: 'child' },
    { ...AGE_GROUPS.elementary, key: 'elementary' },
  ];

  const handleModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">아이의 나이를 선택해주세요</h3>
      
      <div className="space-y-4">
        {ageGroups.map((group) => (
          <div key={group.key} className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                { length: group.max - group.min + 1 },
                (_, i) => group.min + i
              ).map((age) => (
                <button
                  key={age}
                  onClick={() => handleAgeChange(age)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${selectedAge === age
                      ? 'bg-blue-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {age}세
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedAge && (
        <p className="mt-4 text-sm text-green-600 font-medium">
          ✓ {selectedAge}세가 선택되었습니다
        </p>
      )}

      {/* 분석 방식 선택 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-base font-semibold mb-3 text-gray-900">분석 방식 선택</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleModeChange('deep')}
            className={`
              p-4 rounded-lg text-left transition-all duration-200
              ${analysisMode === 'deep'
                ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }
            `}
          >
            <div className="font-semibold mb-1">
              {analysisMode === 'deep' && '✓ '}심층적 연구 분석
            </div>
            <div className={`text-xs ${analysisMode === 'deep' ? 'text-white/90' : 'text-gray-500'}`}>
              전문 용어와 이론을 포함한<br />상세한 학술적 분석
            </div>
          </button>
          
          <button
            onClick={() => handleModeChange('simple')}
            className={`
              p-4 rounded-lg text-left transition-all duration-200
              ${analysisMode === 'simple'
                ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-lg scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }
            `}
          >
            <div className="font-semibold mb-1">
              {analysisMode === 'simple' && '✓ '}쉽고 이해하기 쉬운 분석
            </div>
            <div className={`text-xs ${analysisMode === 'simple' ? 'text-white/90' : 'text-gray-500'}`}>
              일상 언어로 설명하는<br />쉽고 친근한 분석
            </div>
          </button>
        </div>
      </div>
    </Card>
  );
}













