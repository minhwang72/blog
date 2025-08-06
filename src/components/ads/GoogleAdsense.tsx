'use client';

import { useEffect } from 'react';

interface GoogleAdsenseProps {
  adSlot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: string;
}

export default function GoogleAdsense({ 
  adSlot, 
  style = { display: 'block' }, 
  className = '',
  format = 'auto'
}: GoogleAdsenseProps) {
  // 애드센스 Publisher ID가 설정되지 않으면 광고를 표시하지 않음
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  
  useEffect(() => {
    if (!publisherId || publisherId.includes('YOUR_PUBLISHER_ID')) {
      return; // 애드센스가 설정되지 않으면 스크립트 실행하지 않음
    }
    
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Adsense error:', err);
    }
  }, [publisherId]);

  // 애드센스가 설정되지 않으면 아무것도 렌더링하지 않음
  if (!publisherId || publisherId.includes('YOUR_PUBLISHER_ID')) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}