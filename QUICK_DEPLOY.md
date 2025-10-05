# ⚡ 5분 안에 Vercel 배포하기

완전 초보자도 따라할 수 있는 초간단 배포 가이드입니다.

---

## 📝 체크리스트

배포 전에 확인하세요:
- [ ] OpenAI API 키 준비됨
- [ ] GitHub 계정 있음
- [ ] Vercel 계정 생성 완료

---

## 🚀 5단계 배포

### 1️⃣ GitHub에 코드 올리기
```bash
git add .
git commit -m "준비 완료"
git push origin main
```

### 2️⃣ Vercel 연결하기
1. [vercel.com](https://vercel.com) 접속
2. **Add New** → **Project** 클릭
3. GitHub 저장소 선택 → **Import**

### 3️⃣ 환경 변수 입력
**Environment Variables** 섹션에:
```
OPENAI_API_KEY = sk-proj-당신의-키
```
입력 후 **Deploy** 클릭

> ⚠️ 첫 배포는 실패합니다. 정상입니다! 다음 단계로 진행하세요.

### 4️⃣ 데이터베이스 추가
#### Vercel Postgres
1. 프로젝트 → **Storage** 탭
2. **Create** → **Postgres** 선택
3. 데이터베이스 이름 입력
4. Region: **East US** 선택
5. **Create** 클릭

#### Vercel Blob
1. 같은 **Storage** 탭에서
2. **Create** → **Blob** 선택
3. **Create** 클릭

### 5️⃣ 재배포
1. **Deployments** 탭
2. 최신 배포 찾기
3. **...** 메뉴 → **Redeploy** 클릭

---

## ✅ 완료!

5분 후면 다음 주소에서 서비스가 실행됩니다:
```
https://your-project.vercel.app
```

---

## 🐛 문제가 생겼나요?

### 배포가 실패해요
→ **Deployments** 탭에서 로그 확인

### 이미지 업로드가 안 돼요
→ Vercel Blob이 제대로 추가되었는지 확인
→ **Storage** 탭에서 Blob 보이는지 체크

### AI 분석이 안 돼요
→ OpenAI API 키가 올바른지 확인
→ **Settings** → **Environment Variables**에서 재확인

### 모든 게 실패했어요
1. 프로젝트 삭제
2. 처음부터 다시 시작
3. 이번엔 천천히 한 단계씩!

---

## 💡 팁

### 로컬에서 먼저 테스트하고 싶어요
```bash
# 환경 변수 다운로드
vercel env pull .env.local

# 개발 서버 실행
npm run dev
```

### 커스텀 도메인을 연결하고 싶어요
1. 프로젝트 → **Settings** → **Domains**
2. 도메인 입력 후 DNS 설정

### 비용이 걱정돼요
무료 플랜으로 충분합니다:
- Postgres: 256MB (약 10,000건 분석 결과)
- Blob: 1GB (이미지는 24시간 후 자동 삭제)
- Functions: 월 1,000만 호출

---

## 🎉 다음 단계

배포 성공했다면:
1. ✅ Google Analytics 연동
2. ✅ 커스텀 도메인 설정
3. ✅ SEO 최적화
4. ✅ Google AdSense 추가

---

**더 자세한 내용은 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) 참고**

