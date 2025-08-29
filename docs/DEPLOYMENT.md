# 🚀 Moneed 배포 가이드

이 문서는 Moneed 프로젝트의 배포 과정을 단계별로 설명합니다.

## 📋 목차

- [배포 아키텍처](#배포-아키텍처)
- [사전 준비](#사전-준비)
- [로컬 개발 환경](#로컬-개발-환경)
- [Vercel 배포 (웹 앱)](#vercel-배포-웹-앱)
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

- [ ] GitHub 계정
- [ ] Vercel 계정
- [ ] AWS 계정 (EC2 인스턴스)
- [ ] 카카오 개발자 계정
- [ ] PostgreSQL 데이터베이스

### 2. 로컬 개발 환경

- [ ] Node.js 18 이상
- [ ] Yarn 패키지 매니저
- [ ] Docker (선택사항)
- [ ] Git

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
cp env-templates/web.env.template apps/web/.env.local
cp env-templates/kakao-proxy.env.template apps/kakao-proxy-server/.env.local

# 3. 환경변수 값 수정 (실제 값으로 변경)
# apps/web/.env.local
# apps/kakao-proxy-server/.env.local

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
    - **Output Directory**: `apps/web/dist`

### 2. 환경변수 설정

Vercel Dashboard > Project Settings > Environment Variables

```bash
# 필수 환경변수
NEXT_PUBLIC_MONEED_BASE_URL=https://your-domain.vercel.app
KAKAO_PROXY_SERVER_URL=https://your-ec2-domain.com
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=your-bucket
```

### 3. 도메인 설정 (선택사항)

1. Project Settings > Domains
2. 커스텀 도메인 추가
3. DNS 설정 완료

### 4. 자동 배포 확인

- `main` 브랜치에 푸시하면 자동 배포
- PR 생성 시 미리보기 배포

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
```

### 3. 배포 스크립트 설정

```bash
# 배포 스크립트를 EC2로 복사
scp scripts/deploy-ec2.sh ubuntu@your-ec2-ip:~/
chmod +x ~/deploy-ec2.sh

# GitHub Container Registry 액세스를 위한 토큰 설정
export GITHUB_TOKEN=your_github_token
export GITHUB_ACTOR=your_github_username
```

### 4. 수동 배포 테스트

```bash
# EC2에서 실행
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
3. **병렬 빌드** → 각 컴포넌트별 독립 빌드
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

**마지막 업데이트**: $(date +%Y-%m-%d)
**문서 버전**: 1.0.0
