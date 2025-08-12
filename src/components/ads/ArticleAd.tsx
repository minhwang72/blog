'use client';

import GoogleAdsense from './GoogleAdsense';

interface ArticleAdProps {
  position?: 'top' | 'middle' | 'bottom';
  postId?: number;
  contentLength?: number;
}

export default function ArticleAd({ 
  position = 'middle', 
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
    
    // 5. 실제 광고 슬롯이 설정되어 있어야 함
    const adSlot = getAdSlot();
    if (adSlot.includes('YOUR_') || adSlot.includes('DEFAULT')) {
      return false;
    }
    
    return true;
  };

  const getAdSlot = () => {
    switch (position) {
      case 'top':
        return process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT || 'YOUR_TOP_AD_SLOT';
      case 'middle':
        return process.env.NEXT_PUBLIC_ADSENSE_MIDDLE_SLOT || 'YOUR_MIDDLE_AD_SLOT';
      case 'bottom':
        return process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT || 'YOUR_BOTTOM_AD_SLOT';
      default:
        return process.env.NEXT_PUBLIC_ADSENSE_DEFAULT_SLOT || 'YOUR_DEFAULT_AD_SLOT';
    }
  };

  // 광고 표시 조건을 만족하지 않으면 아무것도 렌더링하지 않음
  if (!shouldShowAd()) {
    return null;
  }

  return (
    <div className="my-8 text-center">
      <div className="text-xs text-gray-400 mb-2">광고</div>
      <GoogleAdsense 
        adSlot={getAdSlot()}
        style={{ 
          display: 'block',
          minHeight: '280px',
          textAlign: 'center'
        }}
        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
      />
    </div>
  );
}