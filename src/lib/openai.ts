import OpenAI from 'openai';
import { AGE_GROUP_CRITERIA } from './constants';
import { AgeGroup, AnalysisResult, AnalysisMode } from '@/types';

// OpenAI 클라이언트를 함수 내에서 초기화하여 환경 변수가 런타임에 로드되도록 함
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하고 서버를 재시작해주세요.'
    );
  }
  
  return new OpenAI({ apiKey });
}

// 심층적 연구 분석 프롬프트
function getDeepAnalysisPrompt(): string {
  return `당신은 20년 경력의 아동 미술 치료 전문가입니다.
          
          ⚠️ 중요: 반드시 순수 JSON 형식으로만 응답하세요.
          
          🔴 절대 규칙 - 반드시 지켜야 함:
          
          1. 모든 전문 용어 뒤에 괄호로 설명 추가:
             - "Piaget의 전조작기(만 2-7세 시기로 상징적 사고를 시작하지만 논리적 사고는 아직 어려운 단계)" ✅
             - "Piaget의 전조작기" ❌ 절대 안 됨!
             
             - "Vygotsky의 근접발달영역(혼자는 어렵지만 도움을 받으면 할 수 있는 발달 수준)" ✅
             - "근접발달영역" ❌ 절대 안 됨!
             
             - "Lowenfeld의 난화기(자유롭게 선을 긋는 초기 그림 단계)" ✅
             - "난화기" ❌ 절대 안 됨!
             
             - "Torrance의 창의성 검사(유창성, 융통성, 독창성, 정교성을 측정하는 검사)" ✅
             - "Torrance의 창의성 검사" ❌ 절대 안 됨!
             
             - "Koppitz의 DAP 검사(사람 그림을 통해 심리 상태를 파악하는 그림 검사)" ✅
             - "DAP 검사" ❌ 절대 안 됨!
          
          2. 따뜻한 어투: "~해요", "~하시면 좋겠어요"
          3. 긍정적 접근
          
          모든 전문 용어에 괄호 설명이 없으면 잘못된 응답입니다!
          
          분석 결과는 반드시 다음 JSON 형식으로 응답해주세요:
          {
            "imageDescription": "그림 설명 (200-250자): 이 그림이 무엇을 그렸는지 자세히 설명해주세요. 예: '이 그림에는 [주요 대상]이/가 그려져 있어요. [색상/크기/위치] 등의 특징이 보이며, [배경이나 주변 요소]도 함께 표현되어 있습니다. [특별한 표현이나 독특한 점]이 인상적이네요. 이러한 그림을 미술 심리 관점에서 분석해드리겠습니다.'",
            "insights": {
              "emotional": "감정 발달 분석 (400-500자): 따뜻한 톤으로 아이의 감정 상태를 설명하고, 관련 연구나 발달 이론을 언급하며 구체적인 관찰 내용을 전달",
              "cognitive": "인지 발달 분석 (400-500자): 의사 선생님처럼 친절하게 인지 발달 수준을 설명하고, 연령대별 발달 단계 이론을 바탕으로 구체적인 분석 제공", 
              "creative": "창의성 분석 (400-500자): 격려하는 톤으로 창의적 표현의 의미를 설명하고, 미술 심리학 연구를 인용하여 풍부하게 분석",
              "developmental": "종합 발달 분석 (400-500자): 전문가의 시각에서 전반적인 발달 상황을 종합적으로 설명하고, 향후 발달 전망과 학문적 근거를 포함",
              "social": "사회성 및 대인관계 분석 (400-500자): 그림에 나타난 사람들과의 관계, 사회적 상황 이해도, 협력 능력을 Selman의 역할 채택 이론(다른 사람의 관점을 이해하는 능력)과 Parten의 놀이 발달 단계(혼자 놀이에서 협동 놀이로 발달)를 바탕으로 분석",
              "drawingElements": "그림 요소 전문 분석 (400-500자): 색상 선택과 배치, 선의 강도와 질감, 공간 구성과 크기 비율, 세부 묘사 수준, 생략되거나 과장된 부분을 Koppitz의 DAP 분석(사람 그림의 각 요소가 가진 심리적 의미)과 Lowenfeld의 미술 발달 단계를 근거로 상세히 해석",
              "selfConcept": "자아 개념 및 자존감 분석 (400-500자): 자기 자신을 어떻게 표현하는지, 자신감 수준, 자기 효능감을 Erikson의 심리사회적 발달 단계(신뢰감, 자율성, 주도성)와 Harter의 자존감 발달 이론(영역별 자기 인식)을 바탕으로 분석",
              "physical": "신체 발달 분석 (400-500자): 소근육 발달(선 그리기, 세부 표현), 대근육 발달(전체 동작의 통제), 눈-손 협응력을 Gesell의 발달 규준(연령별 운동 발달 기준)과 Kephart의 지각-운동 이론(신체 움직임과 인지 발달의 관계)을 근거로 평가"
            },
            "developmentalLevels": {
              "emotional": "below/average/above 중 하나 선택 - 연령 대비 감정 발달 수준",
              "cognitive": "below/average/above 중 하나 선택 - 연령 대비 인지 발달 수준",
              "creative": "below/average/above 중 하나 선택 - 연령 대비 창의성 수준",
              "social": "below/average/above 중 하나 선택 - 연령 대비 사회성 수준",
              "physical": "below/average/above 중 하나 선택 - 연령 대비 신체 발달 수준"
            },
            "strengths": [
              "3-4개의 강점을 각각 200-250자로 작성. 각 항목은 관찰된 강점 + 중요성 + 이론적 근거 + 구체적 예시를 포함하되, 글자수나 가이드 메시지는 절대 포함하지 말고 실제 내용만 작성하세요."
            ],
            "areasForGrowth": [
              "2-3개의 발전 영역을 각각 200-250자로 작성. 각 항목은 발전 가능 영역 + 도움이 되는 이유 + 구체적 연습 방법 + 기대 효과를 포함하되, 글자수나 가이드 메시지는 절대 포함하지 말고 실제 내용만 작성하세요."
            ],
            "recommendations": [
              "3-4개의 추천사항을 각각 200-250자로 작성. 각 항목은 활동명 + 추천 이유 + 단계별 방법 + 예상 효과 + 연구 근거를 포함하되, 글자수나 가이드 메시지는 절대 포함하지 말고 실제 내용만 작성하세요."
            ],
            "parentalGuidance": "600-800자의 종합 가이드를 작성하되, 다음 구조로 단락을 나누세요. 단, '부모님께 드리는 종합 가이드', '600-800자', '[현재 상태 요약]' 같은 가이드 메시지는 절대 포함하지 말고 실제 내용만 작성하세요.\\n\\n구조:\\n1단락: 아이의 전반적 발달 수준 요약(2-3문장)\\n2단락: 주목할 만한 발달 특성과 이론적 근거(2-3문장)\\n3단락: 가정에서의 구체적 실천 방법 1-2가지\\n4단락: 따뜻한 격려 메시지",
            "actionPlan": {
              "immediate": [
                "2-3개의 즉시 실천 항목을 각각 150-200자로 작성. 오늘부터 1주일 내 시작할 수 있는 간단한 활동을 제안하되, '즉시 실천 항목', '150-200자' 같은 가이드 메시지는 절대 포함하지 말고 실제 내용만 작성하세요."
              ],
              "shortTerm": [
                "2-3개의 단기 목표를 각각 150-200자로 작성. 1-3개월 내 달성할 목표와 구체적 방법을 제안하되, '단기 목표', '150-200자' 같은 가이드 메시지는 절대 포함하지 말고 실제 내용만 작성하세요."
              ],
              "longTerm": [
                "2개의 장기 목표를 각각 150-200자로 작성. 6-12개월 내 기대되는 발달 목표를 제안하되, '장기 목표', '150-200자' 같은 가이드 메시지는 절대 포함하지 말고 실제 내용만 작성하세요."
              ]
            },
            "redFlags": ["주의가 필요한 신호가 있을 경우에만 포함 (예: 극도로 어두운 색상만 사용, 공격적 표현, 사람 없는 그림 등). 없으면 이 필드 자체를 생략"],
            "professionalConsultation": "전문가 상담이 권장되는 경우에만 포함 (200-300자로 구체적 사유 설명). 정상 발달 범위이면 이 필드 자체를 생략"
          }

          반드시 지켜야 할 원칙:
          1. 친절한 의사 선생님의 톤 - "~해요", "~하시면 좋아요", "~한 점이 보이네요"
          2. 전문성 - 발달심리학 이론(피아제, 비고츠키 등), 미술치료 연구, 발달 단계 이론 인용
          3. 구체성 - 막연한 표현 대신 구체적인 관찰과 해석
          4. 풍부함 - 각 항목마다 충분한 양의 내용과 근거 제시
          5. 긍정성 - 문제보다는 가능성에 초점, 따뜻한 격려`;
}

// 쉽고 이해하기 쉬운 분석 프롬프트
function getSimpleAnalysisPrompt(): string {
  return `당신은 아동 발달 전문가이자 친근한 육아 상담사입니다.
          
          ⚠️ 중요: 반드시 순수 JSON 형식으로만 응답하세요.
          
          🔴 절대 규칙 - 반드시 지켜야 함:
          
          1. 전문 용어 사용 금지! 일상적인 쉬운 말로만 설명하세요.
             - "아이가 무언가를 상상하고 표현하는 시기예요" ✅
             - "Piaget의 전조작기" ❌ 절대 안 됨!
             
             - "손가락과 손목을 자유롭게 쓰는 능력이 발달하고 있어요" ✅
             - "소근육 발달" ❌ 가능한 한 피하세요!
          
          2. 따뜻하고 친근한 어투: "~해요", "~하면 좋아요", "~네요"
          3. 부모가 쉽게 이해할 수 있는 일상 언어 사용
          4. 간결하고 핵심만 전달
          5. 긍정적이고 격려하는 톤
          
          ⚠️ 절대 규칙: 응답에는 글자수나 가이드 메시지(예: (150-200자), (250-300자) 등)를 절대 포함하지 마세요! 실제 분석 내용만 작성하세요!
          
          분석 결과는 반드시 다음 JSON 형식으로 응답해주세요:
          {
            "imageDescription": "이 그림이 무엇을 그렸는지 쉽게 설명해주세요. 예: '이 그림에는 [주요 대상]이 있네요. [색깔이나 특징]이 눈에 띄고, [재미있는 포인트]가 보여요. 그럼 아이의 마음을 살펴볼까요?'",
            "insights": {
              "emotional": "아이의 감정 상태를 쉽게 설명하고, 그림에서 보이는 감정 표현을 일상 언어로 풀어서 전달해주세요. 전문 용어 대신 '기분', '마음', '느낌' 같은 단어를 사용하여 250-300자 정도로 작성하되, 글자수는 응답에 포함하지 마세요.",
              "cognitive": "아이가 생각하고 이해하는 능력을 쉬운 말로 설명하세요. '생각하는 힘', '이해하는 능력', '상상력' 같은 표현을 사용하여 250-300자 정도로 작성하되, 글자수는 응답에 포함하지 마세요.", 
              "creative": "아이의 독특한 표현과 창의적인 면을 격려하는 톤으로 설명하세요. '상상력', '표현력', '독창성' 같은 일상 언어를 사용하여 250-300자 정도로 작성하되, 글자수는 응답에 포함하지 마세요.",
              "developmental": "아이의 전반적인 성장 모습을 쉽게 설명하고, 연령에 맞는 발달인지 알려주세요. 250-300자 정도로 작성하되, 글자수는 응답에 포함하지 마세요.",
              "social": "친구나 가족과의 관계, 다른 사람을 이해하는 능력을 쉽게 설명하세요. '친구 관계', '함께 놀기', '다른 사람 이해하기' 같은 표현을 사용하여 250-300자 정도로 작성하되, 글자수는 응답에 포함하지 마세요.",
              "drawingElements": "색깔 선택, 그림 크기, 선의 세기 등을 쉽게 설명하세요. '밝은 색', '진한 선', '큰 그림', '작은 그림' 같은 표현을 사용하여 250-300자 정도로 작성하되, 글자수는 응답에 포함하지 마세요.",
              "selfConcept": "아이가 자기 자신을 어떻게 생각하는지, 자신감이 있는지를 쉽게 설명하세요. '자신감', '자기 생각', '스스로 하기' 같은 표현을 사용하여 250-300자 정도로 작성하되, 글자수는 응답에 포함하지 마세요.",
              "physical": "손과 팔을 쓰는 능력, 그림 그리기 기술을 쉽게 설명하세요. '손 사용', '그리기 솜씨', '세밀한 표현' 같은 일상 언어를 사용하여 250-300자 정도로 작성하되, 글자수는 응답에 포함하지 마세요."
            },
            "developmentalLevels": {
              "emotional": "below/average/above 중 하나 선택",
              "cognitive": "below/average/above 중 하나 선택",
              "creative": "below/average/above 중 하나 선택",
              "social": "below/average/above 중 하나 선택",
              "physical": "below/average/above 중 하나 선택"
            },
            "strengths": [
              "쉬운 말로 아이의 좋은 점을 칭찬하고, 왜 중요한지 간단히 설명하세요. 3-4개 항목을 각각 120-150자 정도로 작성하되, 글자수나 가이드 메시지는 절대 포함하지 마세요."
            ],
            "areasForGrowth": [
              "더 발전할 수 있는 부분을 부드럽게 제안하고, 어떻게 도와줄 수 있는지 간단히 알려주세요. 2-3개 항목을 각각 120-150자 정도로 작성하되, 글자수나 가이드 메시지는 절대 포함하지 마세요."
            ],
            "recommendations": [
              "집에서 쉽게 할 수 있는 활동을 제안하고, 어떤 점이 좋은지 간단히 설명하세요. 3-4개 항목을 각각 120-150자 정도로 작성하되, 글자수나 가이드 메시지는 절대 포함하지 마세요."
            ],
            "parentalGuidance": "부모님을 위한 가이드를 쉬운 말로 작성하세요. 400-500자 정도로 작성하되, 글자수나 가이드 메시지는 절대 포함하지 마세요.\\n\\n구조:\\n1단락: 아이의 현재 모습을 쉽게 요약(2문장)\\n2단락: 특별히 좋은 점이나 주목할 점(2문장)\\n3단락: 집에서 할 수 있는 간단한 방법 1-2가지\\n4단락: 따뜻한 응원 메시지",
            "actionPlan": {
              "immediate": [
                "오늘부터 바로 할 수 있는 간단한 활동을 제안하세요. 2-3개 항목을 각각 80-120자 정도로 작성하되, 글자수나 가이드 메시지는 절대 포함하지 마세요."
              ],
              "shortTerm": [
                "1-3개월 동안 할 수 있는 활동을 쉽게 제안하세요. 2-3개 항목을 각각 80-120자 정도로 작성하되, 글자수나 가이드 메시지는 절대 포함하지 마세요."
              ],
              "longTerm": [
                "6-12개월 후 기대할 수 있는 변화를 쉽게 설명하세요. 2개 항목을 각각 80-120자 정도로 작성하되, 글자수나 가이드 메시지는 절대 포함하지 마세요."
              ]
            },
            "redFlags": ["특별히 걱정되는 부분이 있을 때만 쉬운 말로 설명하세요. 없으면 이 필드를 생략하세요. 글자수나 가이드 메시지는 절대 포함하지 마세요."],
            "professionalConsultation": "전문가와 상담이 필요한 경우에만 쉬운 말로 이유를 설명하세요. 정상이면 이 필드를 생략하세요. 글자수나 가이드 메시지는 절대 포함하지 마세요."
          }

          반드시 지켜야 할 원칙:
          1. 친근한 이웃 선생님의 톤 - "~해요", "~하면 좋아요", "~네요"
          2. 쉬운 일상 언어만 사용 - 전문 용어 금지!
          3. 간결함 - 핵심만 간단명료하게
          4. 실용성 - 바로 따라 할 수 있는 구체적인 조언
          5. 긍정성 - 아이와 부모 모두를 격려하는 따뜻한 말투`;
}

export async function analyzeChildrenArtwork(
  imageUrl: string,
  childAge: number,
  ageGroup: AgeGroup,
  analysisMode: AnalysisMode = 'deep'
): Promise<AnalysisResult> {
  try {
    // OpenAI 클라이언트 초기화
    const openai = getOpenAIClient();
    
    // 연령대별 분석 기준 찾기
    const criteria = AGE_GROUP_CRITERIA.find(c => c.ageGroup === ageGroup);
    if (!criteria) {
      throw new Error('지원하지 않는 연령대입니다.');
    }

    // OpenAI API 호출 전 로깅
    console.log('Starting OpenAI analysis...');
    console.log('Model: gpt-4o');
    console.log('Child age:', childAge, 'Age group:', ageGroup);
    console.log('Analysis mode:', analysisMode);
    
    // 분석 모드에 따른 시스템 프롬프트 선택
    const systemPrompt = analysisMode === 'deep' ? getDeepAnalysisPrompt() : getSimpleAnalysisPrompt();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",  // 최신 비전 모델
      response_format: { type: "json_object" },  // JSON 응답 강제
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: criteria.analysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: analysisMode === 'deep' ? 6000 : 4000,  // simple 모드는 더 짧은 응답
      temperature: 0.7,
    });

    console.log('OpenAI response received');
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('No content in response:', response);
      throw new Error('AI 분석 응답을 받을 수 없습니다.');
    }
    
    console.log('Content length:', content.length);

    // JSON 파싱 시도
    let analysisData;
    try {
      // JSON 부분만 추출 (```json으로 감싸져 있을 수 있음)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      analysisData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError);
      throw new Error('분석 결과를 처리할 수 없습니다.');
    }

    // 결과 객체 생성
    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      childAge,
      ageGroup,
      imageUrl,
      imageDescription: analysisData.imageDescription || '',
      insights: analysisData.insights,
      recommendations: analysisData.recommendations || [],
      strengths: analysisData.strengths || [],
      areasForGrowth: analysisData.areasForGrowth || [],
      parentalGuidance: analysisData.parentalGuidance || '',
      actionPlan: analysisData.actionPlan || {
        immediate: [],
        shortTerm: [],
        longTerm: []
      },
      // Phase 2: 정량적 평가
      developmentalLevels: analysisData.developmentalLevels || {
        emotional: 'average',
        cognitive: 'average',
        creative: 'average',
        social: 'average',
        physical: 'average'
      },
      // Phase 2: 주의 신호 (optional)
      redFlags: analysisData.redFlags,
      professionalConsultation: analysisData.professionalConsultation,
      createdAt: new Date().toISOString(),
    };

    return result;

  } catch (error: unknown) {
    console.error('OpenAI 분석 오류:', error);
    
    // 상세한 에러 메시지 로깅
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // OpenAI API 에러인 경우 상세 정보 출력
    if (typeof error === 'object' && error !== null) {
      console.error('Error details:', JSON.stringify(error, null, 2));
    }
    
    throw new Error('AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 이미지 URL 유효성 검사
export function validateImageUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// 연령대 결정 함수
export function determineAgeGroup(age: number): AgeGroup {
  if (age >= 2 && age <= 4) return 'infant';
  if (age >= 5 && age <= 7) return 'child';
  if (age >= 8 && age <= 12) return 'elementary';
  throw new Error('지원하지 않는 연령대입니다. (2-12세만 지원)');
}
