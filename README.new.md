<div align="center">
  <img width="250" alt="스크린샷 2025-03-22 오후 11 39 54" src="https://github.com/user-attachments/assets/21f4a44a-d8a2-4198-b715-724f8f064478" />
  <h1>MONEED</h1>
  <p>MZ세대를 위한 주식투자 커뮤니티 플랫폼</p>
  
  <br />
</div>

## 📋 목차

1. **[빠른 시작](#-빠른-시작)**
2. **[프로젝트 구조](#-프로젝트-구조)**
3. **[기술 스택](#-기술-스택)**
4. **[배포 아키텍처](#-배포-아키텍처)**
5. **[개발 가이드](#-개발-가이드)**
6. **[배포 가이드](#-배포-가이드)**
7. **[주요 기능](#-주요-기능)**

## 🚀 빠른 시작

### 자동 설정 (권장)

```bash
# 저장소 클론
git clone https://github.com/your-username/moneed.git
cd moneed

# 개발 환경 자동 설정
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# 개발 서버 실행
yarn dev
```

### 수동 설정

```bash
# 의존성 설치
yarn install

# 환경변수 설정
cp env-templates/web.env.template apps/web/.env.local
cp env-templates/kakao-proxy.env.template apps/kakao-proxy-server/.env.local

# 공유 패키지 빌드
yarn build:packages

# 개발 서버 실행
yarn dev
```

### 접속 주소

- **웹 앱**: http://localhost:3000
- **프록시 서버**: http://localhost:8000
- **헬스체크**: http://localhost:8000/health

## 🏗 프로젝트 구조

```
Moneed/
├── apps/
│   ├── web/                    # Next.js 웹 애플리케이션 (Vercel 배포)
│   └── kakao-proxy-server/     # Express 프록시 서버 (AWS EC2 배포)
├── packages/
│   ├── database/               # Prisma 스키마 및 클라이언트
│   └── shared/
│       ├── auth/               # 인증 관련 공유 로직
│       ├── utils/              # 공통 유틸리티 함수
│       └── utility-types/      # 공유 TypeScript 타입
├── env-templates/              # 환경변수 템플릿
├── scripts/                    # 배포 및 설정 스크립트
├── docs/                       # 프로젝트 문서
├── .github/workflows/          # GitHub Actions CI/CD
├── Dockerfile                  # Docker 컨테이너 설정
└── vercel.json                 # Vercel 배포 설정
```

## 🛠 기술 스택

### Frontend (Next.js)

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Authentication**: JWT + 카카오 OAuth

### Backend (Express.js)

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + 카카오 OAuth
- **Security**: Helmet, CORS, Rate Limiting

### DevOps & Infrastructure

- **Package Manager**: Yarn Workspaces
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel
- **Backend Hosting**: AWS EC2
- **Database**: PostgreSQL
- **Image Storage**: AWS S3

## 🏛 배포 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   사용자 브라우저   │ ── │   Vercel (웹앱)   │ ── │  AWS EC2 (API)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              │                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │  GitHub Actions │    │  PostgreSQL DB  │
                       │     (CI/CD)     │    │   (Database)    │
                       └─────────────────┘    └─────────────────┘
```

### 배포 플로우

1. **개발**: `develop` 브랜치에 푸시 → CI 테스트 실행
2. **스테이징**: PR 생성 → 미리보기 배포 (Vercel)
3. **프로덕션**: `main` 브랜치 병합 → 자동 배포 (Vercel + EC2)

## 💻 개발 가이드

### 사용 가능한 스크립트

```bash
# 개발 서버
yarn dev              # 전체 개발 서버 (웹앱 + 프록시서버)
yarn dev:web          # 웹 앱만 실행
yarn dev:kakao        # 프록시 서버만 실행

# 빌드
yarn build            # 전체 빌드 (패키지 → 앱)
yarn build:packages   # 공유 패키지만 빌드
yarn build:web        # 웹 앱 빌드
yarn build:kakao      # 프록시 서버 빌드

# 테스트 및 검증
yarn lint             # ESLint 실행
yarn type-check       # TypeScript 타입 체크
yarn test             # 테스트 실행 (auth 패키지)

# 정리
yarn clean            # 빌드 결과물 정리
```

### 개발 환경 요구사항

- **Node.js**: 20 이상
- **Package Manager**: Yarn
- **Database**: PostgreSQL (Docker 권장)
- **IDE**: VS Code (권장)

### 코딩 규칙

- **언어**: TypeScript 사용 필수
- **코드 스타일**: ESLint + Prettier
- **커밋 메시지**: Conventional Commits
- **브랜치 전략**: Git Flow

## 🚀 배포 가이드

### 환경변수 설정

각 환경별로 필요한 환경변수를 설정해주세요:

```bash
# 로컬 개발
apps/web/.env.local
apps/kakao-proxy-server/.env.local

# Vercel (웹앱)
Vercel Dashboard → Environment Variables

# EC2 (프록시서버)
/home/ubuntu/.env.production

# GitHub Actions (CI/CD)
Repository Settings → Secrets
```

자세한 설정 방법은 [`env-templates/README.md`](env-templates/README.md)를 참고하세요.

### 자동 배포 설정

#### 1. GitHub Secrets 설정

```bash
# Vercel
VERCEL_TOKEN=your_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# AWS EC2
EC2_HOST=your_ec2_ip
EC2_USER=ubuntu
EC2_SSH_KEY=your_private_key
```

#### 2. 배포 실행

```bash
# 개발 환경 배포
git push origin develop

# 프로덕션 배포
git push origin main
```

상세한 배포 가이드는 [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)를 참고하세요.

## 💡 주요 기능

### 🏠 홈

- 인기 게시글 및 핫한 주식 종목 표시
- 실시간 주식 정보 연동
- 개인화된 추천 콘텐츠

### 👥 커뮤니티

- 주식별 게시판 (종목별 토론)
- 게시글 작성/수정/삭제
- 댓글 및 대댓글 시스템
- 좋아요 및 북마크 기능

### 🔐 인증

- 카카오 소셜 로그인
- JWT 기반 인증
- 자동 로그인 및 토큰 갱신

### 👤 마이페이지

- 프로필 관리
- 내가 작성한 글/댓글 관리
- 북마크한 게시글 조회
- 관심 종목 관리

### 📱 반응형 디자인

- 모바일 최적화 UI
- 다크모드 지원
- Progressive Web App (PWA)

## 🎨 주요 페이지

|                                                         홈                                                         |                                                         커뮤니티                                                         |
| :----------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------: |
| <img width="300" alt="홈" src="https://github.com/user-attachments/assets/3a4f0461-6201-4397-803c-a8665ea49fd2" /> | <img width="300" alt="커뮤니티" src="https://github.com/user-attachments/assets/2d9ec56a-8612-41c4-a9b0-6ff5b5285952" /> |

|                                                         마이페이지                                                         |                                                         게시글 작성                                                         |
| :------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: |
| <img width="300" alt="마이페이지" src="https://github.com/user-attachments/assets/b921e323-fb53-49f4-9c26-f6d6d08fc928" /> | <img width="300" alt="게시글 작성" src="https://github.com/user-attachments/assets/1919e45f-61b9-4ba2-8998-78c6c47c6303" /> |

## 📈 배포 주소

- **프로덕션**: https://moneed.vercel.app
- **개발**: https://moneed-git-develop.vercel.app
- **API 서버**: https://api.moneed.com

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참고하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면:

- **Issues**: GitHub Issues 탭 활용
- **Email**: your-email@example.com
- **Discord**: 팀 Discord 채널

---

<div align="center">
  <p>Made with ❤️ by Moneed Team</p>
</div>
