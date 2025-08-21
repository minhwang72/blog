import { z } from 'zod'

// SSL 인증서 검증 비활성화 (로컬 개발용)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

// Claude API 설정
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'

// 포스트 주제 카테고리
const postCategories = [
  {
    name: '개발',
    topics: [
      '최신 개발 트렌드와 기술 동향',
      '실무에서 유용한 코딩 팁',
      '개발 생산성 향상 도구',
      '프로그래밍 언어 비교 분석',
      '개발 환경 최적화',
      '효과적인 디버깅 전략',
      '코드 리뷰 베스트 프랙티스',
      '테스트 주도 개발 실전',
      '클린 코드 작성 원칙',
      '성능 최적화 기법'
    ]
  },
  {
    name: 'MCP·에이전트',
    topics: [
      'MCP 활용 실전 사례',
      'AI 에이전트 개발 가이드',
      '자동화 스크립트 작성법',
      'Claude 활용 최적화',
      'Cursor AI 고급 기능',
      'AI 코딩 도구 비교',
      '프롬프트 엔지니어링 기법',
      'AI와 협업하는 방법론',
      '자동화 워크플로우 설계',
      'AI 에이전트 성능 최적화'
    ]
  },
  {
    name: '학습',
    topics: [
      '새로운 기술 학습 전략',
      '온라인 강의 및 자료 추천',
      '개발자 필독 도서 리뷰',
      '효과적인 학습 방법론',
      '기술 문서 작성 가이드',
      '개인 지식 관리 시스템',
      '체계적인 학습 계획 수립',
      '기술 블로그 운영 노하우',
      '개발자 커뮤니티 참여',
      '멘토링 경험 공유'
    ]
  },
  {
    name: '일상',
    topics: [
      '개발자의 건강한 일상',
      '원격 근무 환경 최적화',
      '워라밸 균형 맞추기',
      '개발자 건강 관리법',
      '개발자 취미 생활',
      '기술 여행 후기',
      '개발자 음식 문화',
      '기술 관련 영화/드라마',
      '개발자 운동 루틴',
      '명상과 마음챙김'
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

// 포스트 생성 프롬프트
function generatePostPrompt(topic: string, category: string, date: string) {
  return `당신은 기술 블로그 "응명 로그"의 작가입니다. 다음 주제로 고품질의 블로그 포스트를 작성해주세요.

**주제**: ${topic}
**카테고리**: ${category}
**날짜**: ${date}

**요구사항**:
1. 제목은 매력적이고 SEO 친화적으로 작성
2. 내용은 실용적이고 구체적인 정보 포함
3. 개발자들이 실제로 도움을 받을 수 있는 내용
4. 개인적인 경험과 인사이트 포함
5. 마크다운 형식으로 작성
6. 1000-2000자 정도의 적절한 길이
7. 한국어로 작성
8. 포스트 끝에 "이 포스트는 ${date}에 작성되었습니다." 추가

**글의 구조**:
- 매력적인 도입부
- 주요 내용 (2-3개 섹션)
- 실제 적용 사례나 팁
- 마무리 및 다음 단계 제안

**스타일**:
- 친근하고 이해하기 쉬운 톤
- 전문적이면서도 접근 가능한 내용
- 구체적인 예시와 코드 포함 (필요시)

이제 ${topic}에 대한 고품질 블로그 포스트를 작성해주세요.`
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
    // Claude API로 포스트 내용 생성
    console.log('🤖 Claude API 호출 중...')
    const prompt = generatePostPrompt(topic, category, dateStr)
    const content = await callClaudeAPI(prompt)
    
    // 제목 추출 (첫 번째 # 제목)
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : `${dateStr} - ${topic}`
    
    // 요약 생성
    const summary = `${topic}에 대한 상세한 분석과 실용적인 팁을 담은 포스트입니다.`

    console.log('✅ Claude 포스트 생성 완료!')
    console.log(`   제목: ${title}`)
    console.log(`   내용 길이: ${content.length}자`)

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
