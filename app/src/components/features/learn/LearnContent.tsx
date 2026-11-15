'use client';

import Link from 'next/link';
import { ExternalLinkIcon } from '@/components/ui';

const RESOURCES = [
  {
    question: 'What is Morpho?',
    href: 'https://docs.morpho.org/learn/',
    external: true,
  },
  {
    question: 'What is a vault?',
    href: 'https://docs.morpho.org/learn/concepts/vault-v2/',
    external: true,
  },
  {
    question: 'What is a curator?',
    href: 'https://docs.morpho.org/learn/concepts/curator/',
    external: true,
  },
  {
    question: 'How do Morpho variable interest rate markets work?',
    href: 'https://docs.morpho.org/learn/concepts/blue/',
    external: true,
  },
  {
    question: 'How do Morpho fixed interest rate markets work?',
    href: 'https://docs.morpho.org/learn/concepts/midnight/',
    external: true,
  },
  {
    question: 'How do I self-custody?',
    href: '/self-custody',
    external: false,
  },
] as const;

export default function LearnContent() {
  return (
    <div className="flex flex-col items-start justify-start h-full w-full gap-4">
      <div className="space-y-1">
        <h1 className="text-xl text-left text-[var(--foreground)]">
          Learning Resources
        </h1>
        <p className="text-sm text-left text-[var(--foreground-secondary)]">
          Learn about DeFi, Morpho Protocol, and how to use these vaults.
        </p>
      </div>

      <ul className="w-full flex flex-col">
        {RESOURCES.map((resource) => {
          const className =
            'flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-subtle)] text-sm text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] -mx-1 px-1 rounded-md transition-colors';
          const inner = (
            <>
              <span>{resource.question}</span>
              {resource.external ? (
                <ExternalLinkIcon size="sm" color="muted" className="shrink-0" />
              ) : null}
            </>
          );
          return (
            <li key={resource.href}>
              {resource.external ? (
                <a href={resource.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {inner}
                </a>
              ) : (
                <Link href={resource.href} className={className}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
