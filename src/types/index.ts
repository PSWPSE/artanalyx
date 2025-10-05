// 연령 그룹 타입 정의
export type AgeGroup = 'infant' | 'child' | 'elementary';

// 아이 정보 인터페이스
export interface ChildInfo {
  age: number;
  ageGroup: AgeGroup;
}

// 분석 결과 인터페이스
export interface AnalysisResult {
  id: string;
  childAge: number;
  ageGroup: AgeGroup;
  imageUrl: string;
  insights: {
    emotional: string;
    cognitive: string;
    creative: string;
    developmental: string;
  };
  recommendations: string[];
  strengths: string[];
  areasForGrowth: string[];
  parentalGuidance: string;
  createdAt: string;
}

// API 응답 인터페이스
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 업로드 상태 타입
export type UploadStatus = 'idle' | 'uploading' | 'analyzing' | 'completed' | 'error';

// 분석 요청 인터페이스
export interface AnalysisRequest {
  imageUrl: string;
  childAge: number;
  ageGroup: AgeGroup;
}

// 사용량 추적 인터페이스
export interface UsageTracking {
  id: string;
  ipAddress: string;
  requestsCount: number;
  lastRequest: string;
  date: string;
}

// 연령대별 분석 기준 인터페이스
export interface AgeGroupCriteria {
  ageGroup: AgeGroup;
  focusAreas: string[];
  developmentalMilestones: string[];
  analysisPrompt: string;
}
