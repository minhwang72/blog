import { z } from 'zod'

// 보안 강화된 fetch 래퍼
async function safeFetch(url: string, options: RequestInit = {}) {
  // GitHub Actions나 개발 환경에서 SSL 문제 해결
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
  const isDev = process.env.NODE_ENV === 'development'
  const needsSSLWorkaround = url.includes('mcp.eungming.com') || url.includes('localhost')
  
  if ((isGitHubActions || isDev) && needsSSLWorkaround) {
    console.log('🔧 SSL 인증서 우회 설정 적용 (GitHub Actions/Dev 환경)')
    const https = await import('https')
    const agent = new https.Agent({ rejectUnauthorized: false })
    
    return fetch(url, {
      ...options,
      // @ts-ignore
      agent: url.startsWith('https:') ? agent : undefined
    })
  }
  
  // 일반 환경에서는 표준 연결 사용
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'User-Agent': 'min-blog-automation/1.0',
    },
  })
}

// Claude API 설정
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'

// 최근 포스트 메타데이터 가져오기
async function getRecentPostsMeta(limit: number = 6) {
  try {
    const response = await safeFetch('https://mcp.eungming.com/mcp', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `recent-posts-${Date.now()}`,
        method: 'tools/call',
        params: {
          name: 'post_list_recent',
          arguments: { limit }
        }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result = await response.json()
    
    if (result.error) {
      console.warn('⚠️ 최근 포스트 가져오기 실패:', result.error.message)
      return []
    }

    // 메타데이터만 추출 (title, slug, summary, keywords, category)
    return result.result?.data?.map((post: any) => ({
      title: post.title,
      slug: post.slug,
      summary: post.summary || '',
      category: post.categoryName || '일반',
      keywords: post.content ? extractKeywords(post.content) : [],
      createdAt: post.createdAt
    })) || []
    
  } catch (error) {
    console.warn('⚠️ 최근 포스트 컨텍스트 가져오기 실패:', error)
    return []
  }
}

// 키워드 추출 함수 (간단한 버전)
function extractKeywords(content: string): string[] {
  const techKeywords = [
    'Next.js', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
    'API', 'REST', 'GraphQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'AWS',
    'Vercel', 'Git', 'GitHub', 'CI/CD', 'TDD', 'MCP', 'Claude', 'AI', 'ML'
  ]
  
  return techKeywords.filter(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  ).slice(0, 5)
}

// 중복률 체크 함수 (3-gram 기반)
function calculateOverlapRate(newContent: string, existingContent: string): number {
  function createTrigrams(text: string): Set<string> {
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
    const trigrams = new Set<string>()
    
    for (let i = 0; i < words.length - 2; i++) {
      trigrams.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
    }
    
    return trigrams
  }
  
  const newTrigrams = createTrigrams(newContent)
  const existingTrigrams = createTrigrams(existingContent)
  
  let intersection = 0
  for (const trigram of Array.from(newTrigrams)) {
    if (existingTrigrams.has(trigram)) {
      intersection++
    }
  }
  
  return intersection / Math.max(1, Math.min(newTrigrams.size, existingTrigrams.size))
}

// 개선된 광고 삽입 함수 (헤딩 기준 + 최소 간격 보장)
function insertAdsSmart(content: string): string {
  const lines = content.split('\n')
  const headingIndices: number[] = []
  
  // H2, H3 헤딩 인덱스 수집
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i]) || /^###\s+/.test(lines[i])) {
      headingIndices.push(i)
    }
  }
  
  const adCode = `
<div style="min-height:280px;margin:3rem 0;padding:1rem;text-align:center;border-radius:8px;background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);">
  <ins class="adsbygoogle"
       style="display:block;width:100%;height:250px;"
       data-ad-client="ca-pub-4467822003966307"
       data-ad-slot="AUTO"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>`

  let adPositions: number[] = []
  
  if (headingIndices.length >= 3) {
    // 헤딩 기준 배치: 첫 번째 헤딩 이후, 중간 헤딩 이후, 마지막 헤딩 이후
    const firstSection = headingIndices[0] + 2  // 첫 헤딩 다음에 2줄 여유
    const midSection = headingIndices[Math.floor(headingIndices.length * 0.5)] + 2
    const lastSection = headingIndices[Math.floor(headingIndices.length * 0.8)] + 2
    
    adPositions = [firstSection, midSection, lastSection]
  } else {
    // 헤딩이 적으면 전체 라인 기준 (기존 방식)
    const total = lines.length
    adPositions = [
      Math.floor(total * 0.2),   // 상단
      Math.floor(total * 0.5),   // 중간
      Math.floor(total * 0.8)    // 하단
    ]
  }
  
  // 최소 간격 보장 (15줄)
  const MIN_GAP = 15
  const finalPositions: number[] = []
  
  for (const pos of adPositions) {
    const safePosition = Math.min(pos, lines.length - 5)
    const isValidPosition = finalPositions.every(p => Math.abs(p - safePosition) >= MIN_GAP)
    
    if (isValidPosition) {
      finalPositions.push(safePosition)
    } else {
      // 간격이 부족하면 MIN_GAP만큼 뒤로 이동
      const adjustedPos = Math.min(lines.length - 5, safePosition + MIN_GAP)
      finalPositions.push(adjustedPos)
    }
  }
  
  // 뒤에서부터 삽입 (인덱스 변화 방지)
  finalPositions.sort((a, b) => b - a).forEach(position => {
    if (position < lines.length && position > 0) {
      // 코드 블록이나 인용구 내부가 아닌지 확인
      if (!lines[position].startsWith('```') && !lines[position].startsWith('>')) {
        lines.splice(position, 0, adCode)
      }
    }
  })
  
  return lines.join('\n')
}

// 개선된 포스트 생성 프롬프트 (컨텍스트 인지 + 자연스러움)
function generateAdvancedPrompt(
  topic: string, 
  category: string, 
  date: string, 
  recentPosts: any[] = []
): string {
  const recentContext = recentPosts.length > 0 
    ? `\n=== 최근 발행된 글들 (연관성 참고) ===\n${recentPosts.map(post => 
        `• "${post.title}" (${post.category}) - ${post.summary}`
      ).join('\n')}\n`
    : ''

  const overlappingTopics = recentPosts
    .filter(post => post.keywords.some((k: string) => topic.includes(k)))
    .map(post => post.title)

  const contextInstruction = overlappingTopics.length > 0
    ? `\n⚠️ 중복 방지: 최근 "${overlappingTopics.join('", "')}"와 겹치는 내용은 피하고, 새로운 관점/업데이트된 정보로 차별화하세요.`
    : ''

  return `당신은 "응명 로그(min.log)"의 시니어 개발자이자 테크니컬 라이터입니다.
한국 현업 개발자들에게 실질적 가치를 전달하는 것이 목표입니다.

${recentContext}

=== 오늘의 주제 ===
📝 주제: "${topic}"
🏷️ 카테고리: ${category}
📅 발행일: ${date}
${contextInstruction}

=== 글쓰기 철학 ===
• 사람이 쓴 것처럼 자연스럽게 (AI 냄새 절대 금지)
• 실무자 관점에서 솔직하고 구체적으로
• 독자의 시간을 아껴주는 실용성 중심
• 과장하지 않되 흥미롭게

=== 필수 준수 사항 ===
✅ 4,000자 이상 (충분한 정보량)
✅ 제목에 날짜 금지, 클릭 유도 요소 포함 (숫자, 감정, 궁금증)
✅ 서두에서 "왜 지금 이 글을 읽어야 하는가" 명확히 제시
✅ Before/After 수치, 구체적 성과 데이터 포함
✅ 따라하기 가능한 step-by-step 가이드
✅ 실무에서 자주 하는 실수 3가지 + 해결책
✅ 마무리에 '다음 단계' 제시 및 댓글 유도

=== 내부링크 활용 ===
${recentPosts.length > 0 ? `최근 글 중 진짜 연관성 높은 2-3개를 본문 중간과 결론부에 자연스럽게 언급:
${recentPosts.slice(0, 3).map(post => `• [[${post.title}]] - ${post.summary}`).join('\n')}` : ''}

=== 구조 템플릿 ===
# [클릭을 유도하는 제목: 실무 관점 + 구체적 성과/숫자]

## 🤔 [주제]를 다시 보게 된 계기

[개인적 경험이나 현업에서 마주친 상황으로 시작 - 300자]
> 한줄 요약: [이 섹션의 핵심을 한 문장으로]

## 📊 현실: 실무에서 만나는 진짜 문제들

[데이터와 수치로 뒷받침된 문제 정의 - 400자]
> 한줄 요약: [문제의 핵심]

## 💡 삽질의 역사: 내가 겪은 시행착오들

### 첫 번째 접근 (실패)
[구체적 상황과 실패 원인 - 300자]

### 두 번째 시도 (개선)  
[학습과 개선 과정 - 300자]

### 최종 해결책 (성공)
[성과 수치와 Before/After - 400자]
> 한줄 요약: [핵심 인사이트]

## 🛠️ 실전 가이드: 따라하기 (복붙 가능)

### Step 1: [구체적 단계명]
\`\`\`typescript
// 실무에서 바로 쓸 수 있는 코드
\`\`\`

### Step 2: [구체적 단계명]
\`\`\`bash
# 명령어나 설정
\`\`\`

### Step 3: [구체적 단계명]
[설명과 주의사항]
> 한줄 요약: [단계별 핵심]

## ⚡ 고수들만 아는 숨은 팁 3가지

### Tip 1: [팁 제목]
[400자 내외로 구체적 팁]

### Tip 2: [팁 제목]  
[400자 내외로 구체적 팁]

### Tip 3: [팁 제목]
[400자 내외로 구체적 팁]

## 🚫 흔한 실수 TOP 3 (내 경험담)

| 실수 | 문제점 | 해결책 | 개선 효과 |
|------|--------|---------|-----------|
| [실수1] | [문제점] | [해결책] | [구체적 수치] |
| [실수2] | [문제점] | [해결책] | [구체적 수치] |
| [실수3] | [문제점] | [해결책] | [구체적 수치] |

## 📈 성과 측정하기

[KPI 설정, 모니터링 방법, 개선 지표 - 300자]
> 한줄 요약: [측정의 핵심]

## 🔗 더 깊이 파고들기

${recentPosts.length > 0 ? `관련해서 이미 다뤘던 내용들:
- [[${recentPosts[0]?.title}]] - ${recentPosts[0]?.summary}
- [[${recentPosts[1]?.title}]] - ${recentPosts[1]?.summary}` : ''}

## 🎯 마무리 & 다음 스텝

### 오늘 배운 것을 실천하려면:
1. [구체적 실행 항목 1]
2. [구체적 실행 항목 2]  
3. [구체적 실행 항목 3]

### 다음에 다룰 심화 주제들:
- [연관 주제 1]
- [연관 주제 2]

---

💬 **실무 경험 공유해주세요!**  
${topic} 관련해서 어떤 경험이나 해결책이 있으시면 댓글로 나눠주세요. 특히 [구체적 질문 1]이나 [구체적 질문 2]에 대한 의견이 궁금합니다! 

📝 *이 글은 ${date}에 작성되었으며, 실무 경험을 바탕으로 정리한 내용입니다.*

=== 출력 규칙 ===
• 한국어로 작성, 존댓말 사용
• 개조식보다는 자연스러운 문장 구성
• 전문용어 사용 시 간단한 설명 첨부  
• 코드는 실제 동작하는 예제로
• '한줄 요약' 블록쿼트(>)는 섹션마다 꼭 포함`
}

// 포스트 주제 카테고리 (트렌드 기반으로 개선)
const postCategories = [
  {
    name: '개발',
    topics: [
      'Next.js 14 App Router 마이그레이션 실전 가이드',
      'TypeScript 5.0 새 기능으로 코드 품질 3배 높이기', 
      'React Server Components 완전 정복 (실무 적용편)',
      'Tailwind CSS 커스터마이징 고급 테크닉',
      'Vercel 배포 최적화로 로딩 속도 50% 개선하기',
      'GitHub Actions 워크플로우 최적화 실전 가이드',
      'API 설계 베스트 프랙티스 2024 (REST vs GraphQL)',
      'Docker 멀티스테이지 빌드로 이미지 크기 70% 줄이기',
      '웹 성능 최적화 체크리스트 (Core Web Vitals 완전 정복)',
      'VS Code 확장 프로그램 개발 A to Z'
    ]
  },
  {
    name: 'MCP·에이전트',
    topics: [
      'Claude MCP 서버 구축 완벽 가이드 (실전 예제)',
      'AI 에이전트 개발 로드맵 2024 (ChatGPT vs Claude)',
      'Cursor IDE와 Claude 연동으로 개발 생산성 200% 증대',
      '실무에 바로 적용하는 프롬프트 엔지니어링 템플릿',
      'GitHub Copilot vs Claude vs Cursor 성능 벤치마크',
      'MCP 프로토콜로 커스텀 도구 만들기 (코드 포함)',
      '자동화 워크플로우 구축: AI 에이전트 실전 활용법',
      'AI 페어 프로그래밍 마스터하기 (효율성 10배 증대)',
      'Claude API 활용한 코드 리뷰 자동화 시스템',
      'ChatGPT 플러그인 vs MCP 서버 비교 분석'
    ]
  },
  {
    name: '학습',
    topics: [
      '신입 개발자를 위한 실무 적응 로드맵 (3개월 완성)',
      '시니어 개발자의 효율적인 기술 학습법 공개',
      '개발자 포트폴리오 만들기 (취업 성공 케이스)',
      '알고리즘 코딩테스트 정복하기 (실전 문제 해결)',  
      '오픈소스 기여 시작하기 (첫 PR까지)',
      '개발자 컨퍼런스 100% 활용 가이드 (네트워킹 포함)',
      '기술 블로그 운영으로 커리어 업그레이드하기',
      '사이드 프로젝트 완주하는 비법 (실패 경험담)',
      '개발자 영어 실력 향상 실전 가이드',
      '멘토링 받기/하기 완벽 가이드 (경험자 조언)'
    ]
  },
  {
    name: '일상',
    topics: [
      '개발자 번아웃 극복기 (실제 경험담)',
      '재택근무 vs 출근 현실적 비교 (2년 경험)',
      '개발자의 건강한 야식 레시피 5가지',  
      '코딩하며 듣기 좋은 플레이리스트 추천',
      '개발자 데스크 셋업 가이드 (예산별)',
      '프로그래머를 위한 운동 루틴 (허리 건강)',
      '개발자 모임 나가기의 장단점 (내향형 관점)',
      '코딩 공부와 취미 생활 균형 잡기',
      '개발자의 독서 습관 만들기 (추천 도서)',
      '주니어 개발자의 첫 이직 경험담'
    ]
  }
]

// 메인 자동 포스트 생성 함수
async function generateDailyPost() {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]
  
  // 이미 오늘 포스트가 있는지 확인
  console.log(`📅 ${dateStr} 자동 포스트 생성 시작...`)
  
  try {
    // 0. 오늘 이미 게시글이 있는지 먼저 확인
    console.log('🔍 오늘 게시글 존재 여부 확인 중...')
    const todayPosts = await getRecentPostsMeta(10) // 최근 10개 확인
    
    const todayPostExists = todayPosts.some((post: any) => {
      const postDate = new Date(post.createdAt).toISOString().split('T')[0]
      return postDate === dateStr
    })
    
    if (todayPostExists) {
      console.log(`✅ 오늘(${dateStr}) 이미 포스트가 작성되어 있습니다. 중지합니다.`)
      console.log('🎯 하루 1개 제한으로 인해 자동 포스팅을 건너뜁니다.')
      return
    }
    
    console.log(`📝 오늘(${dateStr}) 포스트가 없습니다. 새 포스트 생성을 진행합니다.`)
    // 1. 최근 포스트 컨텍스트 가져오기
    console.log('🔍 최근 포스트 컨텍스트 수집 중...')
    const recentPosts = await getRecentPostsMeta(6)
    console.log(`✅ ${recentPosts.length}개 포스트 컨텍스트 수집 완료`)
    
    // 2. 오늘의 주제 선택 (날짜 기반 결정론적)
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    const categoryIndex = dayOfYear % postCategories.length
    const selectedCategory = postCategories[categoryIndex]
    const topicIndex = dayOfYear % selectedCategory.topics.length
    const topic = selectedCategory.topics[topicIndex]
    const category = selectedCategory.name
    
    console.log(`🎯 선택된 주제: "${topic}" (${category})`)
    
    // 3. 중복 체크 (최근 글들과 주제 겹침 확인)
    const duplicateCheck = recentPosts.find((post: any) => 
      post.title.includes(topic.split(' ')[0]) || 
      calculateOverlapRate(topic, post.title) > 0.3
    )
    
    if (duplicateCheck) {
      console.log(`⚠️ 유사한 주제 발견: "${duplicateCheck.title}"`)
      console.log('📝 차별화된 관점으로 프롬프트 조정...')
    }
    
    // 4. Claude에게 포스트 작성 요청
    console.log('🤖 Claude API 호출 중...')
    const prompt = generateAdvancedPrompt(topic, category, dateStr, recentPosts)
    
    const response = await safeFetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 8000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })
    
    if (!response.ok) {
      throw new Error(`Claude API 호출 실패: ${response.status}`)
    }
    
    const claudeResult = await response.json()
    let content = claudeResult.content[0].text
    
    console.log(`📄 포스트 생성 완료 (${content.length}자)`)
    
    // 5. 중복률 최종 검증
    if (recentPosts.length > 0) {
      const avgOverlap = recentPosts
        .map((post: any) => calculateOverlapRate(content, post.title + ' ' + post.summary))
        .reduce((a: number, b: number) => a + b, 0) / recentPosts.length
      
      console.log(`🔍 중복률 검사: ${(avgOverlap * 100).toFixed(1)}%`)
      
      if (avgOverlap > 0.15) {
        console.log('⚠️ 중복률 높음 - 재생성 권장하지만 일단 진행...')
      }
    }
    
    // 6. 스마트 광고 삽입
    console.log('💰 광고 스마트 배치 중...')
    content = insertAdsSmart(content)
    
    // 7. 제목 추출
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : `${topic} 실전 가이드`
    const slug = `auto-${dateStr}-${Math.random().toString(36).substring(7)}`
    
    // 8. 요약문 생성 (첫 번째 문단에서 추출)
    const summaryMatch = content.match(/^[^#\n]+\n\n([^#\n].{50,200})/m)
    const summary = summaryMatch 
      ? summaryMatch[1].replace(/[*_`]/g, '').substring(0, 150) + '...'
      : `${topic}에 대한 실무 중심 가이드입니다.`
    
    console.log(`📝 제목: "${title}"`)
    console.log(`📝 슬러그: "${slug}"`)
    console.log(`📝 요약: "${summary}"`)
    
    // 9. MCP 서버에 포스트 생성 요청
    console.log('🚀 MCP 서버 포스트 생성 요청...')
    const mcpResponse = await safeFetch('https://mcp.eungming.com/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `auto-${dateStr}-${Date.now()}`,
        method: 'tools/call',
        params: {
          name: 'post_save_draft',
          arguments: {
            slug,
            title,
            content,
            summary,
            category,
            published: true,  // 바로 발행
            featuredImage: `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop`
          }
        }
      })
    })
    
    const mcpResult = await mcpResponse.json()
    
    if (mcpResult.error) {
      throw new Error(`MCP 서버 오류: ${mcpResult.error.message}`)
    }
    
    console.log('✅ 포스트 생성 및 발행 완료!')
    console.log('📊 최종 통계:')
    console.log(`   - 글자 수: ${content.length.toLocaleString()}자`)
    console.log(`   - 카테고리: ${category}`)
    console.log(`   - 컨텍스트: ${recentPosts.length}개 포스트 참조`)
    console.log(`   - 광고 배치: 스마트 알고리즘 적용`)
    console.log(`   - 제목: "${title}"`)
    
    return true
    
  } catch (error) {
    console.error('❌ 자동 포스트 생성 실패:', error)
    
    // 오류 상세 정보 로깅
    if (error instanceof Error) {
      console.error(`   - 오류 메시지: ${error.message}`)
      console.error(`   - 스택 트레이스: ${error.stack}`)
    }
    
    return false
  }
}

// 스크립트 실행
if (require.main === module) {
  console.log('🚀 min.log 자동 포스팅 시스템 v2.0 시작')
  console.log('⏰', new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }))
  
  generateDailyPost()
    .then(success => {
      if (success) {
        console.log('\n🎉 자동 포스트 생성 성공!')
        console.log('📈 독자들이 좋아할 만한 고품질 콘텐츠가 준비되었습니다.')
        process.exit(0)
      } else {
        console.log('\n💥 자동 포스트 생성 실패!')
        console.log('🔧 로그를 확인하여 문제를 해결해주세요.')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('\n💥 예상치 못한 오류 발생:', error)
      process.exit(1)
    })
}

export { 
  generateDailyPost, 
  generateAdvancedPrompt, 
  insertAdsSmart,
  getRecentPostsMeta,
  calculateOverlapRate
}