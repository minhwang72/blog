import Link from 'next/link';
import { Github, Mail, Settings } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground/60 md:text-left">
              © 2025 hwang min. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="https://github.com/minhwang72"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:text-foreground text-muted-foreground/60"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
            <span className="text-muted-foreground/40">|</span>
            <a
              href="mailto:zxcyui6181@naver.com"
              className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:text-foreground text-muted-foreground/60"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </a>
            <span className="text-muted-foreground/40">|</span>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:text-foreground text-muted-foreground/60"
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