
'use client';

import { useState, useEffect } from 'react';
import Logo from '@/components/logo';
import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2.5">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose md:text-left">
              Built by{' '}
              <a
                href="https://muhammadtanveerabbas.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="font-medium"
              >
                Muhammad Tanveer Abbas
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://linkedin.com/in/muhammadtanveerabbas" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5 text-white hover:text-primary transition-colors" />
          </a>
          <a href="https://github.com/muhammadtanveerabbas" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 text-white hover:text-primary transition-colors" />
          </a>
          <a href="https://x.com/m_tanveerabbas" target="_blank" rel="noopener noreferrer">
            <svg
              className="h-5 w-5 text-white hover:text-primary transition-colors"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-1.7 12.95h1.5l-8.8-11.83h-1.6l8.9 11.83Z" />
            </svg>
          </a>
        </div>
        {year && (
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {year} CortexReach, Inc. All rights reserved.
          </p>
        )}
      </div>
    </footer>
  );
}
