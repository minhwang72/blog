'use client';

import GoogleAdsense from './GoogleAdsense';

interface ArticleAdProps {
  position?: 'top' | 'middle' | 'bottom';
}

export default function ArticleAd({ position = 'middle' }: ArticleAdProps) {
  const getAdSlot = () => {
    switch (position) {
      case 'top':
        return 'YOUR_TOP_AD_SLOT'; // 상단 광고 슬롯 ID
      case 'middle':
        return 'YOUR_MIDDLE_AD_SLOT'; // 중간 광고 슬롯 ID  
      case 'bottom':
        return 'YOUR_BOTTOM_AD_SLOT'; // 하단 광고 슬롯 ID
      default:
        return 'YOUR_DEFAULT_AD_SLOT';
    }
  };

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