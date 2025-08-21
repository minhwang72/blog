export class CategoryClassifier {
  private readonly categoryKeywords = {
    '개발': [
      // 프로그래밍 언어
      'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'js', 'ts', 'py', 'cpp', 'cs', 'rb', 'rs',
      
      // 개발 도구/프레임워크
      'react', 'vue', 'angular', 'next\\.js', 'nuxt', 'svelte', 'node\\.js', 'express', 'django', 'flask', 'spring',
      'docker', 'kubernetes', 'git', 'github', 'gitlab', 'jenkins', 'ci/cd', 'devops',
      
      // 데이터베이스
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server',
      
      // 클라우드/인프라
      'aws', 'azure', 'gcp', 'cloud', 'serverless', 'lambda', 'ec2', 's3', 'rds',
      
      // 개발 관련 용어
      '개발', '코딩', '프로그래밍', '코드', '버그', '디버깅', '테스트', '리팩토링', '알고리즘', '자료구조',
      'api', 'rest', 'graphql', 'microservice', 'monolith', 'architecture', 'design pattern',
      'development', 'programming', 'coding', 'software', 'application', 'web', 'mobile', 'backend', 'frontend',
      'fullstack', 'full-stack', 'stack', 'framework', 'library', 'package', 'dependency', 'npm', 'yarn',
      'build', 'deploy', 'deployment', 'production', 'staging', 'development', 'environment',
      'version control', 'branch', 'merge', 'pull request', 'code review', 'agile', 'scrum', 'kanban',
      '비동기', 'async', 'await', 'promise', 'callback', '이벤트', 'event', '함수', 'function', '클래스', 'class',
      '객체', 'object', '인터페이스', 'interface', '타입', 'type', '변수', 'variable', '상수', 'constant'
    ],
    
    '학습': [
      // 학습 관련 키워드
      '학습', '공부', '교육', '튜토리얼', '가이드', '강의', '수업', '책', '독서', '연구', '분석',
      'learning', 'study', 'education', 'tutorial', 'guide', 'course', 'lesson', 'book', 'research',
      'how to', 'step by step', 'beginner', 'intermediate', 'advanced', 'expert', 'master',
      '기초', '초급', '중급', '고급', '전문가', '마스터', '기술', '스킬', '능력', '역량',
      'skill', 'technique', 'method', 'approach', 'strategy', 'best practice', 'tip', 'trick',
      'documentation', 'manual', 'reference', 'cheat sheet', 'quick start', 'getting started',
      '배우다', '익히다', '습득', '연습', '실습', '예제', 'example', '샘플', 'sample', '모범사례'
    ],
    
    '리뷰': [
      // 리뷰 관련 키워드
      '리뷰', '평가', '후기', '사용기', '체험기', '비교', '분석', '추천', '추천서', '인기', '베스트',
      'review', 'evaluation', 'assessment', 'comparison', 'analysis', 'recommendation', 'best',
      'product', 'service', 'tool', 'software', 'app', 'application', 'website', 'platform',
      '책', '영화', '드라마', '음악', '게임', '음식', '여행', '호텔', '레스토랑', '카페',
      'book', 'movie', 'drama', 'music', 'game', 'food', 'travel', 'hotel', 'restaurant', 'cafe',
      '장점', '단점', 'pros', 'cons', '장단점', 'merit', 'demerit', 'advantage', 'disadvantage',
      '가격', '성능', '품질', '디자인', '사용성', 'price', 'performance', 'quality', 'design', 'usability',
      '구매', 'buy', '사용', 'use', '경험', 'experience', '만족도', 'satisfaction', '평점', 'rating',
      '노트북', 'laptop', '컴퓨터', 'computer', '스마트폰', 'smartphone', '태블릿', 'tablet'
    ],
    
    '생각': [
      // 철학/사고 관련 키워드
      '생각', '관점', '철학', '이론', '개념', '이념', '가치관', '세계관', '인생관', '철학적',
      'thoughts', 'philosophy', 'theory', 'concept', 'idea', 'ideology', 'value', 'worldview',
      '인간', '사회', '문화', '역사', '정치', '경제', '윤리', '도덕', '종교', '과학',
      'human', 'society', 'culture', 'history', 'politics', 'economy', 'ethics', 'morality', 'religion', 'science',
      '의미', '목적', '가치', '진리', '미', '선', 'meaning', 'purpose', 'value', 'truth', 'beauty', 'good',
      '성찰', '깨달음', '통찰', 'reflection', 'enlightenment', 'insight', 'wisdom', 'knowledge',
      '인생', '삶', 'life', '존재', 'existence', '의식', 'consciousness', '마음', 'mind', '영혼', 'soul',
      '자아', 'self', '정체성', 'identity', '자유', 'freedom', '책임', 'responsibility', '선택', 'choice'
    ],
    
    '일상': [
      // 일상/개인 관련 키워드
      '일상', '생활', '경험', '이야기', '에피소드', '기억', '추억', '감정', '느낌', '기분',
      'daily', 'life', 'experience', 'story', 'episode', 'memory', 'emotion', 'feeling', 'mood',
      '가족', '친구', '동료', '관계', '사랑', '우정', 'family', 'friend', 'colleague', 'relationship', 'love', 'friendship',
      '취미', '관심사', '취향', 'hobby', 'interest', 'taste', 'preference',
      '건강', '운동', '다이어트', 'health', 'exercise', 'diet', 'fitness',
      '여행', '휴가', '여행기', 'travel', 'vacation', 'trip', 'journey',
      '음식', '요리', '맛집', 'food', 'cooking', 'recipe', 'restaurant',
      '영화', '드라마', '음악', '게임', 'entertainment', 'movie', 'drama', 'music', 'game',
      '카페', 'cafe', '커피', 'coffee', '점심', 'lunch', '저녁', 'dinner', '아침', 'breakfast',
      '오늘', 'today', '어제', 'yesterday', '내일', 'tomorrow', '주말', 'weekend', '휴일', 'holiday',
      '집', 'home', '회사', 'company', '학교', 'school', '대학', 'university', '직장', 'workplace'
    ]
  };

  async classify(title: string, content: string): Promise<string> {
    const fullText = `${title} ${content}`.toLowerCase();
    const scores: { [key: string]: number } = {
      '개발': 0,
      '학습': 0,
      '리뷰': 0,
      '생각': 0,
      '일상': 0
    };

    // 각 카테고리별 점수 계산
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      for (const keyword of keywords) {
        try {
          // 단순한 문자열 포함 검사 (정규식 대신)
          if (fullText.includes(keyword.toLowerCase())) {
            // 제목에 있는 키워드는 더 높은 가중치
            if (title.toLowerCase().includes(keyword.toLowerCase())) {
              scores[category] += 3; // 제목 키워드는 3배 가중치
            } else {
              scores[category] += 1;
            }
          }
        } catch (error) {
          console.warn(`키워드 검사 오류 (키워드: ${keyword}):`, error);
        }
      }
    }

    // 가장 높은 점수의 카테고리 반환
    const maxScore = Math.max(...Object.values(scores));
    const bestCategory = Object.keys(scores).find(category => scores[category] === maxScore);

    // 점수가 너무 낮으면 기본값 반환
    if (maxScore < 1) {
      return '일상';
    }

    return bestCategory || '일상';
  }

  // 신뢰도 점수 계산 (0-1)
  async getConfidence(title: string, content: string): Promise<number> {
    const fullText = `${title} ${content}`.toLowerCase();
    const scores: { [key: string]: number } = {
      '개발': 0,
      '학습': 0,
      '리뷰': 0,
      '생각': 0,
      '일상': 0
    };

    // 점수 계산
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      for (const keyword of keywords) {
        try {
          if (fullText.includes(keyword.toLowerCase())) {
            if (title.toLowerCase().includes(keyword.toLowerCase())) {
              scores[category] += 3;
            } else {
              scores[category] += 1;
            }
          }
        } catch (error) {
          // 오류 무시
        }
      }
    }

    const maxScore = Math.max(...Object.values(scores));
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    if (totalScore === 0) return 0;
    
    // 최고 점수가 전체 점수의 50% 이상이면 높은 신뢰도
    return Math.min(maxScore / totalScore, 1);
  }

  // 카테고리별 점수 상세 정보 반환
  async getDetailedScores(title: string, content: string): Promise<{ [key: string]: number }> {
    const fullText = `${title} ${content}`.toLowerCase();
    const scores: { [key: string]: number } = {
      '개발': 0,
      '학습': 0,
      '리뷰': 0,
      '생각': 0,
      '일상': 0
    };

    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      for (const keyword of keywords) {
        try {
          if (fullText.includes(keyword.toLowerCase())) {
            if (title.toLowerCase().includes(keyword.toLowerCase())) {
              scores[category] += 3;
            } else {
              scores[category] += 1;
            }
          }
        } catch (error) {
          // 오류 무시
        }
      }
    }

    return scores;
  }
} 