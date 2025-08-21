import { CategoryClassifier } from '../src/lib/services/category-classifier.service'

const categoryClassifier = new CategoryClassifier()

// 테스트 케이스들
const testCases = [
  {
    title: 'React 18의 새로운 기능들',
    content: 'React 18에서는 새로운 concurrent features와 automatic batching이 도입되었습니다. 이번 포스트에서는 이러한 새로운 기능들을 자세히 살펴보겠습니다.',
    expected: '개발'
  },
  {
    title: 'Next.js 14 튜토리얼',
    content: 'Next.js 14의 새로운 기능들을 배워보는 튜토리얼입니다. App Router와 Server Components에 대해 알아보겠습니다.',
    expected: '학습'
  },
  {
    title: '새로운 노트북 리뷰',
    content: '최근 구매한 맥북 프로 16인치의 사용 후기를 공유합니다. 성능과 배터리 수명, 디자인에 대해 평가해보겠습니다.',
    expected: '리뷰'
  },
  {
    title: '인생에 대한 생각',
    content: '오늘은 인생의 의미와 목적에 대해 깊이 생각해보는 시간을 가졌습니다. 우리가 살아가는 이유와 가치에 대해 이야기해보겠습니다.',
    expected: '생각'
  },
  {
    title: '오늘의 일상',
    content: '오늘은 친구들과 함께 카페에 갔습니다. 맛있는 커피를 마시며 즐거운 시간을 보냈습니다.',
    expected: '일상'
  },
  {
    title: 'JavaScript 비동기 프로그래밍',
    content: 'JavaScript에서 async/await와 Promise를 사용한 비동기 프로그래밍에 대해 알아보겠습니다. 실제 예제와 함께 설명드리겠습니다.',
    expected: '개발'
  }
]

async function testCategoryClassifier() {
  console.log('🧪 카테고리 분류 서비스 테스트 시작\n')
  
  for (const testCase of testCases) {
    console.log(`📝 제목: ${testCase.title}`)
    console.log(`📄 내용: ${testCase.content.substring(0, 50)}...`)
    
    try {
      const category = await categoryClassifier.classify(testCase.title, testCase.content)
      const confidence = await categoryClassifier.getConfidence(testCase.title, testCase.content)
      const scores = await categoryClassifier.getDetailedScores(testCase.title, testCase.content)
      
      console.log(`🎯 분류 결과: ${category}`)
      console.log(`📊 신뢰도: ${(confidence * 100).toFixed(1)}%`)
      console.log(`📈 점수: ${Object.entries(scores).map(([cat, score]) => `${cat}: ${score}`).join(', ')}`)
      console.log(`✅ 예상 결과: ${testCase.expected} | 실제 결과: ${category} | ${category === testCase.expected ? '✅ 맞음' : '❌ 틀림'}`)
    } catch (error) {
      console.log(`❌ 오류: ${error}`)
    }
    
    console.log('─'.repeat(80))
  }
  
  console.log('\n🎉 테스트 완료!')
}

testCategoryClassifier().catch(console.error)
