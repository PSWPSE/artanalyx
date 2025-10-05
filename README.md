# 🎨 ArtAnalyx - 아동 미술 심리 분석 서비스

AI 기반 영유아, 아동, 초등학생 그림 작품 심리 분석 서비스입니다.

## ✨ 주요 기능

- 📸 **이미지 업로드**: 아동의 그림 작품을 간편하게 업로드
- 🤖 **AI 분석**: OpenAI GPT-4 Vision을 활용한 전문적인 미술 심리 분석
- 👶 **연령대별 맞춤 분석**: 영유아(2-4세), 아동(5-7세), 초등학생(8-12세)
- 💾 **데이터베이스 저장**: 분석 결과 자동 저장 및 이력 관리
- 🔒 **프라이버시 보호**: 24시간 후 자동 이미지 삭제

## 🚀 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 + Shadcn/ui
- **State Management**: Zustand
- **Components**: Radix UI

### Backend (Serverless)
- **API**: Next.js API Routes
- **Database**: Vercel Postgres (PostgreSQL)
- **File Storage**: Vercel Blob
- **AI**: OpenAI GPT-4 Vision

### 배포
- **Hosting**: Vercel
- **CI/CD**: GitHub → Vercel 자동 배포

## 📋 사전 준비

1. **Node.js 18+** 설치
2. **OpenAI API 키** 발급
3. **Vercel 계정** 생성

## 🛠️ 로컬 개발 환경 설정

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/artanalyx.git
cd artanalyx
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.example`을 복사하여 `.env.local` 생성:
```bash
cp .env.example .env.local
```

`.env.local` 파일에 API 키 입력:
```env
OPENAI_API_KEY=sk-proj-your-openai-key-here

# Vercel 배포 시 자동 생성됨
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
BLOB_READ_WRITE_TOKEN=
```

### 4. 데이터베이스 설정
로컬 개발용 SQLite:
```bash
npx prisma generate
npx prisma db push
```

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3001](http://localhost:3001) 접속

## 🚀 Vercel 배포

### 빠른 배포
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 상세 배포 가이드
[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) 참고

### 간단 배포 단계
1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 임포트
3. 환경 변수 설정 (`OPENAI_API_KEY`)
4. Vercel Postgres 추가
5. Vercel Blob 추가
6. 배포 완료!

## 📁 프로젝트 구조

```
artanalyx/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/      # 이미지 업로드 API
│   │   │   └── analyze/     # AI 분석 API
│   │   ├── page.tsx         # 메인 페이지
│   │   └── layout.tsx       # 레이아웃
│   ├── components/
│   │   ├── AgeSelector.tsx      # 연령 선택
│   │   ├── ImageUploader.tsx    # 이미지 업로드
│   │   ├── AnalysisResult.tsx   # 분석 결과 표시
│   │   └── ui/                  # UI 컴포넌트
│   ├── lib/
│   │   ├── vercel-blob.ts       # Vercel Blob 저장
│   │   ├── openai.ts            # OpenAI API
│   │   ├── database.ts          # Prisma 클라이언트
│   │   └── constants.ts         # 상수 정의
│   ├── store/
│   │   └── analysisStore.ts     # Zustand 스토어
│   └── types/
│       └── index.ts             # TypeScript 타입
├── prisma/
│   └── schema.prisma        # DB 스키마
├── public/                  # 정적 파일
└── vercel.json              # Vercel 설정

```

## 🔧 주요 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# Prisma 스튜디오 (DB 관리)
npm run prisma:studio

# Vercel 환경 변수 다운로드
npm run vercel:env

# Vercel 배포
npm run vercel:deploy
```

## 🔐 보안 기능

- ✅ 파일 타입 검증 (JPG, PNG, WEBP만 허용)
- ✅ 파일 크기 제한 (10MB)
- ✅ Rate Limiting (IP당 시간당 10회)
- ✅ 24시간 후 자동 이미지 삭제
- ✅ 환경 변수로 API 키 관리
- ✅ CORS 설정

## 📊 분석 기준

### 영유아 (2-4세)
- 대근육/소근육 발달
- 색채 인식
- 기본 감정 표현

### 아동 (5-7세)
- 형태 인식, 공간 감각
- 가족/친구 관계 표현
- 집중력, 과제 수행 능력

### 초등학생 (8-12세)
- 자기 표현, 정체성 형성
- 계획성, 완성도
- 또래 관계, 사회적 상황 이해

## 🐛 문제 해결

### 배포 실패 시
- Vercel 로그 확인
- 환경 변수 재확인
- Prisma 클라이언트 재생성: `npx prisma generate`

### 이미지 업로드 실패
- 파일 크기 확인 (10MB 이하)
- 파일 형식 확인 (JPG, PNG, WEBP)
- Vercel Blob 토큰 확인

### DB 연결 실패
- 환경 변수 확인: `POSTGRES_PRISMA_URL`
- Prisma 재생성: `npx prisma generate`

## 📈 성능 최적화

- ⚡ Edge Functions 활용 (Vercel)
- 🖼️ Next.js Image 최적화
- 💾 분석 결과 캐싱
- 🗜️ 자동 이미지 압축

## 📝 라이선스

MIT License

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

## 📞 문의

문의사항은 이슈로 남겨주세요.

---

**Made with ❤️ using Next.js & Vercel**
