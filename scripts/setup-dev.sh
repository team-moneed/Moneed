#!/bin/bash

# ==============================================
# Moneed 로컬 개발 환경 셋업 스크립트
# ==============================================

set -e

echo "🚀 Moneed 로컬 개발 환경을 설정합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Node.js 버전 확인
check_node_version() {
    print_step "Node.js 버전을 확인합니다..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js가 설치되어 있지 않습니다. Node.js 18 이상을 설치해주세요."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 18 이상이 필요합니다. 현재 버전: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js 버전: $(node -v)"
}

# Yarn 설치 확인
check_yarn() {
    print_step "Yarn 패키지 매니저를 확인합니다..."
    
    if ! command -v yarn &> /dev/null; then
        print_warning "Yarn이 설치되어 있지 않습니다. 설치합니다..."
        npm install -g yarn
    fi
    
    print_success "Yarn 버전: $(yarn -v)"
}

# 의존성 설치
install_dependencies() {
    print_step "의존성을 설치합니다..."
    yarn install --frozen-lockfile
    print_success "의존성 설치 완료"
}

# 환경변수 파일 설정
setup_env_files() {
    print_step "환경변수 파일을 설정합니다..."
    
    # 웹 앱 환경변수
    if [ ! -f "apps/web/.env.local" ]; then
        cp env-templates/web.env.template apps/web/.env.local
        print_success "웹 앱 환경변수 파일 생성: apps/web/.env.local"
        print_warning "apps/web/.env.local 파일을 열어서 실제 값으로 수정해주세요."
    else
        print_warning "apps/web/.env.local 파일이 이미 존재합니다."
    fi
    
    # 카카오 프록시 서버 환경변수
    if [ ! -f "apps/kakao-proxy-server/.env.local" ]; then
        cp env-templates/kakao-proxy.env.template apps/kakao-proxy-server/.env.local
        print_success "카카오 프록시 서버 환경변수 파일 생성: apps/kakao-proxy-server/.env.local"
        print_warning "apps/kakao-proxy-server/.env.local 파일을 열어서 실제 값으로 수정해주세요."
    else
        print_warning "apps/kakao-proxy-server/.env.local 파일이 이미 존재합니다."
    fi
}

# 데이터베이스 설정
setup_database() {
    print_step "데이터베이스를 설정합니다..."
    
    if command -v docker &> /dev/null; then
        print_step "Docker를 사용하여 PostgreSQL을 실행합니다..."
        
        # PostgreSQL 컨테이너 실행
        docker run -d \
            --name moneed-postgres \
            -e POSTGRES_DB=moneed_dev \
            -e POSTGRES_USER=moneed \
            -e POSTGRES_PASSWORD=moneed123 \
            -p 5432:5432 \
            --restart unless-stopped \
            postgres:15-alpine || print_warning "PostgreSQL 컨테이너가 이미 실행 중이거나 오류가 발생했습니다."
        
        print_success "PostgreSQL 컨테이너 실행 (포트: 5432)"
        print_warning "데이터베이스 연결 문자열: postgresql://moneed:moneed123@localhost:5432/moneed_dev"
    else
        print_warning "Docker가 설치되어 있지 않습니다. 수동으로 PostgreSQL을 설치하고 설정해주세요."
    fi
}

# 빌드 테스트
test_build() {
    print_step "빌드 테스트를 실행합니다..."
    
    # 공유 패키지 빌드
    yarn build:packages
    print_success "공유 패키지 빌드 완료"
    
    # 타입 체크
    yarn type-check
    print_success "타입 체크 완료"
    
    # 린팅
    yarn lint
    print_success "린팅 완료"
}

# 개발 서버 실행 가이드
show_dev_guide() {
    print_step "개발 서버 실행 가이드"
    echo ""
    echo -e "${GREEN}🎉 개발 환경 설정이 완료되었습니다!${NC}"
    echo ""
    echo "다음 명령어로 개발 서버를 실행할 수 있습니다:"
    echo ""
    echo -e "${YELLOW}# 전체 개발 서버 실행 (웹 앱 + 카카오 프록시 서버)${NC}"
    echo "yarn dev"
    echo ""
    echo -e "${YELLOW}# 웹 앱만 실행${NC}"
    echo "yarn dev:web"
    echo ""
    echo -e "${YELLOW}# 카카오 프록시 서버만 실행${NC}"
    echo "yarn dev:kakao"
    echo ""
    echo -e "${YELLOW}# 빌드 테스트${NC}"
    echo "yarn build"
    echo ""
    echo "📝 추가 설정 사항:"
    echo "1. 환경변수 파일들을 실제 값으로 수정"
    echo "2. 카카오 개발자 콘솔에서 OAuth 앱 설정"
    echo "3. AWS S3 버킷 설정 (이미지 업로드용)"
    echo ""
    echo "📖 자세한 내용은 env-templates/README.md를 참고하세요."
}

# 메인 실행
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════╗"
    echo "║         Moneed Dev Setup             ║"
    echo "║    모노레포 개발 환경 자동 설정        ║"
    echo "╚══════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_node_version
    check_yarn
    install_dependencies
    setup_env_files
    setup_database
    test_build
    show_dev_guide
}

# 스크립트 실행
main
