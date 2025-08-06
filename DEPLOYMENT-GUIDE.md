# 🚀 eungming.com 배포 가이드

## 🔄 리디렉션 루프 문제 해결

### 문제 상황
- `blog.eungming.com` → `eungming.com` 리디렉션에서 무한 루프 발생
- nginx와 Next.js 양쪽에서 리디렉션을 처리하면서 충돌

### ✅ 해결 방법
1. **Next.js 리디렉션 제거** (완료)
2. **nginx에서만 리디렉션 처리**

---

## 📋 서버 설정 단계

### 1. Next.js 애플리케이션 빌드 및 실행
```bash
# 프로젝트 빌드
yarn build

# 포트 3001에서 실행
yarn start
# 또는 PM2 사용시:
pm2 start yarn --name "eungming-blog" -- start
```

### 2. Nginx 설정 파일 적용

#### 옵션 A: 간단한 설정 (`nginx-simple.conf`)
```bash
# 기존 설정 백업
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# 간단한 설정 복사
sudo cp nginx-simple.conf /etc/nginx/sites-available/eungming.com

# 심볼릭 링크 생성
sudo ln -sf /etc/nginx/sites-available/eungming.com /etc/nginx/sites-enabled/

# 기본 설정 비활성화
sudo rm -f /etc/nginx/sites-enabled/default
```

#### 옵션 B: 완전한 설정 (`nginx.conf`)
```bash
# 완전한 설정 복사 (SSL, 캐싱, 보안 헤더 포함)
sudo cp nginx.conf /etc/nginx/sites-available/eungming.com

# 심볼릭 링크 생성
sudo ln -sf /etc/nginx/sites-available/eungming.com /etc/nginx/sites-enabled/

# 기본 설정 비활성화
sudo rm -f /etc/nginx/sites-enabled/default
```

### 3. Nginx 설정 검증 및 재시작
```bash
# 설정 문법 검사
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx

# 상태 확인
sudo systemctl status nginx
```

---

## 🔧 설정 파일 상세 설명

### nginx-simple.conf (최소 설정)
- ✅ 기본 리디렉션 처리
- ✅ HTTP 프록시 설정
- ⚠️ SSL, 캐싱, 보안 헤더 없음

### nginx.conf (완전한 설정)
- ✅ 도메인 리디렉션 (`blog.eungming.com`, `www.eungming.com` → `eungming.com`)
- ✅ SSL/HTTPS 지원
- ✅ Gzip 압축
- ✅ 정적 파일 캐싱
- ✅ 보안 헤더
- ✅ Next.js API 라우팅 최적화

---

## 🌐 DNS 설정 (필요시)

DNS에서 다음 레코드가 모두 같은 서버 IP를 가리키는지 확인:
- `eungming.com`
- `www.eungming.com`
- `blog.eungming.com`

---

## 🔍 문제 해결

### 1. 여전히 리디렉션 루프가 발생하는 경우
```bash
# 브라우저 캐시 완전 삭제
# Chrome: Ctrl+Shift+R (강력 새로고침)
# 또는 시크릿 모드에서 테스트

# 서버 로그 확인
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. nginx 설정 오류시
```bash
# 설정 문법 확인
sudo nginx -t

# 기본 설정으로 복원
sudo cp /etc/nginx/sites-available/default.backup /etc/nginx/sites-available/default
sudo systemctl restart nginx
```

### 3. Next.js 애플리케이션이 실행되지 않는 경우
```bash
# 포트 3001이 사용 중인지 확인
sudo netstat -tlnp | grep :3001

# 프로세스 확인
ps aux | grep node

# PM2 사용시 상태 확인
pm2 status
pm2 logs eungming-blog
```

---

## ✅ 배포 후 확인사항

1. **리디렉션 테스트**
   - `http://blog.eungming.com` → `https://eungming.com`
   - `http://www.eungming.com` → `https://eungming.com`

2. **페이지 접근 테스트**
   - 메인페이지: `https://eungming.com`
   - 블로그: `https://eungming.com/blog`
   - 소개: `https://eungming.com/about`

3. **API 테스트**
   - `https://eungming.com/api/posts`

4. **성능 확인**
   - Google PageSpeed Insights
   - 브라우저 개발자도구 Network 탭

---

## 📞 추가 지원

문제가 지속되면 다음 정보를 포함하여 문의:
- Nginx 버전: `nginx -v`
- 에러 로그: `/var/log/nginx/error.log`
- 현재 사용 중인 설정 파일