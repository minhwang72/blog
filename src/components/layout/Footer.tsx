import Link from 'next/link';
import { Github, Mail, Settings } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-slate-600 dark:text-slate-400 md:text-left">
              © 2025 hwang min. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="https://github.com/minhwang72"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
            <span className="text-slate-400 dark:text-slate-500">|</span>
            <a
              href="mailto:zxcyui6181@naver.com"
              className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </a>
            <span className="text-slate-400 dark:text-slate-500">|</span>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 