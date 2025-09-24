# 💰 Moneed

> **주식 투자 커뮤니티 플랫폼** - 투자자들이 모여 정보를 공유하고 소통할 수 있는 스마트한 공간

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)

## 📋 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [API 문서](#api-문서)

## 🚀 프로젝트 소개

**Moneed**는 주식 투자자들을 위한 종합적인 커뮤니티 플랫폼입니다. 사용자들이 주식 정보를 공유하고, 투자 의견을 나누며, 실시간으로 시장 동향을 파악할 수 있도록 돕습니다.

### 🎯 핵심 가치

- **투명성**: 정확하고 신뢰할 수 있는 주식 정보 제공
- **커뮤니티**: 투자자들 간의 활발한 정보 공유와 소통
- **접근성**: 누구나 쉽게 사용할 수 있는 직관적인 인터페이스
- **실시간성**: 최신 시장 동향과 주식 데이터 제공

## ✨ 주요 기능

### 🏠 커뮤니티

- **Top 5**: 가장 인기 있는 종목 실시간 랭킹
- **지금 뜨는 종목**: 급상승 주식 추천
- **핫한 투표**: 커뮤니티 투표를 통한 시장 심리 파악
- **인기 급상승 게시글**: 가장 활발한 토론 게시물

### 📈 주식 정보

- **실시간 주가 데이터**: 한국투자증권 API 연동
- **종목별 커뮤니티**: 특정 주식에 대한 전용 토론 공간
- **회사 정보**: 상세한 기업 분석 및 재무 데이터
- **투표 시스템**: 종목에 대한 커뮤니티 의견 수집

### 💬 게시판

- **게시글 작성/수정/삭제**: 풍부한 텍스트 에디터 지원
- **댓글 시스템**: 실시간 댓글 및 대댓글 기능
- **좋아요/조회수**: 게시글 인기도 측정
- **이미지 업로드**: AWS S3 연동 파일 저장

### 👤 사용자 관리

- **카카오 OAuth 로그인**: 간편한 소셜 로그인
- **프로필 관리**: 닉네임, 프로필 이미지 설정
- **내 활동**: 내가 작성한 게시글/댓글 관리
- **회원 탈퇴**: 개인정보 보호를 위한 안전한 탈퇴

### 🎬 쇼츠 (Shorts)

- **동영상 콘텐츠**: YouTube API 연동 영상 추천
- **일일 업데이트**: 매일 새로운 투자 관련 영상 제공

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **UI Components**: Custom Component Library

### Backend

- **Web App**: Next.js API Routes
- **Proxy Server**: Express.js (카카오 OAuth 처리)
- **Language**: TypeScript
- **Authentication**: JWT with Jose
- **Session Management**: Custom JWT Implementation

### Database & ORM

- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Migrations**: Prisma Migrate

### External APIs

- **주식 데이터**: 한국투자증권 API
- **동영상 콘텐츠**: YouTube Data API v3
- **OAuth**: 카카오 로그인 API
- **파일 저장**: AWS S3

### DevOps & Deployment

- **Frontend**: Vercel
- **Backend**: AWS EC2
- **CI/CD**: GitHub Actions
- **Container**: Docker
- **Registry**: GitHub Container Registry
- **Monitoring**: Google Analytics, Microsoft Clarity

### Development Tools

- **Package Manager**: Yarn (Workspaces)
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky, lint-staged
- **Type Checking**: TypeScript

## 📁 프로젝트 구조

```
Moneed/
├── apps/                          # 애플리케이션들
│   ├── web/                       # Next.js 웹 애플리케이션
│   │   ├── app/                   # App Router 페이지
│   │   │   ├── api/               # API 라우트
│   │   │   ├── community/         # 커뮤니티 페이지
│   │   │   ├── posts/             # 게시글 페이지
│   │   │   ├── auth/              # 인증 페이지
│   │   │   └── ...
│   │   ├── src/                   # 소스 코드
│   │   │   ├── entities/          # 도메인 엔티티
│   │   │   ├── features/          # 기능별 모듈
│   │   │   ├── screens/           # 페이지 컴포넌트
│   │   │   ├── shared/            # 공유 컴포넌트/유틸
│   │   │   └── app/               # 앱 설정
│   │   └── prisma/                # 데이터베이스 스키마
│   └── kakao-proxy-server/        # 카카오 OAuth 프록시 서버
│       ├── src/
│       │   ├── api/               # 외부 API 호출
│       │   ├── middleware/        # Express 미들웨어
│       │   ├── routes/            # API 라우트
│       │   ├── service/           # 비즈니스 로직
│       │   ├── repository/        # 데이터 접근 계층
│       │   └── utils/             # 유틸리티 함수
│       └── prisma/                # 데이터베이스 스키마
├── packages/                      # 공유 패키지들
│   └── shared/
│       ├── auth/                  # 인증 관련 유틸
│       ├── utils/                 # 공통 유틸리티
│       └── utility-types/         # 타입 정의
├── docs/                          # 문서
│   ├── DEPLOYMENT.md              # 배포 가이드
│   └── monorepo_plan.md           # 모노레포 계획서
└── vercel.json                    # Vercel 설정
```

### 아키텍처 다이어그램

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   사용자 브라우저 │ ── │   Vercel (웹앱)  │ ── │  AWS EC2 (API)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              │                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │  GitHub Actions │    │  PostgreSQL DB  │
                       │     (CI/CD)     │    │   (Supabase)    │
                       └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │  External APIs  │
                       │ • 한국투자증권    │
                       │ • YouTube API   │
                       │ • 카카오 OAuth   │
                       │ • AWS S3        │
                       └─────────────────┘
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 20 이상
- Yarn 패키지 매니저
- PostgreSQL 데이터베이스 (Supabase 권장)
- 카카오 개발자 계정
- 한국투자증권 API 계정
- YouTube API 키
- AWS 계정 (S3, EC2)

### 설치 및 실행

1. **저장소 클론**

```bash
git clone https://github.com/your-username/moneed.git
cd moneed
```

2. **의존성 설치**

```bash
yarn install
```

3. **환경변수 설정**

```bash
# 웹 앱 환경변수
cp env-templates/web.env.template apps/web/.env

# 카카오 프록시 서버 환경변수
cp env-templates/kakao-proxy.env.template apps/kakao-proxy-server/.env
```

4. **공유 패키지 빌드**

```bash
yarn build:packages
```

5. **데이터베이스 설정**

```bash
# Prisma 클라이언트 생성
yarn db:generate

# 데이터베이스 마이그레이션
yarn db:migrate

# 시드 데이터 생성 (선택사항)
yarn db:seed
```

6. **개발 서버 실행**

```bash
# 전체 애플리케이션 실행
yarn dev

# 개별 실행
yarn dev:web        # 웹 앱만 (포트 3000)
yarn dev:kakao      # 프록시 서버만 (포트 8000)
```

### 개발 서버 접속

- **웹 애플리케이션**: http://localhost:3000
- **카카오 프록시 서버**: http://localhost:8000
- **헬스체크**: http://localhost:8000/health

## 📚 API 문서

### 웹 애플리케이션 API

- **게시글 API**: `/api/posts/*`
- **댓글 API**: `/api/comments/*`
- **사용자 API**: `/api/users/*`
- **주식 API**: `/api/stocks/*`
- **쇼츠 API**: `/api/shorts/*`

### 카카오 프록시 서버 API

- **카카오 OAuth**: `/api/auth/kakao/*`
- **헬스체크**: `/health`

### 개발 가이드라인

- [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다
- 코드 작성 전 ESLint 및 Prettier 설정을 확인하세요
- 새로운 기능 추가 시 테스트를 작성하세요
- 커밋 메시지는 한국어로 작성합니다

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 [Issues](https://github.com/your-username/moneed/issues)를 통해 제출해 주세요.

---

**Moneed**와 함께 스마트한 투자를 시작하세요! 🚀
