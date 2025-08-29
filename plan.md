# 모노레포 다중 환경 배포 전략 계획서

## 프로젝트 개요
- **웹 애플리케이션** (`@moneed/web`): Vercel 배포
- **카카오 프록시 서버** (`@moneed/kakao-proxy-server`): AWS EC2 배포
- **공유 패키지들**: `@moneed/db`, `@moneed/auth`, `@moneed/utils`, `@moneed/utility-types`

## 1. 배포 전략

### 1.1 Vercel 배포 (@moneed/web)

#### 설정 방법
```json
// vercel.json (프로젝트 루트)
{
  "buildCommand": "yarn build:web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "yarn install",
  "rootDirectory": "apps/web",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- apps/web/"
}
```

#### 환경변수 설정
- Vercel Dashboard에서 환경변수 설정
- 필요한 변수들:
  - `NEXT_PUBLIC_*`: 클라이언트 사이드 변수
  - `DATABASE_URL`: 데이터베이스 연결
  - `KAKAO_PROXY_SERVER_URL`: EC2 서버 엔드포인트

#### 빌드 최적화
- `next.config.ts`에서 모노레포 transpile 설정:
```typescript
const nextConfig = {
  transpilePackages: ['@moneed/db', '@moneed/auth', '@moneed/utils', '@moneed/utility-types'],
  experimental: {
    externalDir: true
  }
}
```

### 1.2 AWS EC2 배포 (@moneed/kakao-proxy-server)

#### 배포 방식 선택

**옵션 1: Docker 컨테이너 배포 (권장)**
```dockerfile
# Dockerfile (프로젝트 루트)
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
COPY packages/ ./packages/
COPY apps/kakao-proxy-server/ ./apps/kakao-proxy-server/

RUN yarn install --frozen-lockfile
RUN yarn build:kakao

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/kakao-proxy-server/dist ./dist
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 8000
CMD ["node", "dist/src/index.js"]
```

**옵션 2: 직접 배포**
```bash
# EC2에서 실행할 배포 스크립트
#!/bin/bash
git clone <repository>
cd moneed
yarn install
yarn build:kakao
pm2 start apps/kakao-proxy-server/dist/src/index.js --name kakao-proxy
```

## 2. CI/CD 파이프라인

### 2.1 GitHub Actions 워크플로우

```yaml
# .github/workflows/deploy.yml
name: Deploy Applications

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      web-changed: ${{ steps.changes.outputs.web }}
      kakao-changed: ${{ steps.changes.outputs.kakao }}
      packages-changed: ${{ steps.changes.outputs.packages }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            web:
              - 'apps/web/**'
            kakao:
              - 'apps/kakao-proxy-server/**'
            packages:
              - 'packages/**'

  deploy-web:
    needs: detect-changes
    if: needs.detect-changes.outputs.web-changed == 'true' || needs.detect-changes.outputs.packages-changed == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-kakao:
    needs: detect-changes
    if: needs.detect-changes.outputs.kakao-changed == 'true' || needs.detect-changes.outputs.packages-changed == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker Image
        run: |
          docker build -t kakao-proxy:${{ github.sha }} .
      - name: Deploy to EC2
        run: |
          # EC2 배포 스크립트 실행
```

## 3. 환경변수 관리

### 3.1 환경별 분리
```bash
# 웹 애플리케이션 (.env.local)
NEXT_PUBLIC_MONEED_BASE_URL=https://moneed.vercel.app
KAKAO_PROXY_SERVER_URL=https://api.moneed.com
DATABASE_URL=postgresql://...

# 카카오 프록시 서버 (.env.production)
PORT=8000
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
ALLOWED_ORIGINS=https://moneed.vercel.app
DATABASE_URL=postgresql://...
```

### 3.2 보안 관리
- AWS Systems Manager Parameter Store 활용
- Vercel Environment Variables 활용
- 민감한 정보는 절대 코드에 포함하지 않음

## 4. 주요 주의사항

### 4.1 공유 패키지 의존성
- **문제**: 모노레포의 공유 패키지들이 각 배포 환경에서 올바르게 해결되어야 함
- **해결책**: 
  - Vercel: `transpilePackages` 설정
  - EC2: 전체 워크스페이스 설치 후 빌드

### 4.2 빌드 순서 관리
```json
// package.json scripts 수정
{
  "scripts": {
    "build:packages": "npm run build --workspace=packages/database && npm run build --workspace=packages/shared/auth && npm run build --workspace=packages/shared/utils && npm run build --workspace=packages/shared/utility-types",
    "build:web": "npm run build:packages && npm run build --workspace=apps/web",
    "build:kakao": "npm run build:packages && npm run build --workspace=apps/kakao-proxy-server"
  }
}
```

### 4.3 네트워크 및 보안 설정
- **CORS 설정**: 카카오 프록시 서버에서 웹 앱 도메인 허용
- **SSL/TLS**: 두 환경 모두 HTTPS 사용
- **API 엔드포인트**: 환경별로 다른 URL 사용

### 4.4 데이터베이스 연결
- **문제**: 두 애플리케이션이 같은 데이터베이스를 사용해야 함
- **해결책**: 
  - 공통 DATABASE_URL 환경변수 사용
  - Connection pooling 고려
  - Migration 실행 순서 관리

### 4.5 모니터링 및 로깅
```typescript
// 각 환경별 로깅 설정
const logger = {
  vercel: console, // Vercel Functions 로그
  ec2: winston   // 구조화된 로깅
}
```

## 5. 배포 체크리스트

### 5.1 배포 전 확인사항
- [ ] 공유 패키지 빌드 성공
- [ ] 환경변수 모든 환경에 설정 완료
- [ ] 데이터베이스 마이그레이션 실행
- [ ] CORS 설정 확인
- [ ] SSL 인증서 설정

### 5.2 배포 후 확인사항
- [ ] 웹 애플리케이션 정상 로드
- [ ] 카카오 인증 플로우 정상 작동
- [ ] API 통신 정상
- [ ] 데이터베이스 연결 확인
- [ ] 에러 로그 모니터링

## 6. 롤백 전략

### 6.1 Vercel 롤백
- Vercel Dashboard에서 이전 배포로 즉시 롤백 가능
- Git 기반 자동 배포로 인한 빠른 복구

### 6.2 EC2 롤백
```bash
# Docker 기반 롤백
docker stop kakao-proxy
docker run -d --name kakao-proxy kakao-proxy:previous-tag

# PM2 기반 롤백
pm2 stop kakao-proxy
git checkout previous-commit
yarn build:kakao
pm2 restart kakao-proxy
```

## 7. 성능 최적화

### 7.1 빌드 최적화
- 불필요한 패키지 제외
- Tree shaking 활용
- 번들 크기 모니터링

### 7.2 런타임 최적화
- CDN 활용 (Vercel 자동 제공)
- 이미지 최적화
- API 응답 캐싱

이 계획을 단계별로 구현하면 안정적이고 효율적인 다중 환경 배포가 가능합니다.
