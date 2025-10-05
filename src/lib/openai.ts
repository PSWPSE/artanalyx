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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",  // 최신 비전 모델 (gpt-4-vision-preview는 deprecated)
      messages: [
        {
          role: "system",
          content: `당신은 아동 미술 치료 전문가이자 발달 심리학자입니다. 
          아이들의 그림을 분석하여 발달 상황, 감정 상태, 창의성을 평가하고 
          부모님께 따뜻하고 건설적인 조언을 제공합니다. 
          
          분석 결과는 반드시 다음 JSON 형식으로 응답해주세요:
          {
            "insights": {
              "emotional": "감정 발달 관련 분석 (200자 내외)",
              "cognitive": "인지 발달 관련 분석 (200자 내외)", 
              "creative": "창의성 관련 분석 (200자 내외)",
              "developmental": "전반적 발달 상황 분석 (200자 내외)"
            },
            "strengths": ["강점 1", "강점 2", "강점 3"],
            "areasForGrowth": ["발전 가능 영역 1", "발전 가능 영역 2"],
            "recommendations": ["구체적 추천사항 1", "구체적 추천사항 2", "구체적 추천사항 3"],
            "parentalGuidance": "부모님을 위한 종합적인 가이드 (300자 내외)"
          }

          중요한 원칙:
          1. 항상 긍정적이고 격려적인 톤을 유지하세요
          2. 부정적 판단보다는 발전 가능성에 집중하세요
          3. 구체적이고 실행 가능한 조언을 제공하세요
          4. 연령대에 맞는 발달 기준을 적용하세요`
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
      max_tokens: 1500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI 분석 응답을 받을 수 없습니다.');
    }

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

  } catch (error) {
    console.error('OpenAI 분석 오류:', error);
    throw new Error('AI 분석 중 오류가 발생했습니다.');
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
