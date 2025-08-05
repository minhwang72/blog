export class CategoryClassifier {
  async classify(content: string): Promise<string> {
    const lowerContent = content.toLowerCase();
    
    // 키워드 기반 카테고리 분류
    if (lowerContent.includes('개발') || lowerContent.includes('코딩') || 
        lowerContent.includes('프로그래밍') || lowerContent.includes('기술') ||
        lowerContent.includes('development') || lowerContent.includes('programming')) {
      return '개발';
    }
    
    if (lowerContent.includes('학습') || lowerContent.includes('튜토리얼') ||
        lowerContent.includes('learning') || lowerContent.includes('tutorial')) {
      return '학습';
    }
    
    if (lowerContent.includes('리뷰') || lowerContent.includes('평가') ||
        lowerContent.includes('review') || lowerContent.includes('product')) {
      return '리뷰';
    }
    
    if (lowerContent.includes('생각') || lowerContent.includes('관점') ||
        lowerContent.includes('thoughts') || lowerContent.includes('philosophy')) {
      return '생각';
    }
    
    // 기본값
    return '일상';
  }
} 