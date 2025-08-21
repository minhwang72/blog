// Claude Desktop에서 직접 실행할 수 있는 자동 포스트 생성 스크립트

// 포스트 주제 목록
const dailyTopics = [
  {
    name: '개발',
    topics: [
      '오늘의 개발 팁',
      '코딩 생산성 향상법',
      '개발 도구 활용법',
      '프로그래밍 언어 트렌드',
      '개발 환경 설정 팁',
      '디버깅 노하우',
      '코드 리뷰 방법',
      '테스트 작성법',
      '클린 코드 원칙',
      '성능 최적화 기법'
    ]
  },
  {
    name: 'MCP·에이전트',
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
    name: '학습',
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
    name: '일상',
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

// 날짜 기반 주제 선택
function getTodayTopic() {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  
  const categoryIndex = dayOfYear % dailyTopics.length
  const category = dailyTopics[categoryIndex]
  const topicIndex = dayOfYear % category.topics.length
  
  return {
    category: category.name,
    topic: category.topics[topicIndex],
    date: today.toISOString().split('T')[0]
  }
}

// 메인 함수
async function generateTodayPost() {
  const { category, topic, date } = getTodayTopic()
  const slug = `daily-${date}`
  
  console.log(`📝 오늘의 포스트 정보:`)
  console.log(`   날짜: ${date}`)
  console.log(`   주제: ${topic}`)
  console.log(`   카테고리: ${category}`)
  console.log(`   슬러그: ${slug}`)
  
  // Claude에게 전달할 프롬프트 생성
  const prompt = `오늘은 "${topic}"에 대한 블로그 포스트를 작성해주세요.

**블로그 정보:**
- 블로그명: 응명 로그 (eungming.com)
- 카테고리: ${category}
- 슬러그: ${slug}
- 날짜: ${date}

**요구사항:**
1. 제목은 매력적이고 SEO 친화적으로
2. 실용적이고 구체적인 정보 포함
3. 개발자들이 실제로 도움을 받을 수 있는 내용
4. 개인적인 경험과 인사이트 포함
5. 마크다운 형식으로 작성
6. 1000-2000자 정도의 적절한 길이
7. 한국어로 작성
8. 포스트 끝에 "이 포스트는 ${date}에 작성되었습니다." 추가

**글의 구조:**
- 매력적인 도입부
- 주요 내용 (2-3개 섹션)
- 실제 적용 사례나 팁
- 마무리 및 다음 단계 제안

**스타일:**
- 친근하고 이해하기 쉬운 톤
- 전문적이면서도 접근 가능한 내용
- 구체적인 예시와 코드 포함 (필요시)

이제 "${topic}"에 대한 고품질 블로그 포스트를 작성해주세요.`

  console.log(`\n🤖 Claude에게 전달할 프롬프트:`)
  console.log(`\n${prompt}`)
  
  console.log(`\n💡 이 프롬프트를 Claude에 복사해서 붙여넣고 포스트를 생성한 후,`)
  console.log(`   MCP를 통해 블로그에 저장하세요!`)
  
  return {
    slug,
    category,
    topic,
    date,
    prompt
  }
}

// 스크립트 실행
if (typeof window === 'undefined') {
  generateTodayPost()
    .then(result => {
      console.log('\n✅ 오늘의 포스트 정보 생성 완료!')
    })
    .catch(error => {
      console.error('💥 오류 발생:', error)
    })
}

export { generateTodayPost, getTodayTopic }
