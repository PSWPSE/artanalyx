import OpenAI from 'openai';
import { AGE_GROUP_CRITERIA } from './constants';
import { AgeGroup, AnalysisResult } from '@/types';

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

export async function analyzeChildrenArtwork(
  imageUrl: string,
  childAge: number,
  ageGroup: AgeGroup
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
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",  // 최신 비전 모델
      response_format: { type: "json_object" },  // JSON 응답 강제
      messages: [
        {
          role: "system",
          content: `당신은 20년 경력의 아동 미술 치료 전문가입니다.
          
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
            "insights": {
              "emotional": "감정 발달 분석 (400-500자): 따뜻한 톤으로 아이의 감정 상태를 설명하고, 관련 연구나 발달 이론을 언급하며 구체적인 관찰 내용을 전달",
              "cognitive": "인지 발달 분석 (400-500자): 의사 선생님처럼 친절하게 인지 발달 수준을 설명하고, 연령대별 발달 단계 이론을 바탕으로 구체적인 분석 제공", 
              "creative": "창의성 분석 (400-500자): 격려하는 톤으로 창의적 표현의 의미를 설명하고, 미술 심리학 연구를 인용하여 풍부하게 분석",
              "developmental": "종합 발달 분석 (400-500자): 전문가의 시각에서 전반적인 발달 상황을 종합적으로 설명하고, 향후 발달 전망과 학문적 근거를 포함"
            },
            "strengths": ["관찰된 강점을 구체적으로 3-4개", "각 항목마다 '~한 점이 인상적이에요' 같은 친절한 표현 사용"],
            "areasForGrowth": ["발전 가능 영역 2-3개", "'~하는 연습을 해보면 좋겠어요' 같은 격려적 표현"],
            "recommendations": ["전문가로서 구체적이고 실행 가능한 추천 3-4개", "연구 기반의 활동이나 방법 제안"],
            "parentalGuidance": "부모님께 드리는 종합 가이드 (500-600자): 마치 진료 후 부모 상담처럼 따뜻하고 전문적으로, 아이의 현재 상태를 요약하고 가정에서 할 수 있는 구체적인 방법을 연구 결과와 함께 안내"
          }

          반드시 지켜야 할 원칙:
          1. 친절한 의사 선생님의 톤 - "~해요", "~하시면 좋아요", "~한 점이 보이네요"
          2. 전문성 - 발달심리학 이론(피아제, 비고츠키 등), 미술치료 연구, 발달 단계 이론 인용
          3. 구체성 - 막연한 표현 대신 구체적인 관찰과 해석
          4. 풍부함 - 각 항목마다 충분한 양의 내용과 근거 제시
          5. 긍정성 - 문제보다는 가능성에 초점, 따뜻한 격려`
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
      max_tokens: 2500,  // 안전한 토큰 수로 조정
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
      insights: analysisData.insights,
      recommendations: analysisData.recommendations || [],
      strengths: analysisData.strengths || [],
      areasForGrowth: analysisData.areasForGrowth || [],
      parentalGuidance: analysisData.parentalGuidance || '',
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
