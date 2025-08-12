'use client';

import GoogleAdsense from './GoogleAdsense';

interface ArticleAdProps {
  position?: 'top' | 'middle' | 'bottom' | 'auto';
  postId?: number;
  contentLength?: number;
}

export default function ArticleAd({ 
  position = 'auto', 
  postId,
  contentLength = 0 
}: ArticleAdProps) {
  // 애드센스 정책 준수를 위한 엄격한 조건들
  const shouldShowAd = () => {
    // 1. 프로덕션 환경에서만 광고 표시
    if (process.env.NODE_ENV !== 'production') {
      return false;
    }
    
    // 2. 포스트 ID가 있어야 함 (실제 콘텐츠 페이지)
    if (!postId) {
      return false;
    }
    
    // 3. 콘텐츠 길이가 최소 1000자 이상이어야 함 (정책 강화)
    if (contentLength < 1000) {
      return false;
    }
    
    // 4. 애드센스 Publisher ID가 설정되어 있어야 함
    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
    if (!publisherId || publisherId.includes('YOUR_PUBLISHER_ID')) {
      return false;
    }
    
    return true;
  };

  // 글 길이에 따른 자동 광고 배치 로직
  const getAutoPosition = () => {
    if (position !== 'auto') return position;
    
    // 글 길이에 따른 광고 배치 전략
    if (contentLength < 2000) {
      // 짧은 글: 하단에만 광고
      return 'bottom';
    } else if (contentLength < 5000) {
      // 중간 길이: 하단과 중간에 광고
      return 'middle';
    } else {
      // 긴 글: 상단, 중간, 하단에 광고
      return 'top';
    }
  };

  // 자동 광고 사용 (실제 슬롯 ID 대신)
  const getAdSlot = () => {
    // 자동 광고를 위한 특별한 슬롯 ID 사용
    return 'auto';
  };

  // 광고 표시 조건을 만족하지 않으면 아무것도 렌더링하지 않음
  if (!shouldShowAd()) {
    return null;
  }

  const actualPosition = getAutoPosition();

  return (
    <div className="my-8 text-center">
      <div className="text-xs text-gray-400 mb-2">
        광고 {actualPosition === 'top' ? '(상단)' : actualPosition === 'middle' ? '(중간)' : '(하단)'}
      </div>
      <GoogleAdsense 
        adSlot="auto"
        style={{ 
          display: 'block',
          minHeight: '280px',
          textAlign: 'center'
        }}
        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
        format="auto"
      />
    </div>
  );
}