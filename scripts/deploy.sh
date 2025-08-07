#!/bin/bash

# Docker 배포 스크립트

echo "🚀 Docker 이미지 빌드 시작..."

# 현재 Git 커밋 해시 가져오기
COMMIT_HASH=$(git rev-parse HEAD)
IMAGE_NAME="zxcyui6181/blog:${COMMIT_HASH}"

# Docker 이미지 빌드
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    echo "✅ Docker 이미지 빌드 성공: $IMAGE_NAME"
    
    # 기존 컨테이너 중지 및 제거
    echo "🛑 기존 컨테이너 중지..."
    docker stop blog 2>/dev/null || true
    docker rm blog 2>/dev/null || true
    
    # 새 컨테이너 실행
    echo "🚀 새 컨테이너 실행..."
    docker run -d \
        --name blog \
        --restart unless-stopped \
        -p 3001:3001 \
        -e NODE_ENV=production \
        -e SKIP_DATABASE_CONNECTION=true \
        $IMAGE_NAME
    
    if [ $? -eq 0 ]; then
        echo "✅ 배포 성공!"
        echo "🌐 서비스 URL: http://localhost:3001"
        echo "📊 컨테이너 상태 확인: docker logs -f blog"
    else
        echo "❌ 컨테이너 실행 실패"
        exit 1
    fi
else
    echo "❌ Docker 이미지 빌드 실패"
    exit 1
fi 