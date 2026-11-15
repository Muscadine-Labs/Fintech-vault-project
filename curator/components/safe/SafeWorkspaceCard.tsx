'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SAFE_APP_URL } from '@/lib/constants';

export function SafeWorkspaceCard() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-4 py-3">
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Safe</span>
        {' · '}
        Safe workspace for all vault-role multisigs
      </p>
      <Button asChild variant="outline" size="sm" className="h-7 shrink-0 px-2 text-xs">
        <a
          href={SAFE_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5"
        >
          Open workspace
          <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </div>
  );
}
