import { z } from 'zod'

// 포스트 주제 템플릿
const postTopics = [
  {
    category: '개발',
    topics: [
      '최신 개발 트렌드',
      '코딩 팁과 노하우',
      '개발 도구 소개',
      '프로그래밍 언어 비교',
      '개발 환경 설정',
      '디버깅 기법',
      '코드 리뷰 방법',
      '테스트 주도 개발',
      '클린 코드 작성법',
      '성능 최적화 기법'
    ]
  },
  {
    category: 'MCP·에이전트',
    topics: [
      'MCP 활용 사례',
      'AI 에이전트 개발',
      '자동화 스크립트',
      'Claude 활용법',
      'Cursor AI 기능',
      'AI 코딩 도구',
      '프롬프트 엔지니어링',
      'AI와 협업하는 방법',
      '자동화 워크플로우',
      'AI 에이전트 최적화'
    ]
  },
  {
    category: '학습',
    topics: [
      '새로운 기술 학습',
      '온라인 강의 추천',
      '책 리뷰',
      '학습 방법론',
      '기술 문서 작성법',
      '지식 관리 시스템',
      '학습 계획 수립',
      '기술 블로그 운영',
      '커뮤니티 참여',
      '멘토링 경험'
    ]
  },
  {
    category: '일상',
    topics: [
      '개발자 일상',
      '원격 근무 경험',
      '워라밸 관리',
      '건강 관리 팁',
      '취미 생활',
      '여행 후기',
      '음식 추천',
      '영화/드라마 리뷰',
      '운동 루틴',
      '명상과 마음챙김'
    ]
  }
]

// 랜덤 주제 선택
function getRandomTopic() {
  const randomCategory = postTopics[Math.floor(Math.random() * postTopics.length)]
  const randomTopic = randomCategory.topics[Math.floor(Math.random() * randomCategory.topics.length)]
  
  return {
    category: randomCategory.category,
    topic: randomTopic
  }
}

// 날짜 기반 주제 선택 (같은 날짜에는 같은 주제)
function getTopicByDate(date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const categoryIndex = dayOfYear % postTopics.length
  const category = postTopics[categoryIndex]
  const topicIndex = dayOfYear % category.topics.length
  
  return {
    category: category.category,
    topic: category.topics[topicIndex]
  }
}

// 포스트 내용 생성
function generatePostContent(topic: string, category: string, date: string) {
  const templates = {
    '개발': `오늘은 ${topic}에 대해 이야기해보겠습니다.

## ${topic}

${topic}는 개발자라면 누구나 관심을 가져야 할 중요한 주제입니다. 

### 주요 포인트
- 첫 번째 포인트
- 두 번째 포인트  
- 세 번째 포인트

### 실제 적용 사례
실제 프로젝트에서 어떻게 활용할 수 있는지 살펴보겠습니다.

### 마무리
${topic}에 대한 이해를 바탕으로 더 나은 개발자가 될 수 있을 것입니다.

---
*이 포스트는 ${date}에 자동으로 생성되었습니다.*`,

    'MCP·에이전트': `오늘은 ${topic}에 대해 알아보겠습니다.

## ${topic}

AI 시대에 ${topic}는 필수적인 스킬이 되었습니다.

### 왜 중요한가?
- AI와의 협업 능력 향상
- 업무 효율성 증대
- 새로운 가능성 창출

### 실제 활용법
구체적인 사용 방법과 팁을 공유합니다.

### 향후 전망
앞으로 어떻게 발전할지 예측해봅니다.

---
*이 포스트는 ${date}에 자동으로 생성되었습니다.*`,

    '학습': `오늘의 학습 주제: ${topic}

## ${topic}

지속적인 학습은 개발자의 핵심 역량입니다.

### 학습 목표
- 명확한 목표 설정
- 체계적인 학습 계획
- 실습을 통한 이해

### 추천 자료
관련된 좋은 자료들을 소개합니다.

### 학습 팁
효과적인 학습 방법을 공유합니다.

---
*이 포스트는 ${date}에 자동으로 생성되었습니다.*`,

    '일상': `오늘의 일상 이야기: ${topic}

## ${topic}

개발자의 일상도 재미있게 기록해봅니다.

### 오늘의 경험
${topic}에 대한 개인적인 경험을 공유합니다.

### 느낀 점
이번 경험을 통해 얻은 인사이트입니다.

### 추천 사항
비슷한 경험을 하고 싶은 분들을 위한 조언입니다.

---
*이 포스트는 ${date}에 자동으로 생성되었습니다.*`
  }

  return templates[category as keyof typeof templates] || templates['일상']
}

// 메인 함수
async function generateDailyPost() {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]
  const slug = `daily-${dateStr}`
  
  // 날짜 기반으로 주제 선택
  const { category, topic } = getTopicByDate(today)
  const title = `${dateStr} - ${topic}`
  const content = generatePostContent(topic, category, dateStr)
  const summary = `${topic}에 대한 이야기입니다.`

  console.log(`📝 자동 포스트 생성 시작...`)
  console.log(`   날짜: ${dateStr}`)
  console.log(`   제목: ${title}`)
  console.log(`   카테고리: ${category}`)
  console.log(`   슬러그: ${slug}`)

  try {
    // MCP 서버에 포스트 생성 요청
    const response = await fetch('https://mcp.eungming.com/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `auto-${dateStr}`,
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

    const result = await response.json()
    
    if (result.error) {
      console.error('❌ 포스트 생성 실패:', result.error)
      return false
    }

    console.log('✅ 포스트 생성 성공!')
    console.log('   결과:', JSON.stringify(result, null, 2))
    return true

  } catch (error) {
    console.error('❌ 요청 실패:', error)
    return false
  }
}

// 스크립트 실행
if (require.main === module) {
  generateDailyPost()
    .then(success => {
      if (success) {
        console.log('🎉 자동 포스트 생성 완료!')
        process.exit(0)
      } else {
        console.log('💥 자동 포스트 생성 실패!')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 예상치 못한 오류:', error)
      process.exit(1)
    })
}

export { generateDailyPost, getTopicByDate, generatePostContent }
