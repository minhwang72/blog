import { z } from 'zod'

// SSL 인증서 검증은 시스템 기본값 사용

// Claude API 설정
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'

// Unsplash API 설정 (무료 이미지 제공)
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '' // 환경변수에서 가져오기

// 포스트 주제 카테고리 (유입률 높은 트렌드 주제들)
const postCategories = [
  {
    name: '개발',
    topics: [
      '2025년 주목해야 할 개발 트렌드 TOP 10',
      '개발자 연봉 협상 완전 정복 가이드',
      '신입 개발자가 알아야 할 실무 꿀팁 15가지',
      '개발자 포트폴리오 완벽 작성법',
      '코딩 테스트 고득점 전략과 필수 알고리즘',
      '개발자 면접 합격 비법과 예상 질문 정리',
      '프로그래밍 언어별 연봉 및 전망 분석',
      '개발자가 꼭 알아야 할 보안 상식 10가지',
      'Git 고급 기능으로 협업 생산성 200% 향상',
      '개발자를 위한 시간 관리 및 업무 효율화',
      '클라우드 네이티브 개발의 모든 것',
      '개발자 커리어 로드맵과 성장 전략',
      '오픈소스 기여로 실력 향상하는 방법',
      '개발자를 위한 영어 실력 향상 가이드',
      '사이드 프로젝트로 수익 창출하는 법'
    ]
  },
  {
    name: 'MCP·에이전트',
    topics: [
      'Claude MCP로 개발 생산성 10배 늘리는 방법',
      'AI 코딩 어시스턴트 비교: Claude vs ChatGPT vs Copilot',
      '개발자를 위한 AI 프롬프트 엔지니어링 마스터 가이드',
      'MCP 에이전트로 반복 작업 자동화하기',
      'AI로 코드 리뷰 품질 향상시키는 실전 팁',
      'Cursor AI 활용법: 개발 속도 3배 빨라지는 비법',
      'AI 도구로 문서화 자동화하는 완벽 가이드',
      '개발자를 위한 ChatGPT 활용 200% 가이드',
      'AI 에이전트 커스터마이징으로 나만의 도구 만들기',
      'AI 코딩 도구들의 숨겨진 고급 기능들',
      '프롬프트 최적화로 AI 성능 극대화하기',
      'AI 협업으로 개발 워크플로우 혁신하기',
      'AI 도구 조합으로 완벽한 개발 환경 구축',
      'AI 시대 개발자가 살아남는 방법',
      'MCP 플러그인 개발로 수익 창출하기'
    ]
  },
  {
    name: '학습',
    topics: [
      '개발자 독학 완전 정복: 0부터 취업까지',
      '개발 공부 효율 10배 높이는 학습법',
      '개발자가 꼭 읽어야 할 필독서 TOP 20',
      '무료 개발 강의로 실력 향상하는 로드맵',
      '개발자 멘토 찾기와 네트워킹 전략',
      '기술 블로그 운영으로 브랜딩하는 방법',
      '개발 컨퍼런스 100% 활용 가이드',
      '온라인 코딩 부트캠프 선택 가이드',
      '개발자를 위한 효과적인 노트 정리법',
      '기술 트렌드 파악하고 앞서가는 방법',
      '개발자 스터디 그룹 운영 노하우',
      '코딩 실력 향상을 위한 일일 루틴',
      '개발자를 위한 영어 학습 완전 가이드',
      '개발 관련 유튜브 채널 추천 TOP 15',
      '개발자 자기계발서 베스트 10선'
    ]
  },
  {
    name: '일상',
    topics: [
      '개발자 번아웃 극복하고 재충전하는 방법',
      '재택근무 개발자를 위한 완벽한 홈오피스 세팅',
      '개발자 건강 관리: 목과 어깨 통증 예방법',
      '개발자를 위한 워라밸 찾기 실전 가이드',
      '개발자 부업으로 월 100만원 벌기',
      '개발자 데이팅과 연애 성공 비법',
      '개발자 취미 추천: 코딩 외 스트레스 해소법',
      '개발자를 위한 투자 및 재테크 가이드',
      '개발자 해외 이주 및 해외 취업 가이드',
      '개발자 모임과 네트워킹 이벤트 참가 후기',
      '개발자를 위한 맛집과 카페 추천',
      '개발자 패션과 스타일링 팁',
      '개발자를 위한 운동 루틴과 건강 관리',
      '개발자가 좋아하는 영화와 드라마 추천',
      '개발자 여행: 코워킹 스페이스와 디지털 노마드'
    ]
  }
]

// 날짜 기반 주제 선택
function getTopicByDate(date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const categoryIndex = dayOfYear % postCategories.length
  const category = postCategories[categoryIndex]
  const topicIndex = dayOfYear % category.topics.length
  
  return {
    category: category.name,
    topic: category.topics[topicIndex]
  }
}

// Claude API 호출 (재시도 로직 포함)
async function callClaudeAPI(prompt: string, maxRetries = 5) {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY 환경변수가 설정되지 않았습니다.')
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Claude API 호출 시도 ${attempt}/${maxRetries}...`)
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Claude API 호출 성공! (시도 ${attempt}/${maxRetries})`)
        return data.content[0].text
      }

      // 529 (서버 과부하) 또는 502, 503, 504 에러인 경우 재시도
      if ([529, 502, 503, 504].includes(response.status)) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 30000) // 지수 백오프 (최대 30초)
        console.log(`⚠️  Claude API ${response.status} 에러 (시도 ${attempt}/${maxRetries}). ${waitTime/1000}초 후 재시도...`)
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
      }

      // 다른 에러는 즉시 실패
      throw new Error(`Claude API 오류: ${response.status} ${response.statusText}`)

    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      
      // 네트워크 에러인 경우에만 재시도
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 30000)
        console.log(`🌐 네트워크 에러 (시도 ${attempt}/${maxRetries}). ${waitTime/1000}초 후 재시도...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }
      
      throw error
    }
  }
}

// Unsplash에서 관련 이미지 검색
async function getUnsplashImage(keyword: string) {
  try {
    const searchKeywords = [
      'programming', 'coding', 'developer', 'technology', 'computer',
      'software', 'code', 'tech', 'development', 'digital'
    ]
    const randomKeyword = searchKeywords[Math.floor(Math.random() * searchKeywords.length)]
    
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(randomKeyword)}&per_page=10&orientation=landscape`, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    })

    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const randomImage = data.results[Math.floor(Math.random() * data.results.length)]
      return {
        url: randomImage.urls.regular,
        alt: randomImage.alt_description || `${randomKeyword} 관련 이미지`,
        photographer: randomImage.user.name,
        photographerUrl: randomImage.user.links.html,
        unsplashUrl: randomImage.links.html
      }
    }
    
    // 기본 이미지 반환
    return {
      url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      alt: '개발 관련 이미지',
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com',
      unsplashUrl: 'https://unsplash.com'
    }
  } catch (error) {
    console.warn('이미지 검색 실패, 기본 이미지 사용:', error)
    return {
      url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      alt: '개발 관련 이미지',
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com',
      unsplashUrl: 'https://unsplash.com'
    }
  }
}

// 광고 배치 함수 (콘텐츠 길이에 따라)
function insertAds(content: string) {
  const lines = content.split('\n')
  const totalLines = lines.length
  
  // 3개 광고 배치: 상단(15%), 중앙(50%), 하단(85%)
  const adPositions = [
    Math.floor(totalLines * 0.15),
    Math.floor(totalLines * 0.50),
    Math.floor(totalLines * 0.85)
  ]
  
  const adCode = `
<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>
`

  // 뒤에서부터 삽입 (인덱스 변화 방지)
  for (let i = adPositions.length - 1; i >= 0; i--) {
    const position = adPositions[i]
    if (position < lines.length) {
      lines.splice(position, 0, adCode)
    }
  }
  
  return lines.join('\n')
}

// 포스트 생성 프롬프트
function generatePostPrompt(topic: string, category: string, date: string) {
  return `당신은 인기 기술 블로그 "응명 로그"의 베테랑 작가이자 개발자입니다.
수많은 독자가 구독하는 블로그에서 ${topic}에 대한 고품질, SEO 최적화 포스트를 작성하세요.

[요구 명세서]
- 미션: ${topic}
- 카테고리: ${category}  
- 날짜: ${date}

[하드 규칙]
1) 전체 길이: 2,500~3,500자(요구 충족 안 되면 이어서 작성)
2) 마크다운 요소 필수: H2/H3, 목록, 표, 인용구, 코드블록, 이미지 2장 이상(캡션 포함)
3) SEO 키워드(자연스럽게 최소 6회 이상 등장):
   - Claude Code, MCP 자동화, Next.js 블로그 API, 실시간 배포, GitHub Actions, TypeScript
4) 광고/배너/이미지 자리표시자는 아래 형식만 사용:
   - <div data-slot="ad" data-pos="top"></div>
   - <div data-slot="ad" data-pos="middle"></div>
   - <div data-slot="ad" data-pos="bottom"></div>
   - ![이미지 캡션](https://source.unsplash.com/featured/?server,cloud)
5) "실수→해결" 표는 반드시 포함(2행 이상)
6) 마지막 줄에 반드시 추가:
   - 이 포스트는 ${date}에 작성되었습니다.
   - 💬 **여러분의 경험을 댓글로 공유해주세요!**

[글 구조]
## 🚀 제목(클릭유도형)
- 숫자/감정/호기심 포함 (예: "TOP 7…", "완전 정복", "200% 향상", "비밀", "꿀팁")

<div data-slot="ad" data-pos="top"></div>

## 도입부(훅)
- 문제 제기 + 독자가 얻을 이익 + 한 문장 약속

## 섹션 1: 핵심 개념과 중요성
- 개념 쉬운 설명 + 왜 중요한지(현업 사례 1개)

## 섹션 2: 단계별 실행 가이드(번호 리스트로)
1. MCP 서버/라우팅 설계(Next.js 14, App Router)
2. API 키 보안(.env, 런타임 분리)
3. GitHub Actions CRON 스케줄링(예시 cron 표현)
4. 배포 및 실시간 검증(건강 체크 엔드포인트)

![MCP 서버 구성도](https://source.unsplash.com/featured/?server,cloud)
*캡션: "MCP 서버 구성 및 배포 흐름"*

## 섹션 3: 실전 예시와 코드
\`\`\`typescript
export async function POST(req: NextRequest) {
  const { method, params } = await req.json();
  if (method === "tools/call") {
    return handleToolCall(params.name, params.arguments);
  }
  return NextResponse.json({ error: "Unknown method" });
}
\`\`\`

코드 설명 3줄 이내 + 결과 스크린샷 설명(텍스트 묘사)

<div data-slot="ad" data-pos="middle"></div>

## 섹션 4: 고급 팁 & 숨은 기능(⚡️)
- ⚡️ 지수적 백오프 재시도 예시
- ⚡️ Strict SSL/TS strict 모드 체크리스트
- ⚡️ 중복 포스팅 방지 전략(컨텐츠 해시/슬러그 잠금)

## 섹션 5: 흔한 실수와 해결책(표)
| ❌ 실수 | ✅ 해결책 |
|---------|-----------|
| API 키 하드코딩 | .env 분리 + 빌드/런타임 분리 |
| 무한 API 호출 | 지수적 백오프 + 최대 재시도 제한 |
| SSL 검증 미적용 | Strict SSL 활성화 + 실패 시 즉시 알림 |

![빌드 성공 로그](https://source.unsplash.com/featured/?terminal,coding)
*캡션: "빌드 성공 로그 샘플"*

## 마무리(CTA)
- 핵심 요약(3~5 포인트)
- 다음 액션: 코드 따라하기/레포 별칭/구독 유도
- 댓글 유도 한 줄

<div data-slot="ad" data-pos="bottom"></div>

이 포스트는 ${date}에 작성되었습니다.
💬 **여러분의 경험을 댓글로 공유해주세요!**

이제 ${topic}에 대해 위 하드 규칙을 모두 준수하여 작성해주세요! 🚀`
}

// 폴백 포스트 생성 (Claude API 실패 시 사용)
function generateFallbackPost(topic: string, category: string, date: string) {
  const fallbackTemplates = {
    '개발': {
      title: `🚀 ${topic}: 실무에서 바로 써먹는 핵심 가이드`,
      content: `# 🚀 ${topic}: 실무에서 바로 써먹는 핵심 가이드

![개발 관련 이미지](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800)
*Photo by [Luca Bravo](https://unsplash.com/@lucabravo) on [Unsplash](https://unsplash.com)*

안녕하세요, min.log 독자 여러분! 오늘은 **${topic}**에 대해 이야기해보려고 합니다.

## 🎯 왜 이 주제가 중요한가?

현업에서 일하다 보면 ${topic}는 피할 수 없는 주제입니다. 많은 개발자들이 이 부분에서 어려움을 겪고 있는데, 오늘 제가 실무 경험을 바탕으로 실용적인 해결책을 제시해드리겠습니다.

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 💡 핵심 포인트 3가지

### 1. 기초 이해하기
먼저 ${topic}의 기본 개념을 정확히 이해하는 것이 중요합니다. 많은 개발자들이 급하게 구현부터 시작하다가 나중에 더 큰 문제에 직면하게 됩니다.

### 2. 실무 적용 방법
이론만으로는 부족합니다. 실제 프로젝트에서 어떻게 적용할 수 있는지, 어떤 점들을 주의해야 하는지 실무 관점에서 접근해보겠습니다.

### 3. 흔한 실수와 해결책
제가 현업에서 겪었던 실수들과 그 해결 과정을 공유합니다. 이를 통해 여러분은 같은 실수를 반복하지 않으실 수 있을 것입니다.

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 🛠️ 실전 가이드

### 단계별 접근법

1. **분석 단계**: 현재 상황을 정확히 파악하기
2. **계획 단계**: 목표 설정과 로드맵 작성
3. **실행 단계**: 단계별 구현과 테스트
4. **검증 단계**: 결과 분석과 개선점 도출

### 추천 도구 및 리소스

현업에서 실제로 사용하고 있는 도구들과 유용한 리소스들을 소개합니다. 이들을 활용하면 효율성을 크게 높일 수 있습니다.

## 🎯 마무리

${topic}는 처음에는 복잡해 보일 수 있지만, 체계적으로 접근하면 충분히 마스터할 수 있습니다. 가장 중요한 것은 꾸준한 학습과 실습입니다.

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

### 💡 다음 단계

1. 오늘 배운 내용을 실제 프로젝트에 적용해보세요
2. 작은 것부터 시작해서 점진적으로 확장하세요
3. 다른 개발자들과 경험을 공유하세요

---

이 포스트는 ${date}에 작성되었습니다.

💬 **여러분의 경험을 댓글로 공유해주세요!** ${topic}와 관련해서 어떤 경험이나 팁이 있으시면 언제든 댓글로 남겨주세요. 함께 배워나가요! 🚀`
    },
    'MCP·에이전트': {
      title: `🤖 ${topic}: AI 시대 개발자의 필수 스킬`,
      content: `# 🤖 ${topic}: AI 시대 개발자의 필수 스킬

![AI 에이전트 이미지](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800)
*Photo by [Alex Knight](https://unsplash.com/@agk42) on [Unsplash](https://unsplash.com)*

AI가 개발 현장을 빠르게 변화시키고 있습니다. 오늘은 **${topic}**에 대해 심도 있게 다뤄보겠습니다.

## 🔥 AI 에이전트의 혁신

요즘 개발 환경에서 AI 에이전트는 더 이상 선택이 아닌 필수가 되었습니다. ${topic}는 특히 생산성 향상에 큰 도움을 줄 수 있는 분야입니다.

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 💡 실무 적용 사례

### 1. 자동화 효과
제가 실제로 ${topic}를 적용한 프로젝트에서는 다음과 같은 효과를 보았습니다:
- 반복 작업 시간 80% 단축
- 오류 발생률 60% 감소
- 코드 품질 향상

### 2. 구현 과정
실제 구현 과정에서 중요한 포인트들을 공유합니다:
- 명확한 목표 설정
- 단계별 접근
- 지속적인 개선

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 🚀 시작하는 방법

### 초보자를 위한 가이드

1. **기본 개념 이해**: ${topic}의 핵심 원리 파악
2. **작은 프로젝트로 시작**: 간단한 자동화부터 시작
3. **점진적 확장**: 성공 경험을 바탕으로 범위 확대
4. **커뮤니티 활용**: 다른 개발자들과 경험 공유

### 추천 리소스

- 공식 문서와 튜토리얼
- 실무 사례를 담은 블로그 포스트
- 개발자 커뮤니티 활동
- 오픈소스 프로젝트 참여

## 🎯 미래 전망

${topic} 분야는 계속해서 발전하고 있습니다. 지금 시작한다면 미래에 큰 경쟁력을 갖게 될 것입니다.

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

---

이 포스트는 ${date}에 작성되었습니다.

💬 **여러분의 AI 에이전트 경험을 공유해주세요!** ${topic}와 관련해서 궁금한 점이나 경험담이 있으시면 댓글로 남겨주세요! 🤖`
    },
    '학습': {
      title: `📚 ${topic}: 효율적인 학습 전략 가이드`,
      content: `# 📚 ${topic}: 효율적인 학습 전략 가이드

![학습 이미지](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)
*Photo by [Green Chameleon](https://unsplash.com/@craftedbygc) on [Unsplash](https://unsplash.com)*

개발자에게 지속적인 학습은 필수입니다. 오늘은 **${topic}**에 대해 효과적인 학습 방법을 공유하겠습니다.

## 🎯 학습의 중요성

기술이 빠르게 변화하는 IT 업계에서 ${topic}는 개발자의 경쟁력을 좌우하는 중요한 요소입니다.

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 💡 효과적인 학습 방법

### 1. 체계적 접근
무작정 시작하기보다는 체계적인 계획을 세우는 것이 중요합니다:
- 현재 수준 파악
- 목표 설정
- 학습 로드맵 작성
- 주기적 검토

### 2. 실습 중심 학습
이론만으로는 부족합니다. 실제 프로젝트를 통해 학습한 내용을 적용해보세요:
- 개인 프로젝트 진행
- 오픈소스 기여
- 스터디 그룹 참여

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 🛠️ 추천 학습 리소스

### 온라인 플랫폼
- 공식 문서와 튜토리얼
- 온라인 강의 플랫폼
- 개발자 블로그와 유튜브
- 기술 컨퍼런스 영상

### 오프라인 활동
- 개발자 밋업 참여
- 기술 컨퍼런스 참석
- 스터디 그룹 활동
- 멘토링 프로그램

## 🚀 학습 효율 높이기

### 시간 관리 전략
바쁜 일상 속에서도 꾸준히 학습할 수 있는 방법:
- 출퇴근 시간 활용
- 점심시간 미니 세션
- 주말 집중 학습
- 일일 15분 학습

### 동기 유지 방법
장기간 학습을 지속하기 위한 팁:
- 작은 목표 설정
- 성취감 느끼기
- 커뮤니티 참여
- 학습 일지 작성

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 📈 학습 성과 측정

학습의 효과를 확인하는 방법:
- 정기적인 자기 평가
- 프로젝트 완성도 측정
- 동료 개발자와 토론
- 기술 면접 연습

---

이 포스트는 ${date}에 작성되었습니다.

💬 **여러분의 학습 경험을 공유해주세요!** ${topic} 학습과 관련해서 어떤 방법이 효과적이었는지 댓글로 알려주세요! 📚`
    },
    '일상': {
      title: `☕ ${topic}: 개발자의 건강한 라이프스타일`,
      content: `# ☕ ${topic}: 개발자의 건강한 라이프스타일

![일상 이미지](https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800)
*Photo by [Brooke Cagle](https://unsplash.com/@brookecagle) on [Unsplash](https://unsplash.com)*

개발자의 삶은 코딩만으로 이루어지지 않습니다. 오늘은 **${topic}**에 대해 이야기해보겠습니다.

## 🌱 균형 잡힌 개발자 되기

장시간 모니터 앞에서 보내는 개발자들에게 ${topic}는 매우 중요한 주제입니다. 건강한 몸과 마음이 있어야 좋은 코드도 나올 수 있습니다.

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 💪 개발자를 위한 실용적 조언

### 1. 건강 관리
개발자가 특히 주의해야 할 건강 관리 포인트:
- 올바른 자세 유지하기
- 정기적인 스트레칭
- 눈 건강 관리
- 충분한 수면

### 2. 스트레스 관리
업무 스트레스를 건강하게 해소하는 방법:
- 취미 활동 찾기
- 운동 루틴 만들기
- 명상과 휴식
- 사회적 관계 유지

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 🎯 워라밸 찾기

### 경계 설정하기
업무와 개인 시간의 명확한 구분:
- 퇴근 후 알림 끄기
- 주말 완전 휴식
- 개인 시간 확보
- 가족과의 시간

### 효율적인 시간 관리
제한된 시간을 최대한 활용하는 방법:
- 우선순위 정하기
- 시간 블록 활용
- 멀티태스킹 피하기
- 충분한 휴식

## 🌟 개인 성장과 발전

### 지속 가능한 개발자 되기
번아웃 없이 오래 개발할 수 있는 방법:
- 적절한 도전과 휴식
- 새로운 경험 쌓기
- 네트워킹 활동
- 장기적 목표 설정

<div style="margin: 2rem 0; text-align: center;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>

## 💡 실생활 팁

일상에서 바로 적용할 수 있는 실용적인 팁들:
- 아침 루틴 만들기
- 건강한 식습관
- 규칙적인 운동
- 취미 활동 즐기기

---

이 포스트는 ${date}에 작성되었습니다.

💬 **여러분의 라이프스타일을 공유해주세요!** ${topic}와 관련해서 어떤 노하우나 경험이 있으시면 댓글로 나눠주세요! ☕`
    }
  }

  const template = fallbackTemplates[category as keyof typeof fallbackTemplates] || fallbackTemplates['개발']
  
  return {
    title: template.title,
    content: template.content,
    summary: `${topic}에 대한 실용적이고 유용한 가이드입니다. 현업 경험을 바탕으로 한 실전 팁과 노하우를 담았습니다.`
  }
}

// 메인 함수
async function generateDailyPostWithClaude() {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]
  const slug = `daily-${dateStr}`
  
  console.log(`📝 Claude 기반 자동 포스트 생성 시작...`)
  console.log(`   날짜: ${dateStr}`)
  console.log(`   슬러그: ${slug}`)

  // 중복 포스팅 방지: 오늘 날짜의 포스트가 이미 있는지 확인
  try {
    console.log('🔍 중복 포스팅 체크 중...')
    const checkResponse = await fetch('https://mcp.eungming.com/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `check-${slug}`,
        method: 'tools/call',
        params: {
          name: 'post_get',
          arguments: { slug }
        }
      })
    })
    
    const checkResult = await checkResponse.json()
    
    // 포스트가 이미 존재하는 경우
    if (!checkResult.error) {
      console.log('✅ 오늘 포스트가 이미 존재합니다. 종료합니다.')
      console.log(`   기존 포스트: ${slug}`)
      return true // 성공으로 처리 (에러가 아님)
    }
    
    console.log('✅ 중복 체크 완료. 새 포스트 생성을 진행합니다.')
    
  } catch (error) {
    console.log('⚠️  중복 체크 실패, 포스트 생성을 계속 진행합니다.')
    console.log(`   체크 에러: ${(error as Error).message}`)
  }
  
  // 날짜 기반으로 주제 선택
  const { category, topic } = getTopicByDate(today)
  
  console.log(`   주제: ${topic}`)
  console.log(`   카테고리: ${category}`)

  try {
    // 관련 이미지 검색
    console.log('🖼️ 관련 이미지 검색 중...')
    const featuredImage = await getUnsplashImage(topic)
    
    let title: string
    let content: string
    let summary: string
    
    try {
      // Claude API로 포스트 내용 생성 시도
      console.log('🤖 Claude API로 포스트 생성 시도 중...')
      const prompt = generatePostPrompt(topic, category, dateStr)
      content = await callClaudeAPI(prompt)
      
      // 메인 이미지를 포스트 상단에 추가
      const imageMarkdown = `![${featuredImage.alt}](${featuredImage.url})
*Photo by [${featuredImage.photographer}](${featuredImage.photographerUrl}) on [Unsplash](${featuredImage.unsplashUrl})*

`
      
      // 첫 번째 제목 다음에 이미지 삽입
      content = content.replace(/^(#\s+.+)$/m, `$1\n\n${imageMarkdown}`)
      
      // 제목 추출 (첫 번째 # 제목)
      const titleMatch = content.match(/^#\s+(.+)$/m)
      title = titleMatch ? titleMatch[1] : `${dateStr} - ${topic}`
      
      summary = `${topic}에 대한 완벽 가이드! 실무에서 바로 활용할 수 있는 꿀팁과 노하우를 담았습니다.`
      
      console.log('✅ Claude API 포스트 생성 성공!')
      
    } catch (claudeError) {
      // Claude API 실패 시 폴백 포스트 사용
      console.log('⚠️  Claude API 실패, 폴백 포스트 사용...')
      console.log(`   Claude 에러: ${(claudeError as Error).message}`)
      
      const fallbackPost = generateFallbackPost(topic, category, dateStr)
      title = fallbackPost.title
      content = fallbackPost.content
      summary = fallbackPost.summary
      
      // 메인 이미지를 폴백 포스트에도 추가
      const imageMarkdown = `![${featuredImage.alt}](${featuredImage.url})
*Photo by [${featuredImage.photographer}](${featuredImage.photographerUrl}) on [Unsplash](https://unsplash.com)*

`
      content = content.replace(/^(#\s+.+)$/m, `$1\n\n${imageMarkdown}`)
      
      console.log('✅ 폴백 포스트 생성 완료!')
    }
    
    // 광고 배치 (콘텐츠 길이가 충분할 때만)
    if (content.length > 1500) {
      console.log('📢 광고 배치 중...')
      content = insertAds(content)
    }

    console.log('📊 최종 포스트 정보:')
    console.log(`   제목: ${title}`)
    console.log(`   내용 길이: ${content.length}자`)
    console.log(`   이미지: ${featuredImage.url}`)
    console.log(`   광고 삽입: ${content.length > 1500 ? '✅' : '❌ (글이 너무 짧음)'}`)

    // MCP 서버에 포스트 저장
    console.log('💾 MCP 서버에 포스트 저장 중...')
    const mcpResponse = await fetch('https://mcp.eungming.com/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `claude-auto-${dateStr}`,
        method: 'tools/call',
        params: {
          name: 'post_save_draft',
          arguments: {
            slug,
            title,
            content,
            summary,
            category
          }
        }
      })
    })

    const mcpResult = await mcpResponse.json()
    
    if (mcpResult.error) {
      console.error('❌ MCP 저장 실패:', mcpResult.error)
      return false
    }

    console.log('✅ MCP 저장 성공!')
    console.log('   결과:', JSON.stringify(mcpResult, null, 2))
    
    // 자동 발행 처리
    console.log('📢 포스트 자동 발행 중...')
    
    const publishResponse = await fetch('https://mcp.eungming.com/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `publish-${dateStr}`,
        method: 'tools/call',
        params: {
          name: 'post_publish',
          arguments: {
            slug,
            publishedAt: new Date().toISOString()
          }
        }
      })
    })

    const publishResult = await publishResponse.json()
    
    if (publishResult.error) {
      console.error('❌ 자동 발행 실패:', publishResult.error)
      console.log('⚠️  포스트는 초안 상태로 저장되었습니다.')
      return true // 저장은 성공했으므로 true 반환
    }

    console.log('🎉 포스트 자동 발행 완료!')
    console.log('   발행 결과:', JSON.stringify(publishResult, null, 2))
    return true

  } catch (error) {
    console.error('❌ 오류 발생:', error)
    return false
  }
}

// 스크립트 실행
if (require.main === module) {
  generateDailyPostWithClaude()
    .then(success => {
      if (success) {
        console.log('🎉 Claude 기반 자동 포스트 생성 및 발행 완료!')
        process.exit(0)
      } else {
        console.log('💥 Claude 기반 자동 포스트 생성 실패!')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 예상치 못한 오류:', error)
      process.exit(1)
    })
}

export { generateDailyPostWithClaude, getTopicByDate, callClaudeAPI }
