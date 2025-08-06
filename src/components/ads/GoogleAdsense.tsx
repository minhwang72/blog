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
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Adsense error:', err);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // 여기에 실제 애드센스 Publisher ID를 입력하세요
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}