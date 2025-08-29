# 환경변수 설정 가이드

이 디렉토리는 Moneed 프로젝트의 각 환경별 환경변수 템플릿을 포함합니다.

## 📁 파일 구조

```
env-templates/
├── web.env.template              # 웹 앱용 환경변수
├── kakao-proxy.env.template      # 카카오 프록시 서버용 환경변수
├── production.env.template       # 프로덕션 환경변수
├── vercel.env.template          # Vercel 배포용 환경변수
├── github-secrets.template      # GitHub Actions Secrets
└── README.md                    # 이 파일
```

## 🚀 빠른 시작

### 1. 로컬 개발 환경 설정

```bash
# 웹 앱 환경변수 복사
cp env-templates/web.env.template apps/web/.env.local

# 카카오 프록시 서버 환경변수 복사
cp env-templates/kakao-proxy.env.template apps/kakao-proxy-server/.env.local
```

### 2. 환경변수 값 설정

각 `.env.local` 파일을 열어서 실제 값으로 변경하세요:

- 데이터베이스 연결 정보
- 카카오 OAuth 설정
- AWS S3 설정 (이미지 업로드용)
- JWT 시크릿 키

## 🌍 환경별 설정

### 개발 환경 (Local)

- **웹 앱**: `apps/web/.env.local`
- **프록시 서버**: `apps/kakao-proxy-server/.env.local`
- **데이터베이스**: 로컬 PostgreSQL

### 프로덕션 환경

#### Vercel (웹 앱)

1. Vercel Dashboard → Project Settings → Environment Variables
2. `vercel.env.template`의 변수들을 추가
3. 환경별로 다른 값 설정 (Development/Preview/Production)

#### AWS EC2 (카카오 프록시 서버)

1. EC2 인스턴스에 SSH 접속
2. `/home/ubuntu/.env.production` 파일 생성
3. `production.env.template`의 내용 복사 후 실제 값으로 변경

```bash
# EC2에서 실행
sudo nano /home/ubuntu/.env.production
```

#### GitHub Actions (CI/CD)

1. GitHub Repository → Settings → Secrets and variables → Actions
2. `github-secrets.template`의 시크릿들을 추가

## 🔐 보안 가이드라인

### 필수 보안 사항

- ✅ `.env.local` 파일은 절대 Git에 커밋하지 않기
- ✅ 프로덕션과 개발 환경의 키를 분리하기
- ✅ JWT 시크릿은 최소 32자 이상의 강력한 키 사용
- ✅ 정기적으로 API 키와 시크릿 로테이션

### 권장 사항

- 🔒 AWS IAM 사용자는 최소 권한만 부여
- 🔒 데이터베이스는 SSL/TLS 연결 사용
- 🔒 Rate Limiting 설정으로 API 남용 방지
- 🔒 CORS 설정으로 허용 도메인 제한

## 📋 환경변수 체크리스트

### 웹 앱 (.env.local)

- [ ] `NEXT_PUBLIC_MONEED_BASE_URL` - 웹 앱 기본 URL
- [ ] `KAKAO_PROXY_SERVER_URL` - 프록시 서버 URL
- [ ] `DATABASE_URL` - 데이터베이스 연결 문자열
- [ ] `AWS_ACCESS_KEY_ID` - AWS 액세스 키
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS 시크릿 키
- [ ] `AWS_BUCKET_NAME` - S3 버킷 이름

### 카카오 프록시 서버 (.env.local)

- [ ] `PORT` - 서버 포트 (기본: 8000)
- [ ] `DATABASE_URL` - 데이터베이스 연결 문자열
- [ ] `KAKAO_CLIENT_ID` - 카카오 클라이언트 ID
- [ ] `KAKAO_CLIENT_SECRET` - 카카오 클라이언트 시크릿
- [ ] `KAKAO_REDIRECT_URI` - 카카오 리다이렉트 URI
- [ ] `JWT_SECRET` - JWT 서명용 시크릿 키
- [ ] `ALLOWED_ORIGINS` - CORS 허용 도메인

### GitHub Secrets

- [ ] `VERCEL_TOKEN` - Vercel 배포 토큰
- [ ] `VERCEL_ORG_ID` - Vercel 조직 ID
- [ ] `VERCEL_PROJECT_ID` - Vercel 프로젝트 ID
- [ ] `EC2_HOST` - EC2 인스턴스 호스트
- [ ] `EC2_USER` - EC2 SSH 사용자
- [ ] `EC2_SSH_KEY` - EC2 SSH 프라이빗 키

## 🔧 트러블슈팅

### 자주 발생하는 문제들

1. **CORS 오류**
    - `ALLOWED_ORIGINS`에 웹 앱 도메인이 포함되어 있는지 확인
    - 프로토콜(http/https)과 포트 번호 정확히 입력

2. **데이터베이스 연결 실패**
    - `DATABASE_URL` 형식 확인: `postgresql://user:password@host:port/database`
    - 네트워크 접근 권한 및 방화벽 설정 확인

3. **카카오 OAuth 오류**
    - 카카오 개발자 콘솔에서 리다이렉트 URI 설정 확인
    - 클라이언트 ID/Secret 정확성 확인

4. **JWT 토큰 오류**
    - `JWT_SECRET` 길이가 충분한지 확인 (최소 32자)
    - 프로덕션과 개발 환경의 시크릿이 다른지 확인

## 📞 지원

환경변수 설정 관련 문제가 있으시면:

1. 이 가이드를 먼저 확인
2. 트러블슈팅 섹션 참고
3. 팀 내 개발자에게 문의
