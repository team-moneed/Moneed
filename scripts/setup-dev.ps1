# ==============================================
# Moneed 로컬 개발 환경 셋업 스크립트 (PowerShell)
# ==============================================

# 에러 발생 시 중단
$ErrorActionPreference = "Stop"

Write-Host "🚀 Moneed 로컬 개발 환경을 설정합니다..." -ForegroundColor Blue

# 함수 정의
function Write-Step {
    param($Message)
    Write-Host "📋 $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error-Custom {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Node.js 버전 확인
function Test-NodeVersion {
    Write-Step "Node.js 버전을 확인합니다..."
    
    try {
        $nodeVersion = node -v
        $versionNumber = [int]($nodeVersion.Substring(1).Split('.')[0])
        
        if ($versionNumber -lt 18) {
            Write-Error-Custom "Node.js 18 이상이 필요합니다. 현재 버전: $nodeVersion"
            exit 1
        }
        
        Write-Success "Node.js 버전: $nodeVersion"
    }
    catch {
        Write-Error-Custom "Node.js가 설치되어 있지 않습니다. Node.js 18 이상을 설치해주세요."
        exit 1
    }
}

# Yarn 설치 확인
function Test-Yarn {
    Write-Step "Yarn 패키지 매니저를 확인합니다..."
    
    try {
        $yarnVersion = yarn -v
        Write-Success "Yarn 버전: $yarnVersion"
    }
    catch {
        Write-Warning "Yarn이 설치되어 있지 않습니다. 설치합니다..."
        npm install -g yarn
        Write-Success "Yarn 설치 완료"
    }
}

# 의존성 설치
function Install-Dependencies {
    Write-Step "의존성을 설치합니다..."
    yarn install --frozen-lockfile
    Write-Success "의존성 설치 완료"
}

# 환경변수 파일 설정
function Set-EnvFiles {
    Write-Step "환경변수 파일을 설정합니다..."
    
    # 웹 앱 환경변수
    if (-not (Test-Path "apps/web/.env.local")) {
        Copy-Item "env-templates/web.env.template" "apps/web/.env.local"
        Write-Success "웹 앱 환경변수 파일 생성: apps/web/.env.local"
        Write-Warning "apps/web/.env.local 파일을 열어서 실제 값으로 수정해주세요."
    }
    else {
        Write-Warning "apps/web/.env.local 파일이 이미 존재합니다."
    }
    
    # 카카오 프록시 서버 환경변수
    if (-not (Test-Path "apps/kakao-proxy-server/.env.local")) {
        Copy-Item "env-templates/kakao-proxy.env.template" "apps/kakao-proxy-server/.env.local"
        Write-Success "카카오 프록시 서버 환경변수 파일 생성: apps/kakao-proxy-server/.env.local"
        Write-Warning "apps/kakao-proxy-server/.env.local 파일을 열어서 실제 값으로 수정해주세요."
    }
    else {
        Write-Warning "apps/kakao-proxy-server/.env.local 파일이 이미 존재합니다."
    }
}

# 데이터베이스 설정
function Set-Database {
    Write-Step "데이터베이스를 설정합니다..."
    
    try {
        docker --version | Out-Null
        Write-Step "Docker를 사용하여 PostgreSQL을 실행합니다..."
        
        # PostgreSQL 컨테이너 실행
        try {
            docker run -d `
                --name moneed-postgres `
                -e POSTGRES_DB=moneed_dev `
                -e POSTGRES_USER=moneed `
                -e POSTGRES_PASSWORD=moneed123 `
                -p 5432:5432 `
                --restart unless-stopped `
                postgres:15-alpine
                
            Write-Success "PostgreSQL 컨테이너 실행 (포트: 5432)"
            Write-Warning "데이터베이스 연결 문자열: postgresql://moneed:moneed123@localhost:5432/moneed_dev"
        }
        catch {
            Write-Warning "PostgreSQL 컨테이너가 이미 실행 중이거나 오류가 발생했습니다."
        }
    }
    catch {
        Write-Warning "Docker가 설치되어 있지 않습니다. 수동으로 PostgreSQL을 설치하고 설정해주세요."
    }
}

# 빌드 테스트
function Test-Build {
    Write-Step "빌드 테스트를 실행합니다..."
    
    # 공유 패키지 빌드
    yarn build:packages
    Write-Success "공유 패키지 빌드 완료"
    
    # 타입 체크
    yarn type-check
    Write-Success "타입 체크 완료"
    
    # 린팅
    yarn lint
    Write-Success "린팅 완료"
}

# 개발 서버 실행 가이드
function Show-DevGuide {
    Write-Step "개발 서버 실행 가이드"
    Write-Host ""
    Write-Success "🎉 개발 환경 설정이 완료되었습니다!"
    Write-Host ""
    Write-Host "다음 명령어로 개발 서버를 실행할 수 있습니다:" -ForegroundColor White
    Write-Host ""
    Write-Host "# 전체 개발 서버 실행 (웹 앱 + 카카오 프록시 서버)" -ForegroundColor Yellow
    Write-Host "yarn dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "# 웹 앱만 실행" -ForegroundColor Yellow
    Write-Host "yarn dev:web" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "# 카카오 프록시 서버만 실행" -ForegroundColor Yellow
    Write-Host "yarn dev:kakao" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "# 빌드 테스트" -ForegroundColor Yellow
    Write-Host "yarn build" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 추가 설정 사항:" -ForegroundColor White
    Write-Host "1. 환경변수 파일들을 실제 값으로 수정"
    Write-Host "2. 카카오 개발자 콘솔에서 OAuth 앱 설정"
    Write-Host "3. AWS S3 버킷 설정 (이미지 업로드용)"
    Write-Host ""
    Write-Host "📖 자세한 내용은 env-templates/README.md를 참고하세요." -ForegroundColor White
}

# 메인 실행
function Main {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║         Moneed Dev Setup             ║" -ForegroundColor Blue
    Write-Host "║    모노레포 개발 환경 자동 설정        ║" -ForegroundColor Blue
    Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Blue
    Write-Host ""
    
    Test-NodeVersion
    Test-Yarn
    Install-Dependencies
    Set-EnvFiles
    Set-Database
    Test-Build
    Show-DevGuide
}

# 스크립트 실행
Main
