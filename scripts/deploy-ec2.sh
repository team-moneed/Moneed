#!/bin/bash

# ==============================================
# EC2 인스턴스 배포 스크립트
# ==============================================

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 설정 변수
CONTAINER_NAME="kakao-proxy"
IMAGE_NAME="ghcr.io/your-username/moneed/kakao-proxy"
ENV_FILE="/home/$USER/.env.production"
BACKUP_DIR="/home/$USER/backups"
LOG_FILE="/var/log/moneed-deploy.log"

# 함수 정의
print_step() {
    echo -e "${BLUE}📋 $1${NC}" | tee -a $LOG_FILE
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a $LOG_FILE
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a $LOG_FILE
}

print_error() {
    echo -e "${RED}❌ $1${NC}" | tee -a $LOG_FILE
}

# 로그 파일 초기화
init_log() {
    sudo touch $LOG_FILE
    sudo chmod 666 $LOG_FILE
    echo "$(date): Deployment started" > $LOG_FILE
}

# 환경변수 확인
check_env() {
    print_step "환경변수를 확인합니다..."
    
    if [ -z "$GITHUB_TOKEN" ]; then
        print_error "GITHUB_TOKEN 환경변수가 설정되지 않았습니다."
        exit 1
    fi
    
    if [ -z "$IMAGE_TAG" ]; then
        print_warning "IMAGE_TAG가 설정되지 않아 'latest'를 사용합니다."
        IMAGE_TAG="latest"
    fi
    
    print_success "환경변수 확인 완료"
}

# Docker 로그인
docker_login() {
    print_step "Docker 레지스트리에 로그인합니다..."
    
    echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin
    print_success "Docker 로그인 완료"
}

# 새 이미지 풀
pull_image() {
    print_step "새 Docker 이미지를 다운로드합니다..."
    
    docker pull "$IMAGE_NAME:$IMAGE_TAG"
    print_success "이미지 다운로드 완료: $IMAGE_NAME:$IMAGE_TAG"
}

# 현재 컨테이너 백업
backup_current() {
    print_step "현재 실행 중인 컨테이너를 백업합니다..."
    
    # 백업 디렉토리 생성
    mkdir -p $BACKUP_DIR
    
    # 현재 컨테이너가 실행 중인지 확인
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        # 컨테이너 정보 백업
        docker inspect $CONTAINER_NAME > "$BACKUP_DIR/container-info-$(date +%Y%m%d-%H%M%S).json"
        
        # 로그 백업
        docker logs $CONTAINER_NAME > "$BACKUP_DIR/container-logs-$(date +%Y%m%d-%H%M%S).log" 2>&1
        
        print_success "컨테이너 백업 완료"
    else
        print_warning "실행 중인 컨테이너가 없습니다."
    fi
}

# 기존 컨테이너 중지 및 제거
stop_current() {
    print_step "기존 컨테이너를 중지합니다..."
    
    # 컨테이너 중지
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        docker stop $CONTAINER_NAME
        print_success "컨테이너 중지 완료"
    else
        print_warning "실행 중인 컨테이너가 없습니다."
    fi
    
    # 컨테이너 제거
    if docker ps -aq -f name=$CONTAINER_NAME | grep -q .; then
        docker rm $CONTAINER_NAME
        print_success "컨테이너 제거 완료"
    fi
}

# 새 컨테이너 실행
start_new() {
    print_step "새 컨테이너를 실행합니다..."
    
    # 환경변수 파일 존재 확인
    if [ ! -f "$ENV_FILE" ]; then
        print_error "환경변수 파일이 존재하지 않습니다: $ENV_FILE"
        print_warning "env-templates/production.env.template을 참고하여 파일을 생성해주세요."
        exit 1
    fi
    
    # 컨테이너 실행
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p 8000:8000 \
        --env-file $ENV_FILE \
        --log-driver json-file \
        --log-opt max-size=10m \
        --log-opt max-file=3 \
        "$IMAGE_NAME:$IMAGE_TAG"
    
    print_success "새 컨테이너 실행 완료"
}

# 헬스체크
health_check() {
    print_step "헬스체크를 실행합니다..."
    
    # 컨테이너 시작 대기
    sleep 10
    
    # 최대 30초간 헬스체크 시도
    for i in {1..6}; do
        if curl -f http://localhost:8000/health &>/dev/null; then
            print_success "헬스체크 성공"
            return 0
        fi
        
        print_warning "헬스체크 시도 $i/6 실패, 5초 후 재시도..."
        sleep 5
    done
    
    print_error "헬스체크 실패"
    
    # 실패 시 로그 출력
    print_step "컨테이너 로그를 확인합니다..."
    docker logs --tail 50 $CONTAINER_NAME
    
    return 1
}

# 이전 이미지 정리
cleanup_images() {
    print_step "이전 Docker 이미지를 정리합니다..."
    
    # 72시간 이전 이미지 제거
    docker image prune -af --filter "until=72h"
    
    # 사용하지 않는 이미지 제거
    docker image prune -f
    
    print_success "이미지 정리 완료"
}

# 배포 롤백
rollback() {
    print_error "배포에 실패했습니다. 롤백을 시도합니다..."
    
    # 실패한 컨테이너 중지 및 제거
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
    
    # 이전 이미지로 롤백 (latest-backup 태그가 있다면)
    if docker images -q "$IMAGE_NAME:latest-backup" | grep -q .; then
        print_step "이전 버전으로 롤백합니다..."
        
        docker run -d \
            --name $CONTAINER_NAME \
            --restart unless-stopped \
            -p 8000:8000 \
            --env-file $ENV_FILE \
            "$IMAGE_NAME:latest-backup"
        
        sleep 10
        
        if curl -f http://localhost:8000/health &>/dev/null; then
            print_success "롤백 완료"
        else
            print_error "롤백도 실패했습니다. 수동 복구가 필요합니다."
        fi
    else
        print_error "롤백할 이미지가 없습니다. 수동 복구가 필요합니다."
    fi
}

# 배포 상태 확인
check_deployment() {
    print_step "배포 상태를 확인합니다..."
    
    # 컨테이너 상태
    if docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -q $CONTAINER_NAME; then
        print_success "컨테이너가 정상 실행 중입니다."
        docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        print_error "컨테이너가 실행되지 않았습니다."
        return 1
    fi
    
    # 디스크 사용량 확인
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 80 ]; then
        print_warning "디스크 사용량이 높습니다: ${DISK_USAGE}%"
    fi
    
    # 메모리 사용량 확인
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$MEMORY_USAGE" -gt 80 ]; then
        print_warning "메모리 사용량이 높습니다: ${MEMORY_USAGE}%"
    fi
}

# 메인 배포 함수
deploy() {
    print_step "배포를 시작합니다..."
    
    # 현재 이미지를 백업 태그로 저장
    if docker images -q "$IMAGE_NAME:latest" | grep -q .; then
        docker tag "$IMAGE_NAME:latest" "$IMAGE_NAME:latest-backup"
    fi
    
    check_env
    docker_login
    pull_image
    backup_current
    stop_current
    start_new
    
    if health_check; then
        cleanup_images
        check_deployment
        print_success "🎉 배포가 성공적으로 완료되었습니다!"
        
        # 배포 완료 알림
        echo "$(date): Deployment completed successfully" >> $LOG_FILE
    else
        rollback
        exit 1
    fi
}

# 사용법 출력
usage() {
    echo "사용법: $0 [OPTIONS]"
    echo ""
    echo "옵션:"
    echo "  deploy              배포 실행"
    echo "  rollback            이전 버전으로 롤백"
    echo "  status              현재 상태 확인"
    echo "  logs                컨테이너 로그 확인"
    echo "  cleanup             이미지 정리"
    echo "  -h, --help          도움말 출력"
    echo ""
    echo "환경변수:"
    echo "  GITHUB_TOKEN        GitHub 토큰 (필수)"
    echo "  IMAGE_TAG           이미지 태그 (기본값: latest)"
    echo "  GITHUB_ACTOR        GitHub 사용자명"
}

# 메인 실행
case "${1:-deploy}" in
    deploy)
        init_log
        deploy
        ;;
    rollback)
        init_log
        rollback
        ;;
    status)
        check_deployment
        ;;
    logs)
        docker logs -f $CONTAINER_NAME
        ;;
    cleanup)
        cleanup_images
        ;;
    -h|--help)
        usage
        ;;
    *)
        echo "알 수 없는 명령어: $1"
        usage
        exit 1
        ;;
esac
