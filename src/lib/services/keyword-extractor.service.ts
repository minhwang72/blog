// 한국어 키워드 추출 서비스
export class KeywordExtractorService {
  private static readonly TECH_KEYWORDS = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'CI/CD', 'API', 'REST', 'GraphQL', 'Microservices',
    'DevOps', 'Agile', 'Scrum', 'TDD', 'BDD', 'Jest', 'Cypress', 'Webpack', 'Vite', 'TailwindCSS',
    'Bootstrap', 'Material-UI', 'Ant Design', 'Redux', 'Zustand', 'Context API', 'Hooks',
    'Serverless', 'JAMstack', 'SPA', 'SSR', 'SSG', 'PWA', 'SEO', 'Performance', 'Accessibility'
  ];

  private static readonly KOREAN_TECH_KEYWORDS = [
    '자바스크립트', '타입스크립트', '리액트', '넥스트', '노드', '파이썬', '자바', '씨플러스플러스',
    'HTML', 'CSS', 'SQL', '몽고디비', 'MySQL', 'PostgreSQL', '레디스', '도커', '쿠버네티스',
    'AWS', 'Azure', 'GCP', '깃', '깃허브', 'CI/CD', 'API', 'REST', 'GraphQL', '마이크로서비스',
    '데브옵스', '애자일', '스크럼', 'TDD', 'BDD', '제스트', '사이프러스', '웹팩', '바이트', '테일윈드',
    '부트스트랩', '머티리얼UI', '앤트디자인', '리덕스', '주스탠드', '컨텍스트API', '훅스',
    '서버리스', 'JAM스택', 'SPA', 'SSR', 'SSG', 'PWA', 'SEO', '성능', '접근성'
  ];

  static extractKeywords(content: string, title: string): string[] {
    const allText = `${title} ${content}`.toLowerCase();
    const keywords: string[] = [];

    // 기술 키워드 추출
    [...this.TECH_KEYWORDS, ...this.KOREAN_TECH_KEYWORDS].forEach(keyword => {
      if (allText.includes(keyword.toLowerCase())) {
        keywords.push(keyword);
      }
    });

    // 제목에서 키워드 추출
    const titleWords = title.split(/\s+/).filter(word => word.length > 1);
    keywords.push(...titleWords.slice(0, 3));

    // 중복 제거 및 정렬
    return [...new Set(keywords)].slice(0, 10);
  }

  static generateTags(content: string, title: string): string[] {
    const keywords = this.extractKeywords(content, title);
    const tags: string[] = [];

    // 카테고리별 태그 생성
    if (keywords.some(k => ['react', '리액트', 'next.js', '넥스트'].includes(k.toLowerCase()))) {
      tags.push('React', 'Frontend');
    }
    if (keywords.some(k => ['node.js', '노드', 'express', '익스프레스'].includes(k.toLowerCase()))) {
      tags.push('Node.js', 'Backend');
    }
    if (keywords.some(k => ['python', '파이썬', 'django', '플라스크'].includes(k.toLowerCase()))) {
      tags.push('Python');
    }
    if (keywords.some(k => ['docker', '도커', 'kubernetes', '쿠버네티스'].includes(k.toLowerCase()))) {
      tags.push('DevOps');
    }
    if (keywords.some(k => ['aws', 'azure', 'gcp', '클라우드'].includes(k.toLowerCase()))) {
      tags.push('Cloud');
    }

    return [...new Set([...keywords.slice(0, 5), ...tags])];
  }
}
