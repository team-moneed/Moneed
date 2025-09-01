#!/usr/bin/env bash

# ==============================================
# EC2 동기화 스크립트
# - 로컬 변경 파일을 한 번에 EC2로 복사
# ==============================================

set -euo pipefail

#=== 사용자 정의 영역 ===#
KEY_PATH="Moneed-key.pem"          # PEM 키 경로 (로컬)
EC2_USER="ubuntu"                  # EC2 유저
EC2_HOST="3.36.255.236"           # EC2 퍼블릭 IP
TARGET="${EC2_USER}@${EC2_HOST}"   # scp/ssh 대상

# 복사 목록
FILES_TO_COPY=(
  "scripts/generate-ssl-cert.sh:~/"
  "scripts/deploy-ec2.sh:~/"
  "docker-compose.yml:~/"
  "apps/kakao-proxy-server/.env.production:~/"
)
DIRECTORIES_TO_COPY=(
  "nginx:~/nginx"                  # 전체 디렉터리(설정+SSL)
)
#========================#

printf "\n🔄  EC2 동기화 시작...\n"

# Function: copy a single file with scp
copy_file() {
  local src dst
  IFS=":" read -r src dst <<< "$1"
  printf "📦  %s → %s\n" "$src" "$TARGET$dst"
  scp -i "$KEY_PATH" "$src" "$TARGET:$dst"
}

# Function: copy an entire directory with scp -r
copy_dir() {
  local src dst
  IFS=":" read -r src dst <<< "$1"
  printf "📂  %s → %s\n" "$src" "$TARGET$dst"
  scp -i "$KEY_PATH" -r "$src" "$TARGET:$dst"
}

# 1) 파일 복사
for item in "${FILES_TO_COPY[@]}"; do
  copy_file "$item"
done

# 2) 디렉터리 복사
for item in "${DIRECTORIES_TO_COPY[@]}"; do
  copy_dir "$item"
done

printf "\n✅  동기화 완료!\n"
