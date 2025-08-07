'use client';

import { ReactNode, CSSProperties } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function AnimatedSection({ children, className = '', style }: AnimatedSectionProps) {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={style}
    >
      {children}
    </div>
  );
} 