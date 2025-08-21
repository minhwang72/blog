import { z } from 'zod'

// SSL 인증서 검증 비활성화 (로컬 개발용)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

// Claude API 설정
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'

// Unsplash API 설정 (무료 이미지 제공)
const UNSPLASH_ACCESS_KEY = 'X3w-YEQi7QJsxHWt8J4xvb6F_zQsdfWBzY7WG8V5GEI' // 공개 API 키

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

// Claude API 호출
async function callClaudeAPI(prompt: string) {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY 환경변수가 설정되지 않았습니다.')
  }

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

  if (!response.ok) {
    throw new Error(`Claude API 오류: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.content[0].text
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
  return `당신은 인기 기술 블로그 "응명 로그"의 베테랑 작가입니다. 수많은 개발자들이 구독하는 블로그에서 ${topic}에 대한 바이럴 포스트를 작성해주세요.

**🎯 미션**: ${topic}
**📂 카테고리**: ${category}
**📅 날짜**: ${date}

**🔥 바이럴 콘텐츠 요구사항**:
1. **클릭을 유도하는 제목**: 숫자, 감정 단어, 호기심 자극 (예: "TOP 10", "완전 정복", "200% 향상", "비밀", "꿀팁")
2. **콘텐츠 길이**: 2000-3000자의 풍부한 내용
3. **SEO 최적화**: 검색되기 쉬운 키워드 자연스럽게 포함
4. **실용성 극대화**: 즉시 적용 가능한 구체적인 팁과 가이드
5. **개인 스토리**: "제가 1년간 사용해본 결과", "실제 프로젝트에서 경험한" 등 개인 경험담
6. **시각적 요소**: 마크다운 형식, 이모지 적절 사용, 구조화된 섹션

**📖 글 구조 (바이럴 최적화)**:

**도입부 (훅)**: 
- 충격적인 사실이나 흥미로운 질문으로 시작
- 독자의 고민을 정확히 찌르는 문제 제기
- "이 포스트를 다 읽으면..." 혜택 명시

**본문 (가치 제공)**:
- **섹션 1**: 핵심 개념 쉽게 설명 + 왜 중요한지
- **섹션 2**: 단계별 실행 가이드 (번호 매기기)
- **섹션 3**: 실전 예시와 코드 (코드 블록 활용)
- **섹션 4**: 고급 팁과 숨겨진 기능들
- **섹션 5**: 흔한 실수와 해결책

**마무리 (액션 유도)**:
- 핵심 내용 요약 (3-5개 포인트)
- 다음 액션 스텝 제안
- 댓글로 경험 공유 유도

**🎨 스타일 가이드**:
- **톤**: 친근하지만 전문적, 마치 동료 개발자가 조언하는 느낌
- **언어**: 은어나 전문용어는 쉽게 설명, 실무 경험 녹여내기
- **구조**: 헤딩, 리스트, 코드 블록, 인용구 등 다양한 마크다운 요소 활용
- **참여**: "여러분은 어떤 방법을 사용하시나요?" 같은 참여 유도 문구

**💡 특별 지침**:
- 개발자들이 실제로 검색할 만한 키워드들을 자연스럽게 포함
- 구체적인 숫자와 데이터로 신뢰성 높이기
- 단순 이론보다는 "바로 써먹을 수 있는" 실용적 내용 중심
- 개인적 실패담과 성공담으로 진정성 더하기

**🏁 마무리 필수사항**:
- 포스트 끝에 "이 포스트는 ${date}에 작성되었습니다." 추가
- 마지막에 "💬 **여러분의 경험을 댓글로 공유해주세요!**" 추가

이제 ${topic}에 대해 개발자들이 열광할 바이럴 포스트를 작성해주세요! 🚀`
}

// 메인 함수
async function generateDailyPostWithClaude() {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]
  const slug = `daily-${dateStr}`
  
  // 날짜 기반으로 주제 선택
  const { category, topic } = getTopicByDate(today)
  
  console.log(`📝 Claude 기반 자동 포스트 생성 시작...`)
  console.log(`   날짜: ${dateStr}`)
  console.log(`   주제: ${topic}`)
  console.log(`   카테고리: ${category}`)
  console.log(`   슬러그: ${slug}`)

  try {
    // 관련 이미지 검색
    console.log('🖼️ 관련 이미지 검색 중...')
    const featuredImage = await getUnsplashImage(topic)
    
    // Claude API로 포스트 내용 생성
    console.log('🤖 Claude API 호출 중...')
    const prompt = generatePostPrompt(topic, category, dateStr)
    let content = await callClaudeAPI(prompt)
    
    // 메인 이미지를 포스트 상단에 추가
    const imageMarkdown = `![${featuredImage.alt}](${featuredImage.url})
*Photo by [${featuredImage.photographer}](${featuredImage.photographerUrl}) on [Unsplash](${featuredImage.unsplashUrl})*

`
    
    // 첫 번째 제목 다음에 이미지 삽입
    content = content.replace(/^(#\s+.+)$/m, `$1\n\n${imageMarkdown}`)
    
    // 광고 배치 (콘텐츠 길이가 충분할 때만)
    if (content.length > 1500) {
      console.log('📢 광고 배치 중...')
      content = insertAds(content)
    }
    
    // 제목 추출 (첫 번째 # 제목)
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : `${dateStr} - ${topic}`
    
    // 요약 생성 (더 매력적으로)
    const summary = `${topic}에 대한 완벽 가이드! 실무에서 바로 활용할 수 있는 꿀팁과 노하우를 담았습니다.`

    console.log('✅ Claude 포스트 생성 완료!')
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
        console.log('🎉 Claude 기반 자동 포스트 생성 완료!')
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
