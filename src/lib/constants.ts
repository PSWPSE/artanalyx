import { AgeGroupCriteria } from '@/types';

// 연령대 구분 기준
export const AGE_GROUPS = {
  infant: { min: 2, max: 4, label: '영유아 (2-4세)' },
  child: { min: 5, max: 7, label: '아동 (5-7세)' },
  elementary: { min: 8, max: 12, label: '초등학생 (8-12세)' }
} as const;

// 파일 업로드 제한
export const FILE_CONSTRAINTS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
} as const;

// Rate Limiting 설정
export const RATE_LIMITS = {
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000') // 1시간
} as const;

// 연령대별 분석 기준
export const AGE_GROUP_CRITERIA: AgeGroupCriteria[] = [
  {
    ageGroup: 'infant',
    focusAreas: ['대근육/소근육 발달', '색채 인식', '기본 감정 표현', '자유로운 상상력'],
    developmentalMilestones: [
      '선긋기와 원 그리기 능력',
      '색상 구별 및 선호도',
      '가족 구성원 표현',
      '감정 상태 반영'
    ],
    analysisPrompt: `이 그림은 ${AGE_GROUPS.infant.min}-${AGE_GROUPS.infant.max}세 영유아가 그린 작품입니다. 
    다음 관점에서 전문적이고 따뜻한 분석을 제공해주세요:
    1. 발달 단계: 대근육/소근육 발달 수준과 연령 적합성
    2. 감정 표현: 색상과 형태를 통한 감정 상태 파악
    3. 창의성: 자유로운 표현력과 상상력 발현
    4. 인지 발달: 형태 인식과 공간 개념 이해도
    
    부모님께 건설적이고 격려적인 조언을 포함해주세요.`
  },
  {
    ageGroup: 'child',
    focusAreas: ['형태 인식', '공간 감각', '사회성 표현', '학습 준비도'],
    developmentalMilestones: [
      '인물화의 세부 묘사',
      '배경과 전경 구분',
      '이야기가 있는 그림',
      '규칙과 패턴 이해'
    ],
    analysisPrompt: `이 그림은 ${AGE_GROUPS.child.min}-${AGE_GROUPS.child.max}세 아동이 그린 작품입니다. 
    다음 관점에서 전문적이고 따뜻한 분석을 제공해주세요:
    1. 인지 발달: 형태 인식과 공간 감각의 발달 정도
    2. 사회성: 가족, 친구 관계 표현과 사회적 상황 이해
    3. 창의성: 독창적 표현과 문제 해결 능력
    4. 학습 준비도: 집중력, 완성도, 과제 수행 능력
    
    학령 전 준비를 위한 구체적인 가이드를 포함해주세요.`
  },
  {
    ageGroup: 'elementary',
    focusAreas: ['자아 개념', '학습 능력', '대인 관계', '정체성 형성'],
    developmentalMilestones: [
      '정교한 세부 표현',
      '원근법과 비례 이해',
      '복합적 감정 표현',
      '계획적 구성 능력'
    ],
    analysisPrompt: `이 그림은 ${AGE_GROUPS.elementary.min}-${AGE_GROUPS.elementary.max}세 초등학생이 그린 작품입니다. 
    다음 관점에서 전문적이고 따뜻한 분석을 제공해주세요:
    1. 자아 개념: 자기 표현과 정체성 형성 과정
    2. 학습 능력: 계획성, 완성도, 문제 해결 접근법
    3. 대인 관계: 또래 관계와 사회적 상황에 대한 이해
    4. 정서 발달: 복합적 감정 표현과 내적 성장
    
    학업과 사회성 발달을 위한 실질적인 조언을 포함해주세요.`
  }
];

// 에러 메시지
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `파일 크기가 너무 큽니다. ${FILE_CONSTRAINTS.maxSize / 1024 / 1024}MB 이하의 파일을 업로드해주세요.`,
  INVALID_FILE_TYPE: '지원하지 않는 파일 형식입니다. JPG, PNG, WEBP 파일만 업로드 가능합니다.',
  RATE_LIMIT_EXCEEDED: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
  ANALYSIS_FAILED: '분석 중 오류가 발생했습니다. 다시 시도해주세요.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
  INVALID_AGE: '연령을 올바르게 입력해주세요. (2-12세)',
  UPLOAD_FAILED: '파일 업로드에 실패했습니다. 다시 시도해주세요.'
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: '이미지가 성공적으로 업로드되었습니다.',
  ANALYSIS_COMPLETE: '분석이 완료되었습니다.',
  FILE_PROCESSED: '파일이 처리되었습니다.'
} as const;
