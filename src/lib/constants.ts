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
    analysisPrompt: `이 그림은 ${AGE_GROUPS.infant.min}-${AGE_GROUPS.infant.max}세 영유아가 그린 소중한 작품입니다. 
    
    부모님과 따뜻하게 대화하듯이, 다음 관점에서 전문적이고 풍부한 분석을 제공해주세요:
    
    1. 운동 발달 (Motor Development):
       - 대근육/소근육 발달 수준을 Kellogg의 그림 발달 단계 이론에 비추어 분석
       - 연필 쥐기, 선 긋기, 모양 그리기 능력을 구체적으로 관찰
       - 연령대별 정상 발달 범위와 비교하여 설명
    
    2. 감정 발달 (Emotional Expression):
       - 색채 심리학 관점에서 색상 선택의 의미 해석
       - 그림의 필압, 크기, 배치를 통한 감정 상태 파악
       - Lowenfeld의 미술 발달 단계 중 '난화기'의 특성 설명
    
    3. 창의성 발달 (Creative Expression):
       - 자유로운 표현력과 상상력의 발현 정도
       - Gardner의 다중지능 이론 중 공간지능과 연결
       - 창의적 표현을 격려하는 방법
    
    4. 인지 발달 (Cognitive Development):
       - Piaget의 전조작기(preoperational stage) 특성 관찰
       - 형태 인식, 공간 개념, 인과관계 이해도
       - 상징적 표현의 시작과 발달
    
    이 연령대는 난화기(scribbling stage)에서 전도식기로 넘어가는 중요한 시기입니다.
    연구 결과와 발달 이론을 바탕으로, 부모님께 구체적이고 실행 가능한 조언을 제공해주세요.`
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
    analysisPrompt: `이 그림은 ${AGE_GROUPS.child.min}-${AGE_GROUPS.child.max}세 아동이 그린 의미 있는 작품입니다.
    
    친절한 전문가로서, 다음 관점에서 깊이 있고 따뜻한 분석을 제공해주세요:
    
    1. 인지 발달 (Cognitive Development):
       - Piaget의 전조작기 후기 특성 분석
       - 형태 재현 능력, 공간 관계 이해, 크기 개념 파악
       - 전도식기(pre-schematic stage)에서 도식기로의 전환 관찰
       - 상징적 사고와 표상 능력의 발달
    
    2. 사회성 발달 (Social-Emotional Development):
       - 인물화를 통한 자아 개념과 대인관계 이해
       - Koppitz의 인물화 검사(DAP) 이론 적용
       - 가족, 친구 관계의 표현과 사회적 인식
       - 정서적 안정감과 애착 관계 파악
    
    3. 창의성과 표현력 (Creativity):
       - 독창적 표현과 문제 해결 접근법
       - Torrance의 창의성 검사 요소(유창성, 융통성, 독창성, 정교성) 관찰
       - 상상력과 현실 인식의 균형
    
    4. 학습 준비도 (School Readiness):
       - 과제 집중력, 완성도, 계획 능력
       - 소근육 발달과 쓰기 준비도
       - 규칙 이해와 지시 따르기 능력
       - Vygotsky의 근접발달영역(ZPD) 개념으로 발달 가능성 예측
    
    이 시기는 학령 전 마지막 단계로, 학교 적응에 중요한 시기입니다.
    연구 기반의 구체적인 가정 활동과 격려 방법을 제안해주세요.`
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
    
    전문가로서 깊이 있는 통찰과 함께, 다음 관점에서 풍부하고 따뜻한 분석을 제공해주세요:
    
    1. 자아 개념과 정체성 (Self-Concept & Identity):
       - Erikson의 심리사회적 발달 단계 중 '근면성 대 열등감' 시기 분석
       - 자기표현, 자존감, 성취욕구의 표현
       - 도식기(schematic stage)에서 사실기로의 발달
       - 자아상과 이상적 자아의 표현
    
    2. 인지 및 학습 능력 (Cognitive & Learning Skills):
       - Piaget의 구체적 조작기(concrete operational stage) 특성
       - 계획성, 조직화 능력, 문제 해결 전략
       - 원근법, 비율, 균형감 등 공간지각 능력
       - 세부 묘사와 완성도를 통한 집중력 평가
       - 메타인지 능력의 발달 징후
    
    3. 사회성과 대인관계 (Social Development):
       - 또래 관계, 우정, 소속감의 표현
       - 사회적 상황에 대한 이해와 공감 능력
       - Selman의 사회적 조망수용 단계 적용
       - 협동성과 경쟁심의 균형
    
    4. 정서 발달 (Emotional Development):
       - 복합적이고 미묘한 감정 표현 능력
       - 감정 조절과 표현의 적절성
       - 내적 갈등과 성장의 표현
       - 스트레스 대처 방식과 회복탄력성
    
    5. 창의성과 예술성 (Creativity & Artistic Expression):
       - 독창적 아이디어와 개성 있는 표현
       - 사실적 표현과 창의적 변형의 균형
       - 예술적 감수성과 미적 판단력
    
    이 시기는 Lowenfeld의 '또래집단기'(gang age)로, 학업과 사회성 발달이 중요합니다.
    심리학 연구와 교육학 이론을 바탕으로, 학교와 가정에서 실천 가능한 구체적인 지원 방법을 제안해주세요.`
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
