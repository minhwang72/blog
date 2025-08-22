import { getTopicByDate } from './scripts/claude-auto-post'

// 포스트 생성 테스트
async function testPostGeneration() {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]
  
  console.log(`📅 테스트 날짜: ${dateStr}`)
  
  // 날짜 기반으로 주제 선택
  const { category, topic } = getTopicByDate(today)
  
  console.log(`🎯 선택된 주제: ${topic}`)
  console.log(`📂 카테고리: ${category}`)
  
  // 폴백 포스트 생성 (Claude API 없이)
  const fallbackPost = generateFallbackPost(topic, category, dateStr)
  
  console.log('\n📝 생성된 포스트:')
  console.log('제목:', fallbackPost.title)
  console.log('\n내용 미리보기 (처음 500자):')
  console.log(fallbackPost.content.substring(0, 500) + '...')
  console.log('\n요약:', fallbackPost.summary)
  console.log('\n📊 통계:')
  console.log(`- 제목 길이: ${fallbackPost.title.length}자`)
  console.log(`- 내용 길이: ${fallbackPost.content.length}자`)
  console.log(`- 광고 삽입 가능: ${fallbackPost.content.length > 1500 ? '✅' : '❌'}`)
}

// 폴백 포스트 생성 함수 (원본에서 복사)
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

// 실행
testPostGeneration()