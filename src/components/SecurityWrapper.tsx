'use client';

import { useEffect } from 'react';

export default function SecurityWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 키보드 단축키 차단 (개발자도구 관련)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 키 차단
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (개발자도구) 차단
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J (콘솔) 차단
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (소스보기) 차단
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C (요소 검사) 차단
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+K (콘솔) 차단 (Firefox)
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        return false;
      }
    };

    // 개발자도구 감지 및 차단 (선택적)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      if (widthThreshold || heightThreshold) {
        console.warn('개발자도구 사용이 감지되었습니다.');
        // 개발자도구 감지 시 콘솔에만 경고 (페이지 변경하지 않음)
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);

    // 개발자도구 감지 시작 (선택적)
    const devToolsInterval = setInterval(detectDevTools, 5000); // 5초마다 체크

    // 콘솔 경고 메시지
    console.log('%c경고!', 'color: red; font-size: 30px; font-weight: bold;');
    console.log('%c이 브라우저 기능은 개발자만을 위한 것입니다.', 'color: red; font-size: 16px;');
    console.log('%c누군가가 당신에게 이곳에 무언가를 입력하라고 했다면, 이는 사기입니다.', 'color: red; font-size: 16px;');

    // 클린업 함수
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsInterval);
    };
  }, []);

  return <>{children}</>;
}
