#!/bin/bash

# ==============================================
# 자체 서명 SSL 인증서 생성 스크립트
# ==============================================

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 설정
SSL_DIR="./nginx/ssl"
DAYS_VALID=365
IP_ADDRESS="3.36.255.236"

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

# SSL 디렉토리 생성
create_ssl_directory() {
    print_step "SSL 디렉토리를 생성합니다..."
    
    if [ ! -d "$SSL_DIR" ]; then
        mkdir -p "$SSL_DIR"
        print_success "SSL 디렉토리 생성 완료: $SSL_DIR"
    else
        print_warning "SSL 디렉토리가 이미 존재합니다: $SSL_DIR"
    fi
}

# OpenSSL 설정 파일 생성
create_openssl_config() {
    print_step "OpenSSL 설정 파일을 생성합니다..."
    
    cat > "$SSL_DIR/openssl.cnf" << EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C = KR
ST = Seoul
L = Seoul
O = Moneed
OU = Development
CN = $IP_ADDRESS

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = $IP_ADDRESS
EOF
    
    print_success "OpenSSL 설정 파일 생성 완료"
}

# 개인 키 생성
generate_private_key() {
    print_step "개인 키를 생성합니다..."
    
    openssl genrsa -out "$SSL_DIR/server.key" 2048
    
    if [ $? -eq 0 ]; then
        print_success "개인 키 생성 완료: $SSL_DIR/server.key"
    else
        print_error "개인 키 생성 실패"
        exit 1
    fi
}

# 인증서 서명 요청(CSR) 생성
generate_csr() {
    print_step "인증서 서명 요청(CSR)을 생성합니다..."
    
    openssl req -new -key "$SSL_DIR/server.key" \
        -out "$SSL_DIR/server.csr" \
        -config "$SSL_DIR/openssl.cnf"
    
    if [ $? -eq 0 ]; then
        print_success "CSR 생성 완료: $SSL_DIR/server.csr"
    else
        print_error "CSR 생성 실패"
        exit 1
    fi
}

# 자체 서명 인증서 생성
generate_certificate() {
    print_step "자체 서명 인증서를 생성합니다..."
    
    openssl x509 -req -days $DAYS_VALID \
        -in "$SSL_DIR/server.csr" \
        -signkey "$SSL_DIR/server.key" \
        -out "$SSL_DIR/server.crt" \
        -extensions v3_req \
        -extfile "$SSL_DIR/openssl.cnf"
    
    if [ $? -eq 0 ]; then
        print_success "인증서 생성 완료: $SSL_DIR/server.crt"
        print_warning "이 인증서는 자체 서명되었으므로 브라우저에서 경고가 표시됩니다."
    else
        print_error "인증서 생성 실패"
        exit 1
    fi
}

# 인증서 정보 표시
display_certificate_info() {
    print_step "인증서 정보를 확인합니다..."
    
    echo ""
    echo "========== 인증서 정보 =========="
    openssl x509 -in "$SSL_DIR/server.crt" -noout -text | grep -A 2 "Subject:"
    openssl x509 -in "$SSL_DIR/server.crt" -noout -text | grep -A 1 "Subject Alternative Name:"
    echo ""
    echo "유효 기간:"
    openssl x509 -in "$SSL_DIR/server.crt" -noout -dates
    echo "================================="
    echo ""
}

# 파일 권한 설정
set_permissions() {
    print_step "파일 권한을 설정합니다..."
    
    chmod 600 "$SSL_DIR/server.key"
    chmod 644 "$SSL_DIR/server.crt"
    
    print_success "파일 권한 설정 완료"
}

# 메인 실행
main() {
    echo ""
    echo "🔐 자체 서명 SSL 인증서 생성을 시작합니다"
    echo "IP 주소: $IP_ADDRESS"
    echo "유효 기간: $DAYS_VALID 일"
    echo ""
    
    create_ssl_directory
    create_openssl_config
    generate_private_key
    generate_csr
    generate_certificate
    display_certificate_info
    set_permissions
    
    echo ""
    print_success "🎉 SSL 인증서 생성이 완료되었습니다!"
    echo ""
    echo "생성된 파일:"
    echo "  - 개인 키: $SSL_DIR/server.key"
    echo "  - 인증서: $SSL_DIR/server.crt"
    echo ""
    print_warning "브라우저에서 https://$IP_ADDRESS 접속 시 보안 경고가 표시됩니다."
    print_warning "이는 자체 서명 인증서이기 때문이며, 테스트 목적으로는 정상입니다."
    echo ""
}

# 스크립트 실행
main
