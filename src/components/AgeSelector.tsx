'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { AGE_GROUPS } from '@/lib/constants';
import { useAnalysisStore } from '@/store/analysisStore';

export function AgeSelector() {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const { setChildAge } = useAnalysisStore();

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
    </Card>
  );
}













