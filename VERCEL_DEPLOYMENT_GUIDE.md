# 🚀 Vercel 배포 가이드

## 개요
이 서비스는 **Vercel Postgres + Vercel Blob**만 사용하여 완전히 배포할 수 있습니다.

---

## 📋 사전 준비

### 1. Vercel 계정 생성
- [vercel.com](https://vercel.com) 방문
- GitHub 계정으로 로그인

### 2. 필수 환경 변수
- `OPENAI_API_KEY`: OpenAI API 키
- `POSTGRES_PRISMA_URL`: Vercel Postgres URL (자동 생성)
- `POSTGRES_URL_NON_POOLING`: Direct connection URL (자동 생성)
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob 토큰 (자동 생성)

---

## 🎯 배포 단계

### Step 1: GitHub 연동
```bash
# 먼저 GitHub에 코드 푸시 (아직 안 했다면)
git add .
git commit -m "feat: Vercel 배포 설정 완료"
git push origin main
```

### Step 2: Vercel에서 프로젝트 임포트
1. Vercel 대시보드 → **Add New** → **Project**
2. GitHub 저장소 선택 (`artanalyx`)
3. **Import** 클릭

### Step 3: 환경 변수 설정
**Environment Variables** 섹션에서:

```plaintext
OPENAI_API_KEY=sk-proj-your-openai-key-here
```

> ⚠️ `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `BLOB_READ_WRITE_TOKEN`은 아직 입력하지 마세요. 다음 단계에서 자동 생성됩니다.

### Step 4: 배포 시작
- **Deploy** 버튼 클릭
- 첫 배포는 실패할 수 있습니다 (DB가 아직 없으므로) → 정상입니다!

### Step 5: Vercel Postgres 추가
1. 프로젝트 대시보드 → **Storage** 탭
2. **Create Database** → **Postgres** 선택
3. Database name: `artanalyx-db` (또는 원하는 이름)
4. Region: **East US (iad)** 또는 가까운 지역 선택
5. **Create** 클릭

✅ 자동으로 환경 변수가 추가됩니다:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_URL`

### Step 6: Vercel Blob 추가
1. 프로젝트 대시보드 → **Storage** 탭
2. **Create Database** → **Blob** 선택
3. **Create** 클릭

✅ 자동으로 환경 변수가 추가됩니다:
- `BLOB_READ_WRITE_TOKEN`

### Step 7: 데이터베이스 마이그레이션
두 가지 방법이 있습니다:

#### 방법 A: Vercel CLI 사용 (권장)
```bash
# Vercel CLI 설치 (처음 한 번만)
npm i -g vercel

# Vercel에 로그인
vercel login

# 프로젝트 연결
vercel link

# 환경 변수 다운로드
vercel env pull .env.local

# Prisma 마이그레이션 실행
npx prisma migrate dev --name init
npx prisma generate

# 프로덕션에 마이그레이션 푸시
npx prisma migrate deploy
```

#### 방법 B: Vercel 대시보드에서 직접 실행
1. 프로젝트 → **Settings** → **Environment Variables**
2. 다음 환경 변수 추가:
   ```
   DATABASE_URL=${POSTGRES_URL_NON_POOLING}
   ```
3. **Deployments** 탭 → 최신 배포 → **...** → **Redeploy**

### Step 8: 재배포
- **Deployments** 탭 → 최신 배포 → **Redeploy** 클릭
- 또는 GitHub에 새 커밋 푸시

---

## ✅ 배포 확인

### 1. 배포 성공 확인
- Vercel 대시보드에서 **Visit** 버튼 클릭
- 사이트가 정상적으로 로드되는지 확인

### 2. 기능 테스트
1. 이미지 업로드 테스트
2. AI 분석 실행
3. 결과 확인

### 3. 데이터베이스 확인
```bash
# Prisma Studio로 DB 확인
vercel env pull .env.local
npx prisma studio
```

---

## 🔧 로컬 개발 환경 설정

### Vercel과 동일한 환경에서 개발하기
```bash
# Vercel 환경 변수 다운로드
vercel env pull .env.local

# 개발 서버 실행
npm run dev
```

### .env.local 파일 예시
```env
# OpenAI
OPENAI_API_KEY=sk-proj-your-key-here

# Vercel Postgres
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

---

## 📊 비용 관리

### Vercel 무료 플랜 제한
- **Postgres**: 
  - 저장 공간: 256MB
  - 월간 컴퓨팅: 60시간
- **Blob**: 
  - 저장 공간: 1GB
  - 대역폭: 100GB/월
- **Function 실행**: 
  - 100GB-Hrs/월
  - 1,000만 호출/월

### 비용 절감 팁
1. **이미지 자동 삭제**: 24시간 후 자동 삭제로 Blob 용량 절약
2. **DB 정리**: 오래된 분석 결과 정기적으로 삭제
3. **캐싱 활용**: 동일한 이미지 재분석 방지

---

## 🔐 보안 설정

### 1. 환경 변수 보안
- ✅ 모든 API 키는 환경 변수로 관리
- ✅ `.env.local`은 `.gitignore`에 포함됨
- ❌ 절대 GitHub에 API 키 커밋하지 않기

### 2. Rate Limiting
- 현재 설정: IP당 시간당 10회
- 필요시 `src/app/api/analyze/route.ts`에서 조정

### 3. CORS 설정
- Vercel은 자동으로 동일 도메인 요청만 허용
- 외부 도메인 허용 필요시 `next.config.ts`에서 설정

---

## 🐛 문제 해결

### 배포 실패 시
1. **Logs 확인**: Vercel 대시보드 → Deployments → 실패한 배포 클릭
2. **환경 변수 확인**: 모든 필수 환경 변수가 설정되었는지 확인
3. **Prisma 에러**: `npx prisma generate` 실행 후 재배포

### 데이터베이스 연결 실패
```bash
# 환경 변수 다시 다운로드
vercel env pull .env.local --force

# Prisma 클라이언트 재생성
npx prisma generate

# DB 연결 테스트
npx prisma db push
```

### 이미지 업로드 실패
- Vercel Blob 토큰 확인: 환경 변수에 `BLOB_READ_WRITE_TOKEN`이 있는지 확인
- 파일 크기 제한: 10MB 이하인지 확인
- 파일 형식: JPG, PNG, WEBP만 지원

---

## 📈 모니터링

### Vercel Analytics
1. 프로젝트 → **Analytics** 탭
2. 무료로 기본 분석 제공:
   - 방문자 수
   - 페이지뷰
   - 응답 시간

### Logs 확인
```bash
# 실시간 로그 확인
vercel logs --follow
```

---

## 🚀 성능 최적화

### 1. Edge Functions 활용
Vercel은 자동으로 API를 Edge에 배포 → 빠른 응답 시간

### 2. 이미지 최적화
- Vercel Blob은 자동 CDN 제공
- Next.js Image 컴포넌트 사용 권장

### 3. 캐싱 전략
```typescript
// API Route에서 캐싱 설정 (필요시)
export const revalidate = 3600; // 1시간 캐싱
```

---

## 📝 배포 체크리스트

배포 전 확인:
- [ ] 환경 변수 설정 완료
- [ ] Vercel Postgres 연결됨
- [ ] Vercel Blob 연결됨
- [ ] Prisma 마이그레이션 완료
- [ ] 로컬에서 정상 작동 확인
- [ ] `.gitignore`에 `.env.local` 포함
- [ ] OpenAI API 키 유효성 확인

배포 후 확인:
- [ ] 사이트 접속 확인
- [ ] 이미지 업로드 테스트
- [ ] AI 분석 작동 확인
- [ ] 데이터베이스 저장 확인
- [ ] 모바일 반응형 확인
- [ ] 성능 테스트 (3초 이내 로딩)

---

## 🎉 완료!

이제 서비스가 완전히 Vercel에서 실행됩니다!

**배포 URL**: `https://your-project.vercel.app`

### 다음 단계
1. 커스텀 도메인 연결 (선택)
2. Google Analytics 연동
3. Google AdSense 설정
4. SEO 최적화

---

## 📞 지원

- [Vercel 문서](https://vercel.com/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [Next.js 문서](https://nextjs.org/docs)

