#!/usr/bin/env bash

# ==============================================
# EC2 동기화 스크립트
# - 로컬 변경 파일을 한 번에 EC2로 복사
# - 실행 권한 자동 설정 및 파일 인코딩 변환
# ==============================================

set -euo pipefail

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

#=== 사용자 정의 영역 ===#
KEY_PATH="Moneed-key.pem"          # PEM 키 경로 (로컬)
EC2_USER="ubuntu"                  # EC2 유저
EC2_HOST="3.36.255.236"           # EC2 퍼블릭 IP
TARGET="${EC2_USER}@${EC2_HOST}"   # scp/ssh 대상

# 복사할 파일 목록 (실행 권한이 필요한 파일들)
SCRIPT_FILES_TO_COPY=(
  "scripts/generate-ssl-cert.sh:~/"
  "scripts/deploy-ec2.sh:~/"
)

# 일반 파일 목록
FILES_TO_COPY=(
  "docker-compose.yml:~/"
)

# 디렉터리 목록
DIRECTORIES_TO_COPY=(
  "nginx:~/nginx"                  # 전체 디렉터리(설정+SSL)
)

# 환경변수 파일 (선택적)
ENV_FILES=(
  "apps/kakao-proxy-server/.env.production:~/.env.production"
  "apps/kakao-proxy-server/.env:~/.env"
)
#========================#

# 파일 존재 확인 함수
check_file_exists() {
  local file="$1"
  if [ ! -f "$file" ]; then
    print_error "파일이 존재하지 않습니다: $file"
    return 1
  fi
  return 0
}

# 스크립트 파일 복사 및 권한 설정 함수
copy_script_file() {
  local src dst filename
  IFS=":" read -r src dst <<< "$1"
  filename=$(basename "$src")
  
  if ! check_file_exists "$src"; then
    print_warning "스크립트 파일을 건너뜁니다: $src"
    return
  fi
  
  print_step "스크립트 파일 복사: $src → $TARGET:$dst"
  scp -i "$KEY_PATH" "$src" "$TARGET:$dst"
  
  # EC2에서 실행 권한 부여 및 인코딩 변환
  print_step "실행 권한 부여 및 인코딩 변환: $filename"
  ssh -i "$KEY_PATH" "$TARGET" "chmod +x $dst$filename && dos2unix $dst$filename 2>/dev/null || true"
}

# 일반 파일 복사 함수
copy_file() {
  local src dst
  IFS=":" read -r src dst <<< "$1"
  
  if ! check_file_exists "$src"; then
    print_warning "파일을 건너뜁니다: $src"
    return
  fi
  
  print_step "파일 복사: $src → $TARGET:$dst"
  scp -i "$KEY_PATH" "$src" "$TARGET:$dst"
}

# 디렉터리 복사 함수
copy_dir() {
  local src dst
  IFS=":" read -r src dst <<< "$1"
  
  if [ ! -d "$src" ]; then
    print_warning "디렉터리가 존재하지 않습니다: $src"
    return
  fi
  
  print_step "디렉터리 복사: $src → $TARGET:$dst"
  scp -i "$KEY_PATH" -r "$src" "$TARGET:$dst"
}

# 환경변수 파일 복사 함수 (선택적)
copy_env_file() {
  local src dst
  IFS=":" read -r src dst <<< "$1"
  
  if [ ! -f "$src" ]; then
    print_warning "환경변수 파일이 없습니다: $src (필요시 수동으로 생성하세요)"
    return
  fi
  
  print_step "환경변수 파일 복사: $src → $TARGET:$dst"
  scp -i "$KEY_PATH" "$src" "$TARGET:$dst"
}

# 메인 동기화 프로세스
main() {
  print_step "EC2 동기화를 시작합니다..."
  
  # EC2에서 dos2unix 설치 확인 및 설치
  print_step "EC2에 dos2unix 설치 확인..."
  ssh -i "$KEY_PATH" "$TARGET" "which dos2unix >/dev/null 2>&1 || sudo apt-get update -qq && sudo apt-get install -y dos2unix >/dev/null 2>&1" || print_warning "dos2unix 설치 실패 (무시하고 계속)"
  
  # 1) 스크립트 파일 복사 (실행 권한 자동 설정)
  print_step "스크립트 파일들을 복사합니다..."
  for item in "${SCRIPT_FILES_TO_COPY[@]}"; do
    copy_script_file "$item"
  done
  
  # 2) 일반 파일 복사
  print_step "일반 파일들을 복사합니다..."
  for item in "${FILES_TO_COPY[@]}"; do
    copy_file "$item"
  done
  
  # 3) 디렉터리 복사
  print_step "디렉터리들을 복사합니다..."
  for item in "${DIRECTORIES_TO_COPY[@]}"; do
    copy_dir "$item"
  done
  
  # 4) 환경변수 파일 복사 (선택적)
  print_step "환경변수 파일을 확인합니다..."
  for item in "${ENV_FILES[@]}"; do
    copy_env_file "$item"
  done
  
  # 5) 배포 준비 확인
  print_step "배포 준비 상태를 확인합니다..."
  ssh -i "$KEY_PATH" "$TARGET" "
    echo '배포에 필요한 파일들:'
    ls -la deploy-ec2.sh docker-compose.yml 2>/dev/null || echo '일부 파일이 누락되었습니다.'
    echo ''
    echo '실행 권한 확인:'
    ls -la *.sh 2>/dev/null || echo '스크립트 파일이 없습니다.'
  "
  
  print_success "동기화가 완료되었습니다!"
  echo ""
  print_step "다음 단계:"
  echo "1. EC2에 SSH 접속: ssh -i $KEY_PATH $TARGET"
  echo "2. 환경변수 설정 (필요시): export GITHUB_TOKEN=your_token"
  echo "3. 배포 실행: ./deploy-ec2.sh"
}

# 실행
main
