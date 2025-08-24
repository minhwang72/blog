'use client';

import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import ToastProvider from '@/components/ui/Toast';
import GoogleAnalytics from '@/components/Analytics';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange={true}
      storageKey="theme"
    >
      {children}
      <ToastProvider />
      <GoogleAnalytics />
      <Analytics />
    </ThemeProvider>
  );
} 