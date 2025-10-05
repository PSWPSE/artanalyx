'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { AnalysisResult } from '@/types';
import { getAnalysisHistory, deleteAnalysisFromHistory } from '@/lib/analysisHistory';
import { Clock, Trash2, TrendingUp } from 'lucide-react';

interface AnalysisHistoryProps {
  onSelect?: (analysis: AnalysisResult) => void;
  currentId?: string;
}

export function AnalysisHistory({ onSelect, currentId }: AnalysisHistoryProps) {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setHistory(getAnalysisHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteAnalysisFromHistory(id);
    setHistory(getAnalysisHistory());
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200">
      <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-600" />
        이전 분석 기록 ({history.length}개)
      </h3>
      
      <div className="space-y-3">
        {history.map((item) => {
          const isCurrentAnalysis = item.id === currentId;
          const date = new Date(item.createdAt);
          
          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentAnalysis
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-white border-gray-200 hover:border-blue-300 cursor-pointer'
              }`}
              onClick={() => !isCurrentAnalysis && onSelect?.(item)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {item.childAge}세 ({item.ageGroup === 'infant' ? '영유아' : item.ageGroup === 'child' ? '아동' : '초등학생'})
                    </span>
                    {isCurrentAnalysis && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                        현재
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {date.toLocaleDateString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {!isCurrentAnalysis && onSelect && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(item);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <TrendingUp className="w-4 h-4" />
                      비교
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('이 분석 기록을 삭제하시겠습니까?')) {
                          handleDelete(item.id);
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

