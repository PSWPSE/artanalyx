// 연령 그룹 타입 정의
export type AgeGroup = 'infant' | 'child' | 'elementary';

// 분석 방식 타입 정의
export type AnalysisMode = 'deep' | 'simple';

// 아이 정보 인터페이스
export interface ChildInfo {
  age: number;
  ageGroup: AgeGroup;
}

// 발달 수준 타입
export type DevelopmentalLevel = 'below' | 'average' | 'above';

// 분석 결과 인터페이스
export interface AnalysisResult {
  id: string;
  childAge: number;
  ageGroup: AgeGroup;
  imageUrl: string;
  imageDescription: string;  // 그림 설명
  insights: {
    emotional: string;
    cognitive: string;
    creative: string;
    developmental: string;
    // Phase 1: 신규 카테고리
    social: string;           // 사회성 및 대인관계
    drawingElements: string;  // 그림 요소 분석 (색상, 선, 구성)
    // Phase 2: 심화 카테고리
    selfConcept: string;      // 자아 개념 및 자존감
    physical: string;         // 신체 발달 (소근육/대근육)
  };
  recommendations: string[];
  strengths: string[];
  areasForGrowth: string[];
  parentalGuidance: string;
  // Phase 1: 실행 계획
  actionPlan: {
    immediate: string[];   // 즉시 실천 (1주일 내)
    shortTerm: string[];   // 단기 목표 (1-3개월)
    longTerm: string[];    // 장기 목표 (6-12개월)
  };
  // Phase 2: 정량적 평가
  developmentalLevels: {
    emotional: DevelopmentalLevel;
    cognitive: DevelopmentalLevel;
    creative: DevelopmentalLevel;
    social: DevelopmentalLevel;
    physical: DevelopmentalLevel;
  };
  // Phase 2: 주의 신호 및 전문가 상담
  redFlags?: string[];                 // 주의가 필요한 신호들
  professionalConsultation?: string;   // 전문가 상담 권장 사유
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
  analysisMode: AnalysisMode;
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
