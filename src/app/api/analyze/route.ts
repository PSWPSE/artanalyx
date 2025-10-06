import { NextRequest, NextResponse } from 'next/server';
import { analyzeChildrenArtwork, determineAgeGroup } from '@/lib/openai';
import { prisma } from '@/lib/database';
import { ERROR_MESSAGES } from '@/lib/constants';
import { AnalysisRequest } from '@/types';
import { Prisma } from '@prisma/client';

// Rate limiting을 위한 간단한 메모리 캐시
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limit = 10; // 시간당 10회
  const windowMs = 3600000; // 1시간

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

export async function POST(request: NextRequest) {
  try {
    // IP 주소 추출
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Rate limiting 체크
    const { allowed, remaining } = checkRateLimit(ip);
    
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
      );
    }

    const body: AnalysisRequest = await request.json();
    const { imageUrl, childAge, analysisMode } = body;

    // 입력 검증
    if (!imageUrl || !childAge) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // analysisMode 기본값 설정
    const mode = analysisMode || 'deep';

    if (childAge < 2 || childAge > 12) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.INVALID_AGE },
        { status: 400 }
      );
    }

    // 연령대 결정
    const ageGroup = determineAgeGroup(childAge);

    // AI 분석 수행
    const analysisResult = await analyzeChildrenArtwork(
      imageUrl,
      childAge,
      ageGroup,
      mode
    );

    // PostgreSQL에 결과 저장 (세션 ID는 클라이언트에서 생성)
    const sessionId = request.headers.get('x-session-id') || crypto.randomUUID();
    
    try {
      await prisma.analysis.create({
        data: {
          childAge,
          childAgeGroup: ageGroup,
          imageUrl,
          analysisResult: JSON.parse(JSON.stringify(analysisResult)) as Prisma.InputJsonValue,
          sessionId,
        },
      });

      // Usage tracking - upsert 처리
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingUsage = await prisma.usageTracking.findUnique({
        where: {
          ipAddress_date: {
            ipAddress: ip,
            date: today,
          },
        },
      });

      if (existingUsage) {
        await prisma.usageTracking.update({
          where: { id: existingUsage.id },
          data: {
            requestsCount: existingUsage.requestsCount + 1,
            lastRequest: new Date(),
          },
        });
      } else {
        await prisma.usageTracking.create({
          data: {
            ipAddress: ip,
            requestsCount: 1,
            lastRequest: new Date(),
            date: today,
          },
        });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // DB 저장 실패해도 분석 결과는 반환
    }

    return NextResponse.json({
      success: true,
      data: analysisResult,
    }, {
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
      },
    });

  } catch (error: unknown) {
    console.error('Analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.ANALYSIS_FAILED;
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    );
  }
}

