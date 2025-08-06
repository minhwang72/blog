import { db } from '../src/lib/db';
import { users, categories, posts, tags, postsToTags } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function enhancedSeed() {
  try {
    console.log('🌱 Enhanced database seed 시작...');

    // 기본 태그 생성
    const defaultTags = [
      'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
      'Python', 'Docker', 'AWS', 'MySQL', 'MongoDB',
      '개발팁', '성능최적화', 'UI/UX', '프로젝트', '학습',
      '회고', '일상', '리뷰', '가이드', '튜토리얼'
    ];

    const tagIds: Record<string, number> = {};
    for (const tagName of defaultTags) {
      const slug = tagName.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-');
      const result: any = await db.insert(tags).values({
        name: tagName,
        slug,
        createdAt: new Date(),
      });
      tagIds[tagName] = result.insertId;
    }

    console.log('✅ 기본 태그 생성 완료');

    // 기존 카테고리 조회
    const existingCategories = await db.select().from(categories);
    const categoryMap: Record<string, number> = {};
    
    existingCategories.forEach((cat: any) => {
      categoryMap[cat.slug] = cat.id;
    });

    // 관리자 사용자 조회
    const adminUsers = await db.select().from(users).where(eq(users.role, 'admin'));
    const adminId = adminUsers[0]?.id || 1;

    // 샘플 포스트 생성
    const samplePosts = [
      {
        title: 'Next.js 14와 App Router로 현대적인 웹 애플리케이션 만들기',
        slug: 'nextjs-14-app-router-guide',
        content: `# Next.js 14와 App Router로 현대적인 웹 애플리케이션 만들기

Next.js 14가 출시되면서 많은 새로운 기능들이 추가되었습니다. 특히 App Router는 기존의 Pages Router를 대체하는 새로운 라우팅 시스템으로, 더욱 강력하고 유연한 웹 애플리케이션을 만들 수 있게 해줍니다.

## App Router의 주요 특징

### 1. 레이아웃 시스템
App Router는 중첩된 레이아웃을 지원하여 더욱 구조화된 UI를 만들 수 있습니다.

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
\`\`\`

### 2. 서버 컴포넌트
기본적으로 모든 컴포넌트가 서버 컴포넌트로 작동하여 성능이 크게 향상되었습니다.

### 3. 스트리밍과 Suspense
React 18의 Suspense를 활용하여 페이지 로딩 성능을 최적화할 수 있습니다.

## 실제 구현 예시

### 동적 라우팅
\`\`\`tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <div>포스트: {params.slug}</div>
}
\`\`\`

### 로딩 상태
\`\`\`tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div>로딩 중...</div>
}
\`\`\`

## 성능 최적화

### 이미지 최적화
Next.js의 Image 컴포넌트를 활용하여 자동으로 이미지를 최적화할 수 있습니다.

\`\`\`tsx
import Image from 'next/image'

export default function MyImage() {
  return (
    <Image
      src="/my-image.jpg"
      alt="설명"
      width={500}
      height={300}
      priority
    />
  )
}
\`\`\`

### 메타데이터 최적화
App Router에서는 메타데이터를 더욱 쉽게 관리할 수 있습니다.

\`\`\`tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '페이지 제목',
  description: '페이지 설명',
}
\`\`\`

## 마무리

Next.js 14의 App Router는 현대적인 웹 개발의 새로운 표준을 제시합니다. 서버 컴포넌트, 스트리밍, 개선된 라우팅 시스템 등을 통해 더욱 빠르고 효율적인 웹 애플리케이션을 만들 수 있습니다.

점진적으로 마이그레이션하면서 새로운 기능들을 활용해보시기 바랍니다. 특히 서버 컴포넌트의 개념을 잘 이해하고 활용한다면 성능상 큰 이점을 얻을 수 있을 것입니다.`,
        excerpt: 'Next.js 14의 App Router를 활용하여 현대적인 웹 애플리케이션을 만드는 방법을 상세히 알아봅니다.',
        categorySlug: 'development',
        tagNames: ['Next.js', 'React', 'JavaScript', 'TypeScript', '튜토리얼'],
      },
      {
        title: 'TypeScript 5.0의 새로운 기능들과 실무 활용법',
        slug: 'typescript-5-new-features',
        content: `# TypeScript 5.0의 새로운 기능들과 실무 활용법

TypeScript 5.0이 출시되면서 많은 개발자들이 기대하던 새로운 기능들이 추가되었습니다. 이번 글에서는 주요 변경사항들을 살펴보고 실무에서 어떻게 활용할 수 있는지 알아보겠습니다.

## 주요 새기능

### 1. Decorators 지원
ECMAScript 표준에 맞춘 데코레이터가 드디어 정식 지원됩니다.

\`\`\`typescript
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  });
}

class MyClass {
  @readonly
  name: string = "TypeScript";
}
\`\`\`

### 2. const Type Parameters
제네릭 타입 매개변수에 const 제약을 걸 수 있게 되었습니다.

\`\`\`typescript
function foo<const T>(x: T): T {
  return x;
}

// 이제 타입이 더 정확하게 추론됩니다
const result = foo(['hello', 'world']); // readonly ["hello", "world"]
\`\`\`

### 3. 향상된 enum 지원
enum의 타입 안전성이 크게 개선되었습니다.

\`\`\`typescript
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue"
}

// 이제 더 엄격한 타입 체크가 가능합니다
function setColor(color: Color) {
  // ...
}
\`\`\`

### 4. 개선된 모듈 해석
ES2022의 모듈 해석 방식을 더 잘 지원합니다.

## 성능 개선

TypeScript 5.0은 이전 버전 대비 다음과 같은 성능 향상을 보여줍니다:

- **컴파일 속도**: 10-20% 향상
- **메모리 사용량**: 15% 감소
- **IDE 반응성**: 향상된 타입 체크 성능

특히 대규모 프로젝트에서 컴파일 시간이 크게 단축되었습니다.

## 실무 활용 팁

### 1. 점진적 마이그레이션
기존 프로젝트에서 TypeScript 5.0으로 업그레이드할 때는 단계적으로 진행하세요:

1. TypeScript 버전 업데이트
2. 새로운 기능 도입
3. 기존 코드 리팩토링

### 2. 새로운 기능 활용
- Decorators를 활용한 메타프로그래밍
- const Type Parameters로 더 정확한 타입 추론
- 향상된 enum 활용

### 3. 성능 최적화
- 프로젝트 레퍼런스 활용
- 증분 컴파일 설정
- 적절한 타입 체크 레벨 설정

## 주의사항

### Breaking Changes
TypeScript 5.0에는 몇 가지 호환성 변경사항이 있습니다:

- 일부 내장 타입의 변경
- 더 엄격한 타입 체크
- 일부 deprecated 기능 제거

### 마이그레이션 가이드
\`\`\`bash
# 1. TypeScript 업데이트
npm install typescript@5.0.0

# 2. 타입 체크
npx tsc --noEmit

# 3. 에러 수정
# 컴파일 에러를 하나씩 수정해나가세요
\`\`\`

## 마무리

TypeScript 5.0은 개발 경험을 크게 향상시키는 많은 기능들을 제공합니다. 특히 데코레이터 지원과 성능 개선은 매우 인상적입니다.

새로운 프로젝트에서는 적극적으로 활용해보시고, 기존 프로젝트는 단계적으로 마이그레이션해보시기 바랍니다. TypeScript의 발전은 JavaScript 생태계 전체에 긍정적인 영향을 미칠 것으로 기대됩니다.`,
        excerpt: 'TypeScript 5.0의 새로운 기능들을 살펴보고 실무에서 활용하는 방법을 상세히 알아봅니다.',
        categorySlug: 'development',
        tagNames: ['TypeScript', 'JavaScript', '개발팁', '가이드'],
      },
      {
        title: '개발자를 위한 효율적인 학습 방법과 성장 전략',
        slug: 'efficient-learning-for-developers',
        content: `# 개발자를 위한 효율적인 학습 방법과 성장 전략

개발 분야는 빠르게 변화하는 기술 트렌드로 인해 지속적인 학습이 필수입니다. 하지만 무작정 새로운 기술을 배우기보다는 체계적이고 효율적인 학습 방법이 중요합니다. 이번 글에서는 개발자로서 어떻게 효과적으로 학습하고 성장할 수 있는지 알아보겠습니다.

## 효과적인 학습 방법

### 1. 프로젝트 기반 학습 (Project-Based Learning)
이론만 공부하지 말고 실제 프로젝트를 만들어보면서 학습하세요.

**단계별 접근법:**
- **토이 프로젝트**: 작은 규모의 개인 프로젝트로 시작
- **클론 코딩**: 유명한 서비스를 따라 만들어보기
- **실제 문제 해결**: 주변의 실제 문제를 해결하는 애플리케이션 개발
- **오픈소스 기여**: 기존 프로젝트에 기여하며 실무 경험 쌓기

### 2. 문서화 습관
배운 내용을 기록하고 정리하는 습관을 기르세요.

**문서화 방법들:**
- **개발 블로그 운영**: 학습한 내용을 정리하여 포스팅
- **TIL(Today I Learned) 작성**: 매일 배운 내용을 간단히 기록
- **기술 발표 준비**: 학습한 내용을 다른 사람에게 설명
- **코드 주석**: 코드에 충분한 주석과 문서 작성

### 3. 커뮤니티 참여
혼자 공부하지 말고 다른 개발자들과 소통하세요.

**참여 방법들:**
- **기술 컨퍼런스 참석**: 최신 트렌드와 기술 동향 파악
- **온라인 커뮤니티 활동**: Stack Overflow, GitHub, Discord 등
- **스터디 그룹 참여**: 같은 목표를 가진 사람들과 함께 학습
- **멘토링**: 다른 개발자와 멘토-멘티 관계 형성

## 성장 전략

### 단계별 성장 로드맵

#### 1단계: 기초 단계 (0-1년)
- **목표**: 하나의 언어를 깊이 있게 학습
- **핵심 활동**:
  - 기본 문법과 개념 완전히 이해
  - 간단한 프로젝트 여러 개 완성
  - 기본적인 알고리즘과 자료구조 학습

#### 2단계: 응용 단계 (1-3년)
- **목표**: 다양한 프로젝트 경험과 기술 스택 확장
- **핵심 활동**:
  - 프레임워크와 라이브러리 학습
  - 데이터베이스와 백엔드 기술 이해
  - 팀 프로젝트 경험

#### 3단계: 심화 단계 (3-5년)
- **목표**: 아키텍처와 설계 패턴 학습
- **핵심 활동**:
  - 시스템 설계 능력 향상
  - 성능 최적화 경험
  - 코드 품질과 테스트 중요성 이해

#### 4단계: 전문가 단계 (5년+)
- **목표**: 특정 분야의 전문성 확보
- **핵심 활동**:
  - 기술 리더십 발휘
  - 오픈소스 프로젝트 리딩
  - 주니어 개발자 멘토링

### 효율적인 학습을 위한 도구들

#### 개발 환경 최적화
\`\`\`bash
# VS Code 확장 프로그램 추천
- GitLens
- Prettier
- ESLint
- Live Server
- Thunder Client
\`\`\`

#### 학습 관리 도구
- **Notion**: 학습 노트와 프로젝트 관리
- **Anki**: 스페이스 반복을 통한 암기
- **Toggl**: 학습 시간 추적
- **GitHub**: 코드 버전 관리와 포트폴리오

## 실무에서의 학습

### 코드 리뷰 활용
- 동료의 코드를 리뷰하며 새로운 패턴 학습
- 피드백을 받으며 코드 품질 향상
- 다양한 접근 방식 경험

### 기술 부채 해결
- 레거시 코드 개선을 통한 학습
- 리팩토링 경험으로 설계 능력 향상
- 점진적 개선의 중요성 이해

## 학습 동기 유지 방법

### 1. 명확한 목표 설정
- 단기 목표와 장기 목표 구분
- SMART 목표 설정 방법 활용
- 정기적인 목표 검토와 수정

### 2. 성취감 느끼기
- 작은 성공들을 기록하고 축하
- 포트폴리오 지속적 업데이트
- 학습 진도 시각화

### 3. 번아웃 방지
- 적절한 휴식과 여가 활동
- 다양한 주제로 관심사 분산
- 무리한 학습량 조절

## 마무리

개발자의 성장에는 왕도가 없습니다. 하지만 체계적인 학습 방법과 꾸준한 실천을 통해 효율적으로 성장할 수 있습니다.

중요한 것은:
- **지속성**: 꾸준한 학습 습관 유지
- **실천**: 배운 것을 실제로 적용해보기
- **소통**: 다른 개발자들과 지식 공유
- **성찰**: 정기적인 자기 평가와 개선

개발자로서의 여정은 길고 도전적이지만, 그만큼 보람찬 길입니다. 각자의 속도에 맞춰 꾸준히 성장해나가시기 바랍니다.`,
        excerpt: '개발자가 효율적으로 학습하고 성장할 수 있는 체계적인 방법들과 단계별 전략을 공유합니다.',
        categorySlug: 'learning',
        tagNames: ['학습', '성장', '개발팁', '회고'],
      },
      {
        title: 'Docker와 Kubernetes로 시작하는 컨테이너 오케스트레이션',
        slug: 'docker-kubernetes-container-orchestration',
        content: `# Docker와 Kubernetes로 시작하는 컨테이너 오케스트레이션

현대의 웹 애플리케이션 배포와 관리에서 컨테이너 기술은 필수가 되었습니다. Docker로 시작해서 Kubernetes까지, 단계별로 컨테이너 오케스트레이션을 배워보겠습니다.

## Docker 기초

### 컨테이너란?
컨테이너는 애플리케이션과 그 의존성을 하나의 패키지로 묶어서 어떤 환경에서든 일관되게 실행할 수 있게 해주는 기술입니다.

**컨테이너의 장점:**
- **일관성**: 개발, 테스트, 프로덕션 환경에서 동일한 실행
- **격리성**: 각 컨테이너는 독립된 환경에서 실행
- **효율성**: 가상머신보다 가벼움
- **확장성**: 쉬운 스케일링

### Dockerfile 작성
\`\`\`dockerfile
# Node.js 애플리케이션 예시
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 헬스 체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# 애플리케이션 실행
CMD ["npm", "start"]
\`\`\`

### Docker Compose
여러 컨테이너를 관리할 때는 Docker Compose를 사용합니다.

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
    
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=myapp
    volumes:
      - db_data:/var/lib/mysql
    
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  db_data:
\`\`\`

## Kubernetes 소개

Kubernetes는 컨테이너화된 애플리케이션의 배포, 확장, 관리를 자동화하는 오픈소스 플랫폼입니다.

### 주요 개념

#### Pod
- Kubernetes의 가장 작은 배포 단위
- 하나 이상의 컨테이너를 포함
- 동일한 Pod 내 컨테이너들은 네트워크와 스토리지 공유

#### Service
- Pod들에 대한 네트워크 접근을 제공
- 로드 밸런싱 기능
- 서비스 디스커버리

#### Deployment
- Pod의 복제본 관리
- 롤링 업데이트 지원
- 자동 복구 기능

### 간단한 배포 예시

#### Deployment 생성
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
\`\`\`

#### Service 생성
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
\`\`\`

### ConfigMap과 Secret
설정과 민감한 정보를 관리하는 방법입니다.

\`\`\`yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  API_URL: "https://api.example.com"

---
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  DB_PASSWORD: <base64-encoded-password>
  API_KEY: <base64-encoded-api-key>
\`\`\`

## 실무 적용 팁

### 1. 단계적 도입
\`\`\`bash
# 1단계: Docker 컨테이너화
docker build -t myapp .
docker run -p 3000:3000 myapp

# 2단계: Docker Compose로 다중 서비스
docker-compose up -d

# 3단계: Kubernetes 클러스터 구축
minikube start
kubectl apply -f deployment.yaml

# 4단계: 프로덕션 환경 배포
kubectl apply -f production/
\`\`\`

### 2. 모니터링과 로깅
\`\`\`yaml
# Prometheus + Grafana 스택
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
\`\`\`

### 3. 보안 강화
- **컨테이너 이미지 스캔**: 취약점 검사
- **RBAC**: 역할 기반 접근 제어
- **네트워크 정책**: 마이크로 세그멘테이션
- **Secret 관리**: 민감한 정보 암호화

### 4. 성능 최적화
- **리소스 제한**: CPU, 메모리 제한 설정
- **HPA**: 수평 포드 자동 스케일링
- **이미지 최적화**: 멀티 스테이지 빌드 활용

## 운영 관리

### CI/CD 파이프라인
\`\`\`yaml
# GitHub Actions 예시
name: Deploy to Kubernetes
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker image
      run: |
        docker build -t myapp:$GITHUB_SHA .
        docker push myapp:$GITHUB_SHA
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/my-app my-app=myapp:$GITHUB_SHA
        kubectl rollout status deployment/my-app
\`\`\`

### 백업과 복구
- **데이터 백업**: 볼륨 스냅샷
- **설정 백업**: YAML 파일 버전 관리
- **재해 복구**: 다중 지역 클러스터

## 마무리

컨테이너 기술은 처음에는 복잡해 보이지만, 단계별로 학습하면 충분히 마스터할 수 있습니다. 

**학습 순서:**
1. Docker 기초 개념과 명령어
2. Dockerfile 작성과 이미지 빌드
3. Docker Compose로 다중 컨테이너 관리
4. Kubernetes 기본 개념
5. 실제 프로젝트에 적용

작은 프로젝트부터 시작해서 점진적으로 복잡한 시스템으로 확장해나가세요. 컨테이너 오케스트레이션은 현대 개발에서 필수 기술이 되었으므로, 꾸준히 학습하고 실습하시기 바랍니다.`,
        excerpt: 'Docker와 Kubernetes를 활용한 컨테이너 오케스트레이션의 기초부터 실무 적용까지 상세히 알아봅니다.',
        categorySlug: 'development',
        tagNames: ['Docker', 'Kubernetes', 'DevOps', '튜토리얼'],
      },
      {
        title: '2024년 상반기 개발 회고: 새로운 도전과 성장',
        slug: '2024-first-half-retrospective',
        content: `# 2024년 상반기 개발 회고: 새로운 도전과 성장

2024년 상반기가 지나가면서 지난 6개월간의 개발 여정을 돌아보는 시간을 가져보려 합니다. 새로운 기술 스택 도입부터 팀 프로젝트까지, 다양한 경험과 배움이 있었습니다.

## 주요 성과

### 1. 새로운 기술 스택 도입

#### Next.js 14 마이그레이션
- **기존**: React + Express 조합
- **변경**: Next.js 14 App Router
- **결과**: 개발 생산성 30% 향상, SEO 개선

기존 프로젝트를 Next.js 14로 마이그레이션하면서 많은 것을 배웠습니다. 특히 서버 컴포넌트와 클라이언트 컴포넌트의 구분, 새로운 라우팅 시스템에 적응하는 과정이 흥미로웠습니다.

#### TypeScript 도입 확대
- 기존 JavaScript 프로젝트의 90% TypeScript 전환 완료
- 타입 안전성 확보로 런타임 에러 50% 감소
- 팀 전체 TypeScript 역량 향상

#### Tailwind CSS 전환
- CSS-in-JS에서 Tailwind CSS로 완전 전환
- 일관된 디자인 시스템 구축
- 번들 크기 20% 감소

### 2. 팀 프로젝트 리딩 경험

올해 처음으로 5명 규모의 팀 프로젝트를 리딩하게 되었습니다.

#### 프로젝트 개요
- **프로젝트**: 사내 업무 관리 시스템
- **기간**: 3개월
- **팀 구성**: 프론트엔드 3명, 백엔드 2명
- **기술 스택**: Next.js, TypeScript, Node.js, PostgreSQL

#### 배운 점들

**코드 리뷰의 중요성**
처음에는 코드 리뷰를 형식적으로 진행했지만, 점차 다음과 같은 체계를 만들었습니다:
- PR 템플릿 도입
- 코드 스타일 가이드 수립
- 리뷰 체크리스트 작성

**명확한 커뮤니케이션의 필요성**
- 일일 스탠드업 미팅 도입
- Slack을 통한 비동기 커뮤니케이션 활성화
- 기술 문서화 습관 정착

**일정 관리와 우선순위 설정**
- 스프린트 계획 수립
- 백로그 관리 체계화
- 리스크 관리 프로세스 도입

### 3. 개인 프로젝트 성과

#### 블로그 플랫폼 구축
- **기술 스택**: Next.js 14, TypeScript, MySQL, Tailwind CSS
- **주요 기능**: 
  - 마크다운 기반 글 작성
  - 카테고리/태그 시스템
  - 댓글 시스템
  - SEO 최적화
- **성과**: 월 방문자 1,000명 달성

#### MCP(Model Context Protocol) 통합
- AI 기반 콘텐츠 생성 시스템 도입
- Cursor IDE와의 연동으로 글 작성 자동화
- 카테고리 자동 분류 기능 구현

#### 오픈소스 기여
- **기여한 프로젝트**: 3개
- **주요 기여 내용**: 
  - 버그 수정 2건
  - 문서 개선 5건
  - 새로운 기능 제안 1건

## 어려웠던 점들

### 기술적 도전

#### 새로운 프레임워크 학습 곡선
Next.js 14의 App Router는 기존 Pages Router와 완전히 다른 패러다임이었습니다:
- 서버/클라이언트 컴포넌트 구분의 어려움
- 새로운 라우팅 시스템 적응
- 메타데이터 API 이해

**해결 방법:**
- 공식 문서 꼼꼼히 읽기
- 작은 프로젝트로 실습
- 커뮤니티에서 경험 공유

#### 복잡한 상태 관리
대규모 애플리케이션에서 상태 관리가 복잡해졌습니다:
- 서버 상태와 클라이언트 상태의 동기화
- 낙관적 업데이트 구현
- 에러 상태 처리

**해결 방법:**
- React Query(TanStack Query) 도입
- 상태 관리 패턴 정립
- 에러 바운더리 활용

#### 성능 최적화 이슈
사용자가 증가하면서 성능 문제가 발생했습니다:
- 초기 로딩 시간 지연
- 번들 크기 과도함
- 메모리 누수 발생

**해결 방법:**
- 코드 스플리팅 적용
- 이미지 최적화
- 메모리 프로파일링 도구 활용

### 개인적 도전

#### 시간 관리의 어려움
새로운 역할과 책임이 늘어나면서 시간 관리가 어려워졌습니다:
- 개발 업무와 리딩 업무의 균형
- 개인 학습 시간 확보
- 워라밸 유지

**개선 방법:**
- 시간 블록킹 기법 활용
- 우선순위 매트릭스 사용
- 델리게이션 스킬 향상

#### 번아웃 위험
고강도 업무가 지속되면서 번아웃 위험을 느꼈습니다:
- 지속적인 야근
- 스트레스 증가
- 학습 동기 저하

**대응 방법:**
- 정기적인 휴식 시간 확보
- 운동과 취미 활동 지속
- 멘토와의 정기적 상담

#### 지속적인 학습 동기 유지
빠르게 변하는 기술 트렌드를 따라가기 어려웠습니다:
- 새로운 기술의 홍수
- 학습해야 할 것들의 우선순위
- 깊이 vs 넓이의 딜레마

**해결 방법:**
- 명확한 학습 목표 설정
- 커뮤니티 활동 증가
- 멘토링과 티칭 경험

## 하반기 계획

### 기술적 목표

#### 1. 백엔드 역량 강화
- **Node.js Express 심화**: 미들웨어, 인증/인가 시스템
- **데이터베이스 최적화**: 쿼리 최적화, 인덱싱 전략
- **API 설계**: RESTful API, GraphQL 학습

#### 2. DevOps 경험 확대
- **Docker**: 컨테이너화 경험 확대
- **CI/CD**: GitHub Actions 고도화
- **모니터링**: 로그 수집, 성능 모니터링 시스템 구축

#### 3. 테스트 역량 향상
- **단위 테스트**: Jest, Vitest 활용
- **통합 테스트**: API 테스트 자동화
- **E2E 테스트**: Playwright 도입

### 개인적 목표

#### 1. 꾸준한 블로깅
- **목표**: 주 1회 이상 기술 포스팅
- **주제**: 학습한 내용, 프로젝트 경험, 트러블슈팅
- **품질**: 깊이 있는 내용과 실용적인 예제 포함

#### 2. 네트워킹 강화
- **컨퍼런스 참석**: 최소 3회 이상
- **커뮤니티 활동**: 정기 스터디 참여
- **발표 경험**: 사내/외부 기술 발표 2회 이상

#### 3. 멘토링 시작
- **대상**: 주니어 개발자 2-3명
- **방식**: 정기적인 1:1 멘토링
- **내용**: 기술 성장, 커리어 상담

### 프로젝트 계획

#### 1. 개인 프로젝트
- **포트폴리오 사이트 리뉴얼**: 3D 효과, 인터랙티브 요소 추가
- **오픈소스 프로젝트**: 개발자 도구 라이브러리 제작
- **사이드 프로젝트**: 실제 사용자가 있는 서비스 개발

#### 2. 회사 프로젝트
- **신규 서비스 개발**: 마이크로서비스 아키텍처 적용
- **레거시 시스템 개선**: 점진적 리팩토링 진행
- **팀 프로세스 개선**: 개발 문화 향상

## 배움과 성찰

### 주요 깨달음

#### 1. 기술보다 중요한 것
기술적 역량도 중요하지만, 다음과 같은 것들이 더 중요하다는 것을 깨달았습니다:
- **문제 해결 능력**: 기술은 도구일 뿐
- **커뮤니케이션**: 혼자가 아닌 팀으로 일하는 능력
- **지속적 학습**: 변화에 적응하는 능력

#### 2. 완벽보다는 진전
완벽한 코드를 작성하려 하기보다는:
- **점진적 개선**: 작은 개선을 지속적으로
- **빠른 피드백**: 일찍 자주 배포하고 개선
- **경험으로부터 학습**: 실패도 귀중한 경험

#### 3. 개인 성장과 팀 성장
개인의 성장과 팀의 성장이 함께 가야 한다는 것:
- **지식 공유**: 배운 것을 팀원들과 공유
- **멘토링**: 후배 개발자들의 성장 도움
- **문화 조성**: 좋은 개발 문화 만들기

### 앞으로의 방향성

#### 기술적 전문성과 리더십의 균형
- 깊이 있는 기술 전문성 유지
- 팀을 이끌어가는 리더십 역량 개발
- 기술과 비즈니스의 연결고리 역할

#### 지속 가능한 성장
- 번아웃 없는 꾸준한 성장
- 일과 삶의 균형 유지
- 장기적 관점에서의 커리어 설계

## 마무리

2024년 상반기는 많은 도전과 성장이 있었던 시간이었습니다. 새로운 기술을 배우고, 팀을 이끌어가는 경험을 하면서 개발자로서 한 단계 성장할 수 있었습니다.

실패도 있었지만 그로부터 배운 것들이 더욱 소중합니다. 특히 기술적 역량만큼이나 소프트 스킬의 중요성을 깨달았고, 개인의 성장이 팀과 조직의 성장으로 이어져야 한다는 것을 배웠습니다.

하반기에는 더욱 체계적이고 전략적으로 접근해보려 합니다. 백엔드와 DevOps 역량을 강화하고, 멘토링을 통해 다른 개발자들의 성장에도 기여하고 싶습니다.

개발자로서의 여정은 끝이 없지만, 그래서 더욱 흥미진진합니다. 지속적인 학습과 성장을 통해 더 나은 개발자, 더 나은 팀원이 되어가겠습니다.

**다음 회고에서는 더욱 성장한 모습으로 돌아오겠습니다!** 🚀`,
        excerpt: '2024년 상반기를 돌아보며 개발자로서의 성장과 배움, 그리고 앞으로의 계획을 상세히 정리해봅니다.',
        categorySlug: 'thoughts',
        tagNames: ['회고', '성장', '개발', '계획'],
      },
    ];

    // 포스트 생성
    for (const postData of samplePosts) {
      const categoryId = categoryMap[postData.categorySlug];
      
      if (!categoryId) {
        console.log(`⚠️ 카테고리를 찾을 수 없습니다: ${postData.categorySlug}`);
        continue;
      }
      
      const postResult: any = await db.insert(posts).values({
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt,
        published: true,
        authorId: adminId,
        categoryId,
        viewCount: Math.floor(Math.random() * 500) + 50, // 랜덤 조회수 (50-550)
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // 지난 60일 내 랜덤 날짜
        updatedAt: new Date(),
      });

      // 태그 연결
      for (const tagName of postData.tagNames) {
        const tagId = tagIds[tagName];
        if (tagId) {
          await db.insert(postsToTags).values({
            postId: postResult.insertId,
            tagId,
          });
        }
      }

      console.log(`✅ 샘플 포스트 생성: ${postData.title}`);
    }

    console.log('✅ Enhanced seed 완료!');
    console.log('📊 생성된 항목들:');
    console.log(`   - 태그: ${defaultTags.length}개`);
    console.log(`   - 포스트: ${samplePosts.length}개`);
    console.log('🎉 풍성한 블로그 콘텐츠가 준비되었습니다!');

  } catch (error) {
    console.error('❌ Enhanced seed 실패:', error);
    throw error;
  }
}

// 스크립트 실행
enhancedSeed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));