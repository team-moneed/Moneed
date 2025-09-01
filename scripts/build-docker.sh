#!/bin/bash

set -e

# 변수 설정
REGISTRY="ghcr.io"
USERNAME="${GITHUB_ACTOR:team-moneed}"
IMAGE_NAME="moneed/kakao-proxy"
VERSION="${1:-latest}"

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 Docker 이미지 빌드를 시작합니다...${NC}"

# 1. Docker 빌드
echo -e "${BLUE}📦 이미지 빌드 중...${NC}"
docker build -t "${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}" .

# 2. latest 태그도 생성 (버전이 지정된 경우)
if [ "$VERSION" != "latest" ]; then
    docker tag "${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}" \
               "${REGISTRY}/${USERNAME}/${IMAGE_NAME}:latest"
fi

# 3. GitHub Container Registry 로그인 확인
if ! docker info | grep -q "ghcr.io"; then
    echo -e "${BLUE}🔐 GitHub Container Registry 로그인...${NC}"
    echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$USERNAME" --password-stdin
fi

# 4. 이미지 푸시
echo -e "${BLUE}🚀 이미지 푸시 중...${NC}"
docker push "${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}"

if [ "$VERSION" != "latest" ]; then
    docker push "${REGISTRY}/${USERNAME}/${IMAGE_NAME}:latest"
fi

echo -e "${GREEN}✅ Docker 이미지 빌드 및 푸시 완료!${NC}"
echo -e "이미지: ${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${VERSION}"