# 블로그 배포 가이드

## 🚀 배포 방법

### 1. Docker를 사용한 배포 (권장)

#### 방법 1: 배포 스크립트 사용
```bash
./deploy.sh
```

#### 방법 2: Docker Compose 사용
```bash
# 배포
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

#### 방법 3: 수동 Docker 명령어
```bash
# 이미지 빌드
docker build -t min-blog .

# 컨테이너 실행
docker run -d -p 3002:3001 --name min-blog min-blog

# 로그 확인
docker logs min-blog

# 컨테이너 중지
docker stop min-blog
docker rm min-blog
```

### 2. 클라우드 배포

#### Vercel 배포
1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 자동 배포 설정

#### AWS 배포
1. EC2 인스턴스 생성
2. Docker 설치
3. 위의 Docker 명령어 실행

#### Google Cloud Platform 배포
1. Cloud Run 사용
2. Container Registry에 이미지 푸시
3. Cloud Run에 배포

## 🔧 환경 변수 설정

프로덕션 환경에서 필요한 환경 변수:

```bash
NODE_ENV=production
PORT=3001
NEXT_TELEMETRY_DISABLED=1
```

## 📊 모니터링

### 헬스 체크
```bash
curl http://localhost:3002
```

### 로그 확인
```bash
docker logs min-blog
```

### 컨테이너 상태 확인
```bash
docker ps
```

## 🔄 업데이트

### 코드 업데이트 후 재배포
```bash
# 1. 코드 변경
git pull origin main

# 2. 재배포
./deploy.sh
```

## 🛠️ 문제 해결

### 포트 충돌
```bash
# 다른 포트 사용
docker run -d -p 3003:3001 --name min-blog min-blog
```

### 메모리 부족
```bash
# 메모리 제한 설정
docker run -d -p 3002:3001 --memory=512m --name min-blog min-blog
```

### 로그 확인
```bash
docker logs min-blog --tail 100
```

## 📝 배포 체크리스트

- [ ] 코드 빌드 테스트 (`yarn build`)
- [ ] Docker 이미지 빌드 테스트
- [ ] 컨테이너 실행 테스트
- [ ] 웹사이트 접속 테스트
- [ ] CSS 로딩 확인
- [ ] API 엔드포인트 테스트
- [ ] 데이터베이스 연결 확인 (필요시)
