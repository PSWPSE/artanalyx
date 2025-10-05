import { AnalysisResult } from '@/types';

const STORAGE_KEY = 'artanalyx_history';
const MAX_HISTORY = 10; // 최대 10개까지 저장

// 분석 이력 저장
export function saveAnalysisToHistory(analysis: AnalysisResult): void {
  try {
    const history = getAnalysisHistory();
    
    // 새 분석을 맨 앞에 추가
    history.unshift(analysis);
    
    // 최대 개수 초과 시 오래된 것 제거
    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save analysis to history:', error);
  }
}

// 분석 이력 조회
export function getAnalysisHistory(): AnalysisResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get analysis history:', error);
    return [];
  }
}

// 특정 분석 조회
export function getAnalysisById(id: string): AnalysisResult | null {
  const history = getAnalysisHistory();
  return history.find(item => item.id === id) || null;
}

// 분석 삭제
export function deleteAnalysisFromHistory(id: string): void {
  try {
    const history = getAnalysisHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete analysis:', error);
  }
}

// 전체 이력 삭제
export function clearAnalysisHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

// 같은 나이의 이전 분석 찾기
export function getPreviousAnalysisByAge(childAge: number, excludeId?: string): AnalysisResult | null {
  const history = getAnalysisHistory();
  return history.find(item => 
    item.childAge === childAge && item.id !== excludeId
  ) || null;
}

// 발달 진행 상황 계산
export function calculateProgress(current: AnalysisResult, previous: AnalysisResult) {
  const levelPoints = { below: 1, average: 2, above: 3 };
  
  const currentAvg = Object.values(current.developmentalLevels)
    .reduce((sum, level) => sum + levelPoints[level], 0) / 5;
    
  const previousAvg = Object.values(previous.developmentalLevels)
    .reduce((sum, level) => sum + levelPoints[level], 0) / 5;
  
  const change = currentAvg - previousAvg;
  
  return {
    change,
    direction: change > 0 ? 'improved' : change < 0 ? 'declined' : 'stable',
    percentage: Math.round(Math.abs(change) / previousAvg * 100)
  };
}

