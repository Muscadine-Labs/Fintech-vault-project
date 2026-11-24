'use client';

import { useEffect } from 'react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { NetworkSwitcher } from '@/components/NetworkSwitcher';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type SignInSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function SignInSheet({ open, onClose }: SignInSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[min(92dvh,640px)] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:inset-x-auto sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:max-h-[min(calc(100vh-5rem),560px)] sm:w-[400px] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Account"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Account
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-1 h-11 w-11 touch-manipulation sm:h-8 sm:w-8"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-3">
              <div className="min-w-0 space-y-2 sm:flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Network
                </p>
                <NetworkSwitcher fullWidth />
              </div>

              <div className="min-w-0 space-y-2 sm:flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Wallet
                </p>
                <ConnectWalletButton fullWidth />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Appearance
              </p>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
