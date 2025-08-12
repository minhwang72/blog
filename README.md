# min.log - 개발자의 기록 공간

개발자의 기술과 배움을 기록하는 블로그입니다. 새로운 기술을 탐구하고 경험을 공유하는 지식의 공간입니다.

## 🚀 주요 기능

- **모던한 디자인**: 티스토리와 차별화된 독특한 레이아웃
- **콘텐츠 중심**: 포스트와 글들이 풍성하게 보이는 디자인
- **카테고리 시스템**: 체계적인 포스트 분류
- **댓글 시스템**: 독자와의 소통 공간
- **관리자 대시보드**: 직관적인 블로그 관리
- **Google AdSense**: 수익 창출 지원 (정책 준수)
- **다크 모드**: 사용자 편의성 향상
- **반응형 디자인**: 모든 디바이스 지원

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL, Drizzle ORM
- **Authentication**: Custom Session Management
- **Deployment**: Vercel
- **AdSense**: Google AdSense (정책 준수)

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/min-blog.git
cd min-blog
```

### 2. 의존성 설치
```bash
npm install
# 또는
yarn install
```

### 3. 환경 변수 설정
```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 편집하여 실제 값으로 설정:
```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/blog_db"

# Admin
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="your-secure-password"

# Google AdSense (실제 값으로 교체 필요)
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID="ca-pub-4467822003966307"
NEXT_PUBLIC_ADSENSE_TOP_SLOT="your-top-ad-slot-id"
NEXT_PUBLIC_ADSENSE_MIDDLE_SLOT="your-middle-ad-slot-id"
NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT="your-bottom-ad-slot-id"
NEXT_PUBLIC_ADSENSE_DEFAULT_SLOT="your-default-ad-slot-id"
```

### 4. 데이터베이스 설정
```bash
# 데이터베이스 마이그레이션
npm run db:push

# 관리자 계정 생성
npm run create:admin

# 초기 데이터 설정 (선택사항)
npm run seed
```

### 5. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3001 에서 블로그를 확인할 수 있습니다.

## 📝 Google AdSense 설정

### AdSense 정책 준수
이 블로그는 Google AdSense 정책을 엄격히 준수합니다:

- **콘텐츠 길이**: 최소 1000자 이상의 포스트에만 광고 표시
- **실제 콘텐츠**: 포스트 ID가 있는 실제 콘텐츠 페이지에만 광고 표시
- **프로덕션 환경**: 개발 환경에서는 광고 비활성화
- **광고 슬롯 검증**: 실제 광고 슬롯 ID가 설정된 경우에만 광고 표시

### AdSense 설정 방법
1. Google AdSense 계정에서 광고 슬롯 생성
2. `.env.local`에 실제 광고 슬롯 ID 설정
3. 관리자 페이지에서 광고 위치 및 규칙 설정

## 🎨 디자인 특징

### 메인 페이지
- **Hero Section**: 간결하고 임팩트 있는 타이틀
- **카테고리 네비게이션**: 직관적인 포스트 분류
- **통계 카드**: 블로그 현황 한눈에 파악
- **포스트 그리드**: 풍성하고 매력적인 카드 레이아웃

### 포스트 카드
- **그라데이션 효과**: 호버 시 배경 그라데이션
- **카테고리 태그**: 색상 구분된 카테고리 표시
- **상대적 시간**: "오늘", "어제", "3일 전" 등 직관적 표시
- **조회수**: 천 단위 구분자 포함

### 관리자 대시보드
- **현대적 UI**: 이모지와 색상으로 구분된 기능
- **빠른 액션**: 자주 사용하는 기능에 빠른 접근
- **실시간 통계**: 포스트, 댓글, 조회수 현황
- **반응형 네비게이션**: 모바일 친화적 메뉴

## 🔧 관리자 기능

### 대시보드 (`/admin`)
- 블로그 통계 확인
- 빠른 액션 메뉴
- 최근 포스트 및 댓글 현황

### 포스트 관리 (`/admin/posts`)
- 새 포스트 작성
- 기존 포스트 편집/삭제
- 포스트 상태 관리 (발행/임시저장)

### 댓글 관리 (`/admin/comments`)
- 댓글 검토 및 승인
- 스팸 댓글 관리
- 댓글 삭제

### 광고 설정 (`/admin/ads`)
- Google AdSense 광고 위치 설정
- 광고 표시 규칙 관리
- 광고 코드 관리

### 소개페이지 (`/admin/about`)
- About 페이지 내용 수정
- 프로필 정보 관리

## 🚀 배포

### Vercel 배포
1. GitHub 저장소 연결
2. 환경 변수 설정
3. 자동 배포 활성화

### 환경 변수 설정 (Vercel)
- `DATABASE_URL`: 프로덕션 데이터베이스 URL
- `ADMIN_EMAIL`: 관리자 이메일
- `ADMIN_PASSWORD`: 관리자 비밀번호
- `NEXT_PUBLIC_ADSENSE_*`: AdSense 설정

## 📱 반응형 디자인

- **데스크탑**: 3열 그리드 레이아웃
- **태블릿**: 2열 그리드 레이아웃
- **모바일**: 1열 그리드 레이아웃
- **네비게이션**: 햄버거 메뉴 (모바일)

## 🎯 SEO 최적화

- **메타 태그**: 완전한 SEO 메타데이터
- **Open Graph**: 소셜 미디어 공유 최적화
- **Twitter Cards**: 트위터 공유 최적화
- **사이트맵**: 자동 생성
- **robots.txt**: 검색 엔진 크롤링 최적화

## 🔒 보안

- **관리자 인증**: 세션 기반 인증
- **CSRF 보호**: API 요청 보안
- **입력 검증**: Zod 스키마 검증
- **SQL 인젝션 방지**: Drizzle ORM 사용

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

- **이메일**: contact@eungming.com
- **웹사이트**: https://eungming.com
- **GitHub**: https://github.com/your-username

---

**min.log** - 개발자의 기술과 배움을 기록하는 공간 🚀
