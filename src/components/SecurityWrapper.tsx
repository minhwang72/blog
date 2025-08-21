'use client';

export default function SecurityWrapper({ children }: { children: React.ReactNode }) {
  // 실제 보안은 서버사이드에서 처리
  // 클라이언트 사이드 개발자 도구 차단은 보안상 의미가 없으며 UX를 해칩니다
  return <>{children}</>;
}