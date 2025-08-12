#!/bin/bash

# 배포 스크립트
echo "🚀 블로그 배포 시작..."

# 기존 컨테이너 정리
echo "🧹 기존 컨테이너 정리..."
docker stop min-blog-test 2>/dev/null || true
docker rm min-blog-test 2>/dev/null || true

# 기존 이미지 정리
echo "🗑️ 기존 이미지 정리..."
docker rmi min-blog 2>/dev/null || true

# 새 이미지 빌드
echo "🔨 Docker 이미지 빌드 중..."
docker build -t min-blog .

# 컨테이너 실행
echo "🚀 컨테이너 실행 중..."
docker run -d -p 3002:3001 --name min-blog-test min-blog

# 헬스 체크
echo "🏥 헬스 체크 중..."
sleep 10
if curl -f http://localhost:3002 > /dev/null 2>&1; then
    echo "✅ 배포 성공! http://localhost:3002 에서 확인하세요."
else
    echo "❌ 배포 실패. 로그를 확인해주세요."
    docker logs min-blog-test
fi
