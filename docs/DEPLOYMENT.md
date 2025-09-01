# 🚀 Moneed 배포 가이드

이 문서는 Moneed 프로젝트의 배포 과정을 단계별로 설명합니다.

## 📋 목차

- [배포 아키텍처](#배포-아키텍처)
- [사전 준비](#사전-준비)
- [로컬 개발 환경](#로컬-개발-환경)
- [Vercel 배포 (웹 앱)](#vercel-배포-웹-앱)
- [Docker 이미지 빌드 및 GitHub Container Registry 푸시](#docker-이미지-빌드-및-github-container-registry-푸시)
- [AWS EC2 배포 (프록시 서버)](#aws-ec2-배포-프록시-서버)
- [CI/CD 파이프라인](#cicd-파이프라인)
- [트러블슈팅](#트러블슈팅)

## 🏗 배포 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   사용자 브라우저 │ ── │   Vercel (웹앱)  │ ── │  AWS EC2 (API)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              │                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │  GitHub Actions │    │  PostgreSQL DB  │
                       │     (CI/CD)     │    │   (Database)    │
                       └─────────────────┘    └─────────────────┘
```

### 컴포넌트 역할

- **Vercel**: Next.js 웹 애플리케이션 호스팅
- **AWS EC2**: Express.js 카카오 프록시 서버 호스팅
- **GitHub Actions**: 자동화된 CI/CD 파이프라인
- **PostgreSQL**: 애플리케이션 데이터베이스

## 🔧 사전 준비

### 1. 필수 계정 및 서비스

- [x] GitHub 계정
- [x] Vercel 계정
- [x] AWS 계정 (EC2 인스턴스)
- [x] 카카오 개발자 계정
- [x] PostgreSQL 데이터베이스

### 2. 로컬 개발 환경

- [x] Node.js 20 이상
- [x] Yarn 패키지 매니저
- [x] Docker (선택사항)
- [x] Git

### 3. 환경변수 준비

각 환경별 환경변수를 준비해주세요:

- `env-templates/` 디렉토리의 템플릿 파일들 참고
- 실제 API 키와 시크릿으로 값 변경

## 💻 로컬 개발 환경

### 자동 설정 (권장)

```bash
# 개발 환경 자동 설정 스크립트 실행
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

### 수동 설정

```bash
# 1. 의존성 설치
yarn install

# 2. 환경변수 파일 복사
cp env-templates/web.env.template apps/web/.env
cp env-templates/kakao-proxy.env.template apps/kakao-proxy-server/.env

# 3. 환경변수 값 수정 (실제 값으로 변경)
# apps/web/.env
# apps/kakao-proxy-server/.env

# 4. 공유 패키지 빌드
yarn build:packages

# 5. 개발 서버 실행
yarn dev
```

### 개발 서버 접속

- **웹 앱**: http://localhost:3000
- **프록시 서버**: http://localhost:8000
- **헬스체크**: http://localhost:8000/health

## ☁️ Vercel 배포 (웹 앱)

### 1. Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 설정:
    - **Framework Preset**: Next.js
    - **Root Directory**: `./` (루트)
    - **Build Command**: `yarn build:web`
    - **Output Directory**: `apps/web/.next`

### 2. 환경변수 설정

Vercel Dashboard > Project Settings > Environment Variables

```bash
# 필수 환경변수
NEXT_PUBLIC_MONEED_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_KAKAO_PROXY_SERVER=https://your-ec2-domain.com

# 데이터베이스 (Supabase)
DATABASE_URL=postgresql://postgres.your_db_user:your_db_password@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.your_db_user:your_db_password@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres

# 한국투자증권 API
KIS_BASE_URL=https://openapi.koreainvestment.com:9443
KIS_WEBSOCKET_URL=ws://ops.koreainvestment.com:21000
KIS_APP_KEY=your_kis_app_key
KIS_APP_SECRET=your_kis_app_secret

# YouTube API
YOUTUBE_BASE_URL=https://www.googleapis.com/youtube
YOUTUBE_API_KEY=your_youtube_api_key

# JWT 설정
SESSION_SECRET=your_session_secret
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=30d
JWT_ACCESS_NAME=access_token
JWT_REFRESH_NAME=refresh_token

# AWS S3 설정
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
AWS_BUCKET_URL=your_bucket_url
MONEED_AWS_ACCESS_KEY=your_aws_access_key
MONEED_AWS_SECRET_KEY=your_aws_secret_key

# Vercel Cron Jobs
CRON_SECRET=your_cron_secret
```

### 3. Prisma 클라이언트 생성

웹 앱은 독립적인 Prisma 설정을 사용합니다. 빌드 시 Prisma 클라이언트가 자동으로 생성됩니다.

```bash
# 수동으로 Prisma 클라이언트 생성이 필요한 경우
yarn db:generate
```

### 3. 도메인 설정 (선택사항)

1. Project Settings > Domains
2. 커스텀 도메인 추가
3. DNS 설정 완료

### 4. 자동 배포 확인

- `main` 브랜치에 푸시하면 자동 배포
- PR 생성 시 미리보기 배포

## 🐳 Docker 이미지 빌드 및 GitHub Container Registry 푸시

### 1. GitHub Container Registry 설정

GitHub Container Registry(GHCR)는 GitHub에서 제공하는 컨테이너 이미지 레지스트리입니다.

#### Personal Access Token 생성

1. GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. "Generate new token (classic)" 클릭
3. 권한 설정:
    - `write:packages` - 패키지 업로드
    - `read:packages` - 패키지 다운로드
    - `delete:packages` - 패키지 삭제 (선택사항)

### 2. 빌드 스크립트 실행

- Docker 이미지 빌드
- GitHub Container Registry 로그인
- 이미지 푸시

```bash
# 실행 권한 부여
chmod +x scripts/build-docker.sh

# 환경변수 설정
export GITHUB_TOKEN=your_personal_access_token
export GITHUB_ACTOR=your_username_or_organization_name

# 스크립트 실행
./scripts/build-docker.sh
```

### 4. 이미지 확인 및 관리

#### 로컬 이미지 확인

```bash
# 빌드된 이미지 목록 확인
docker images ghcr.io/[GITHUB_ACTOR]/moneed/kakao-proxy

# 이미지 상세 정보 확인
docker inspect ghcr.io/[GITHUB_ACTOR]/moneed/kakao-proxy:latest

# 이미지 레이어 확인
docker history ghcr.io/[GITHUB_ACTOR]/moneed/kakao-proxy:latest
```

#### GitHub Container Registry에서 확인

1. GitHub 프로필 > Packages 탭
2. `moneed/kakao-proxy` 패키지 선택
3. 버전 및 다운로드 통계 확인

#### 이미지 정리

```bash
# 사용하지 않는 이미지 제거
docker image prune -f

# 특정 이미지 제거
docker rmi ghcr.io/[GITHUB_ACTOR]/moneed/kakao-proxy:old-version

# 빌드 캐시 정리
docker builder prune -f
```

### 5. CI/CD에서의 자동 빌드

현재 프로젝트는 GitHub Actions를 통해 자동으로 Docker 이미지를 빌드하고 푸시합니다:

#### 자동 빌드 트리거

- `main` 브랜치에 푸시 시
- `apps/kakao-proxy-server/` 디렉토리 변경 시
- `Dockerfile` 또는 `.dockerignore` 변경 시
- `packages/` 디렉토리 변경 시

#### 생성되는 이미지 태그

```bash
# 브랜치명 기반
ghcr.io/[GITHUB_ACTOR]/moneed/kakao-proxy:main
ghcr.io/[GITHUB_ACTOR]/moneed/kakao-proxy:develop

# 커밋 SHA 기반
ghcr.io/[GITHUB_ACTOR]/moneed/kakao-proxy:main-abc1234

# 최신 버전 (main 브랜치)
ghcr.io/[GITHUB_ACTOR]/moneed/kakao-proxy:latest
```

## 🖥 AWS EC2 배포 (프록시 서버)

### 1. EC2 인스턴스 설정

#### 인스턴스 생성

```bash
# 권장 사양
- Instance Type: t3.small 이상
- OS: Ubuntu 22.04 LTS
- Storage: 20GB 이상
- Security Group: 포트 22 (SSH), 8000 (HTTP) 열기
```

#### 기본 소프트웨어 설치

```bash
# EC2 인스턴스에 SSH 접속 후 실행
sudo apt update && sudo apt upgrade -y

# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# 재로그인 후 Docker 확인
docker --version
```

### 2. 환경변수 설정

```bash
# EC2에서 실행
sudo nano /home/ubuntu/.env.production

# env-templates/production.env.template 내용을 복사하고
# 실제 프로덕션 값으로 수정

# 주요 환경변수:
# - KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET: 카카오 OAuth 설정
# - SESSION_SECRET: JWT 세션 시크릿
# - DATABASE_URL, DIRECT_URL: Supabase 데이터베이스 연결
# - ALLOWED_ORIGINS: CORS 허용 도메인 (프로덕션 웹앱 URL)
# - RATE_LIMIT_*: API 요청 제한 설정
```

### 3. 배포 스크립트 설정

배포 관련 스크립트·환경변수파일·Nginx 설정을 EC2로 복사.

```bash
# 실행 권한 부여 (최초 1회)
chmod +x scripts/sync-ec2.sh

# 변경 파일들을 한 번에 EC2 로 복사
./scripts/sync-ec2.sh
```

> 내부적으로 다음 파일/디렉터리를 복사합니다.
>
> - scripts/generate-ssl-cert.sh
> - scripts/deploy-ec2.sh
> - docker-compose.yml
> - nginx/ (설정 + SSL)
> - apps/kakao-proxy-server/.env.production

복사 완료 후 EC2 에 SSH 접속하여 `~/deploy-ec2.sh deploy` 로 배포를 진행하면 됩니다.

### 4. 배포

```bash
# EC2에서 실행
chmod +x ~/deploy-ec2.sh

# GitHub Container Registry 액세스를 위한 토큰 설정
export GITHUB_TOKEN=your_github_token
export GITHUB_ACTOR=your_github_usernam

./deploy-ec2.sh deploy
```

## 🔄 CI/CD 파이프라인

### 1. GitHub Secrets 설정

Repository Settings > Secrets and variables > Actions

```bash
# Vercel 관련
VERCEL_TOKEN=vercel_token_...
VERCEL_ORG_ID=team_...
VERCEL_PROJECT_ID=prj_...

# EC2 관련
EC2_HOST=your-ec2-ip-or-domain
EC2_USER=ubuntu
EC2_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----\n...
EC2_SSH_PORT=22
```

### 2. 워크플로우 동작

#### 개발 브랜치 (ci.yml)

```bash
# 트리거: develop, feature/*, fix/* 브랜치 푸시
git push origin develop
```

- 빌드 테스트 (Node.js 18, 20)
- 린팅 및 타입 체크
- 단위 테스트 실행
- Docker 빌드 테스트
- PR 미리보기 배포 (Vercel)

#### 메인 브랜치 (deploy.yml)

```bash
# 트리거: main 브랜치 푸시
git push origin main
```

- 변경사항 감지
- 빌드 및 테스트
- Vercel 프로덕션 배포
- Docker 이미지 빌드 및 푸시
- EC2 자동 배포
- 배포 상태 알림

### 3. 배포 프로세스

1. **코드 푸시** → GitHub
2. **변경사항 감지** → 웹앱/프록시서버/공유패키지
3. **병렬 빌드** → 각 컴포넌트별 독립 빌드 (각 앱에서 Prisma 클라이언트 자동 생성)
4. **자동 배포** → Vercel (웹앱) + EC2 (프록시서버)
5. **헬스체크** → 배포 성공 확인
6. **알림** → 배포 결과 리포트

## 🔍 모니터링 및 로그

### Vercel 모니터링

- Vercel Dashboard > Analytics
- 실시간 로그: `vercel logs`
- 성능 메트릭 확인

### EC2 모니터링

```bash
# 컨테이너 상태 확인
docker ps
./deploy-ec2.sh status

# 실시간 로그 확인
docker logs -f kakao-proxy
./deploy-ec2.sh logs

# 시스템 리소스 확인
htop
df -h
free -h
```

### 로그 파일 위치

- **배포 로그**: `/var/log/moneed-deploy.log`
- **애플리케이션 로그**: Docker 컨테이너 로그
- **시스템 로그**: `/var/log/syslog`

## 🚨 트러블슈팅

### 일반적인 문제들

#### 1. Vercel 배포 실패

```bash
# 원인: 빌드 에러
# 해결: 로컬에서 빌드 테스트
yarn build:web

# 원인: 환경변수 누락
# 해결: Vercel Dashboard에서 환경변수 확인
```

#### 2. EC2 배포 실패

```bash
# 원인: Docker 이미지 풀 실패
# 해결: GitHub 토큰 및 권한 확인
docker login ghcr.io -u username -p token

# 원인: 포트 충돌
# 해결: 기존 프로세스 확인 및 중지
sudo netstat -tlnp | grep :8000
```

#### 3. 데이터베이스 연결 오류

```bash
# 원인: 연결 문자열 오류
# 해결: DATABASE_URL 형식 확인
postgresql://user:password@host:port/database

# 원인: 네트워크 접근 제한
# 해결: 보안 그룹 및 방화벽 설정 확인
```

#### 4. CORS 오류

```bash
# 원인: 허용 도메인 설정 오류
# 해결: ALLOWED_ORIGINS 환경변수 확인
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

#### 5. Docker 이미지 빌드 실패

```bash
# 원인: 의존성 설치 실패
# 해결: 로컬에서 빌드 테스트
docker build -t test-image .

# 원인: Dockerfile 문법 오류
# 해결: Dockerfile 검증
docker build --dry-run .

# 원인: 빌드 컨텍스트 크기 초과
# 해결: .dockerignore 파일 확인
echo "node_modules" >> .dockerignore
echo "dist" >> .dockerignore
```

#### 6. GitHub Container Registry 푸시 실패

```bash
# 원인: 인증 실패
# 해결: Personal Access Token 재생성 및 권한 확인
docker login ghcr.io -u username

# 원인: 패키지 권한 부족
# 해결: GitHub 저장소 설정에서 패키지 권한 확인
# Settings > Actions > General > Workflow permissions

# 원인: 이미지 태그 형식 오류
# 해결: 올바른 태그 형식 사용
ghcr.io/[username]/[repository]/[image-name]:tag
```

#### 7. Docker 컨테이너 실행 실패

```bash
# 원인: 포트 충돌
# 해결: 사용 중인 포트 확인 및 변경
netstat -tlnp | grep :8000
docker run -p 8001:8000 image-name

# 원인: 환경변수 파일 누락
# 해결: 환경변수 파일 경로 확인
ls -la /home/ubuntu/.env.production

# 원인: 메모리 부족
# 해결: 시스템 리소스 확인
free -h
docker system df
```

#### 8. 이미지 크기 최적화

```bash
# 원인: 이미지 크기가 너무 큼
# 해결: 멀티스테이지 빌드 활용 (이미 적용됨)

# 빌드 캐시 활용
docker build --cache-from ghcr.io/username/moneed/kakao-proxy:latest .

# 불필요한 파일 제거
# .dockerignore에 추가:
echo "*.md" >> .dockerignore
echo "docs/" >> .dockerignore
echo ".git/" >> .dockerignore
```

### 긴급 복구 절차

#### 1. 웹 앱 롤백

```bash
# Vercel Dashboard에서 이전 배포로 롤백
# 또는 GitHub에서 이전 커밋으로 revert 후 푸시
```

#### 2. 프록시 서버 롤백

```bash
# EC2에서 실행
./deploy-ec2.sh rollback

# 수동 롤백
docker stop kakao-proxy
docker run -d --name kakao-proxy ... previous-image:tag
```

### 성능 최적화

#### 1. 웹 앱 최적화

- Next.js 이미지 최적화 활용
- 번들 크기 모니터링
- CDN 캐싱 설정

#### 2. 프록시 서버 최적화

- Docker 이미지 크기 최소화
- 메모리 및 CPU 사용량 모니터링
- 로그 로테이션 설정

## 📞 지원 및 문의

배포 관련 문제가 발생하면:

1. 이 가이드의 트러블슈팅 섹션 확인
2. 로그 파일 확인
3. 팀 내 DevOps 담당자에게 문의

---

**마지막 업데이트**: 2024-01-15
**문서 버전**: 1.1.0
