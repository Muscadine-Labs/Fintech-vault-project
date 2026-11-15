import React from 'react';
import Link from 'next/link';

const SECTION_HEADING = 'text-2xl font-semibold text-[var(--foreground)] mb-4 border-b border-[var(--border)] pb-2';
const BODY = 'text-[var(--foreground-secondary)] mb-4';
const LIST = 'text-[var(--foreground-secondary)] list-disc list-inside space-y-2 mb-4';

const PrivacyPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="max-w-none">
          <h1 className="text-4xl font-light text-[var(--foreground)] mb-4 font-serif border-b-2 border-[var(--border)] pb-4">
            Privacy Policy
          </h1>
          <p className="text-[var(--foreground-secondary)] italic mb-8">Last updated: November 2026</p>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 mb-8 rounded-sm">
            <p className="text-[var(--foreground)]">
              This is a personal, non-commercial project. There are no accounts and no sign-ups, and we do not
              sell, rent or share personal information for marketing. We never ask for, and never see, your private
              keys or seed phrases.
            </p>
          </div>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>1. What we see</h2>
            <ul className={LIST}>
              <li><strong>No analytics:</strong> the app uses no analytics, tracking pixels or advertising cookies, and turns off the wallet-connect analytics.</li>
              <li><strong>Server logs:</strong> our hosting provider (Vercel) keeps standard request logs, such as IP address, browser and time, for a short period.</li>
              <li><strong>Wallet address:</strong> when you connect a wallet, the app reads that public address&apos;s balances and vault positions. We do not tie it to your name or store it in a database.</li>
              <li><strong>Email:</strong> if you email us, we keep your message and address to reply.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>2. Third parties the app talks to</h2>
            <p className={BODY}>
              To show balances and send transactions, the app calls outside services, which can see your IP address
              and the wallet address being looked up, under their own privacy policies:
            </p>
            <ul className={LIST}>
              <li>Your wallet and Reown / WalletConnect, which connect it</li>
              <li>Alchemy and other Base RPC providers, for on-chain reads and sending transactions</li>
              <li>Morpho&apos;s API, for vault data, positions and token prices. The app&apos;s server makes these calls, so Morpho sees the wallet address but not your IP address.</li>
              <li>Morpho&apos;s image server (cdn.morpho.org), for token logos the app does not bundle</li>
            </ul>
            <p className={BODY}>
              Blockchains are public. Anything you do on-chain, including vault deposits and withdrawals, is visible
              to everyone, permanently.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>3. Stored in your browser</h2>
            <p className={BODY}>
              The app keeps a few settings on your device only: your theme, that you accepted the terms and when,
              and the wallet connection your wallet software saves. You can clear them at any time in your browser
              settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>4. When we would share information</h2>
            <p className={BODY}>
              Only if the law requires it, or to stop abuse of the app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>5. Children</h2>
            <p className={BODY}>The app is not meant for anyone under 18.</p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>6. Changes and contact</h2>
            <p className={BODY}>
              We may update this policy and will change the date above when we do. See also the{' '}
              <Link href="/terms" className="text-[var(--primary)] underline">Terms of Use</Link>.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <Link
              href="/"
              className="inline-flex items-center text-[var(--primary)] hover:text-[var(--primary)] font-semibold transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
