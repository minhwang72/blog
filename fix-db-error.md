# 🚨 데이터베이스 "No database selected" 오류 해결 가이드

## 📋 문제 증상
```
Error: No database selected
code: 'ER_NO_DB_ERROR',
errno: 1046,
sqlState: '3D000'
```

## 🔍 원인 분석
MySQL 서버에는 연결되지만 특정 데이터베이스가 선택되지 않는 문제입니다.

### 주요 원인들:
1. **환경변수 누락**: `DB_NAME` 환경변수가 설정되지 않음
2. **데이터베이스 부재**: 지정된 데이터베이스가 존재하지 않음  
3. **권한 문제**: 사용자가 해당 데이터베이스에 접근 권한이 없음

## 🛠️ 즉시 해결 방법

### 1단계: 데이터베이스 연결 진단
실서버에서 다음 명령을 실행하세요:

```bash
# 디버그 스크립트 실행
npm run db:debug
```

이 스크립트는 다음을 확인합니다:
- ✅ 환경변수 설정 상태
- ✅ MySQL 서버 연결 상태
- ✅ 데이터베이스 존재 여부
- ✅ 테이블 목록
- ✅ 실제 쿼리 실행 테스트

### 2단계: 환경변수 확인
실서버의 `.env` 파일에 다음이 모두 설정되어 있는지 확인:

```bash
# 필수 환경변수들
DB_HOST="192.168.0.19"  # 또는 실제 DB 서버 주소
DB_PORT=3306
DB_USER="your-username"
DB_PASSWORD="your-password"
DB_NAME="your-database"  # 🚨 이것이 누락되면 오류 발생!
```

### 3단계: 데이터베이스 생성 (필요한 경우)
만약 데이터베이스가 존재하지 않는다면:

```sql
-- MySQL에 접속하여 실행
CREATE DATABASE `your-database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자에게 권한 부여
GRANT ALL PRIVILEGES ON `your-database`.* TO 'your-username'@'%';
FLUSH PRIVILEGES;
```

## 🚀 빠른 해결 체크리스트

### ✅ 환경변수 체크
```bash
# 실서버에서 확인
echo "DB_HOST: $DB_HOST"
echo "DB_USER: $DB_USER" 
echo "DB_NAME: $DB_NAME"  # 🚨 이것이 빈 값이면 문제!
```

### ✅ MySQL 직접 연결 테스트
```bash
# MySQL 클라이언트로 직접 연결 테스트
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME
```

### ✅ 데이터베이스 존재 확인
```sql
SHOW DATABASES;
USE your-database;  -- 오류 발생하면 데이터베이스가 없는 것
SHOW TABLES;
```

## 🔧 추가 해결방법

### DATABASE_URL 방식으로 변경 (권장)
개별 환경변수 대신 DATABASE_URL 하나로 관리:

```bash
# .env 파일에 추가
DATABASE_URL="mysql://username:password@host:port/database"
```

### 연결 풀 설정 개선
현재 코드에서 연결 타임아웃과 재연결 설정이 추가되었습니다:

```typescript
// 개선된 연결 설정
connectionLimit: 10,
acquireTimeout: 60000,
timeout: 60000,
reconnect: true
```

## 📞 지원이 필요하다면

1. **디버그 결과 확인**: `npm run db:debug` 출력 결과를 확인
2. **로그 확인**: 애플리케이션 로그에서 정확한 연결 정보 확인
3. **DB 관리자 문의**: 데이터베이스 생성이나 권한 문제 해결

## 🔄 재배포 후 확인사항

환경변수 수정 후:
1. 애플리케이션 재시작
2. `npm run db:debug`로 연결 확인
3. 웹사이트에서 포스트 목록 로딩 테스트

---

💡 **팁**: 환경변수 변경 후에는 반드시 애플리케이션을 재시작해야 적용됩니다!