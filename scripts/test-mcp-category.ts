import { CategoryClassifier } from '../src/lib/services/category-classifier.service'

const categoryClassifier = new CategoryClassifier()

// MCP API 테스트
async function testMcpCategoryClassification() {
  console.log('🧪 MCP 카테고리 자동 분류 테스트\n')
  
  const testPosts = [
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
    }
  ]

  for (const post of testPosts) {
    console.log(`📝 제목: ${post.title}`)
    console.log(`📄 내용: ${post.content.substring(0, 50)}...`)
    
    try {
      // 카테고리 분류
      const category = await categoryClassifier.classify(post.title, post.content)
      const confidence = await categoryClassifier.getConfidence(post.title, post.content)
      const scores = await categoryClassifier.getDetailedScores(post.title, post.content)
      
      console.log(`🎯 분류 결과: ${category}`)
      console.log(`📊 신뢰도: ${(confidence * 100).toFixed(1)}%`)
      console.log(`📈 점수: ${Object.entries(scores).map(([cat, score]) => `${cat}: ${score}`).join(', ')}`)
      console.log(`✅ 예상 결과: ${post.expected} | 실제 결과: ${category} | ${category === post.expected ? '✅ 맞음' : '❌ 틀림'}`)
      
      // MCP API 호출 시뮬레이션
      const mcpResponse = {
        success: true,
        message: 'Draft created successfully',
        slug: post.title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
        category: category,
        classification: {
          autoClassified: true,
          category: category,
          confidence: confidence,
          scores: scores,
          message: `포스트 내용을 분석하여 "${category}" 카테고리로 자동 분류했습니다. (신뢰도: ${(confidence * 100).toFixed(1)}%)`
        }
      }
      
      console.log(`📋 MCP 응답: ${JSON.stringify(mcpResponse, null, 2)}`)
      
    } catch (error) {
      console.log(`❌ 오류: ${error}`)
    }
    
    console.log('─'.repeat(80))
  }
  
  console.log('\n🎉 MCP 카테고리 분류 테스트 완료!')
  console.log('\n💡 이제 MCP를 통해 포스트를 작성하면 자동으로 카테고리가 분류됩니다!')
}

testMcpCategoryClassification().catch(console.error)
