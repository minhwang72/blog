'use client';

import { useEffect, useRef } from 'react';

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
  const adRef = useRef<HTMLModElement>(null);
  
  // 애드센스 Publisher ID가 설정되지 않으면 광고를 표시하지 않음
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  
  useEffect(() => {
    if (!publisherId || publisherId.includes('YOUR_PUBLISHER_ID')) {
      return; // 애드센스가 설정되지 않으면 스크립트 실행하지 않음
    }
    
    // 이미 광고가 로드되었는지 확인
    if (adRef.current && !adRef.current.hasAttribute('data-ad-loaded')) {
      try {
        // 자동 광고인 경우
        if (adSlot === 'auto') {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } else {
          // 일반 광고 슬롯인 경우
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
        adRef.current.setAttribute('data-ad-loaded', 'true');
      } catch (err) {
        console.error('Adsense error:', err);
      }
    }
  }, [publisherId, adSlot]);

  // 애드센스가 설정되지 않으면 아무것도 렌더링하지 않음
  if (!publisherId || publisherId.includes('YOUR_PUBLISHER_ID')) {
    return null;
  }

  // 자동 광고인 경우
  if (adSlot === 'auto') {
    return (
      <div className={`adsense-container ${className}`}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={style}
          data-ad-client={publisherId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // 일반 광고 슬롯인 경우
  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
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