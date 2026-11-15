import React from 'react';
import Link from 'next/link';

const SECTION_HEADING = 'text-2xl font-semibold text-[var(--foreground)] mb-4 border-b border-[var(--border)] pb-2';
const BODY = 'text-[var(--foreground-secondary)] mb-4';
const LIST = 'text-[var(--foreground-secondary)] list-disc list-inside space-y-2 mb-4';

const TermsPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="max-w-none">
          <h1 className="text-4xl font-light text-[var(--foreground)] mb-4 font-serif border-b-2 border-[var(--border)] pb-4">
            Terms of Use
          </h1>
          <p className="text-[var(--foreground-secondary)] italic mb-8">Last updated: November 2026</p>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 mb-8 rounded-sm">
            <p className="text-[var(--foreground)] font-semibold">
              This is a personal, non-commercial project. It is not a business, has no clients and offers no
              services for hire. Nothing here is financial, investment, tax or legal advice, or an offer to sell or a
              solicitation to buy anything. Read the{' '}
              <Link href="/risk" className="underline">Risk</Link> page and the{' '}
              <Link href="/legal" className="underline">Legal disclaimer</Link> before using a vault.
            </p>
          </div>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>1. Acceptance</h2>
            <p className={BODY}>
              By using this app (the &quot;site&quot;), you agree to these terms. If you
              do not agree, do not use the app. &quot;We&quot; and &quot;us&quot; mean the
              person who runs this app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>2. What the app is</h2>
            <ul className={LIST}>
              <li><strong>This app</strong>: an open-source interface to Morpho vaults on Base, plus notes on self-custody and DeFi, shared for free.</li>
            </ul>
            <p className={BODY}>
              We are not a bank, broker, investment adviser, fund or custodian. We do not charge anyone for anything,
              take payment, manage anyone else&apos;s money or enter into any professional or advisory relationship
              with you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>3. The vaults</h2>
            <p className={BODY}>
              The vaults are Morpho Vault V2 smart contracts on Base. Their curator chooses which markets they lend
              to and how much each market can hold. Each vault sets its own performance and management fees; check a
              vault&apos;s details in the app before you deposit.
            </p>
            <ul className={LIST}>
              <li>You keep custody. We never hold your keys or your assets; you sign every transaction yourself.</li>
              <li>The vault, market and Morpho contracts are third-party, open-source code that we do not control. On-chain state is the source of truth.</li>
              <li>Yields are variable and not guaranteed. Past APY is not a reliable indicator of future results.</li>
              <li>A withdrawal larger than the vault&apos;s free cash waits for market liquidity, or can be forced out early for a penalty the app shows before you confirm. You can lose some or all of what you deposit.</li>
              <li>Deposits can be limited by the vault&apos;s caps and, on some vaults, by an allow-list the app does not check.</li>
              <li>The curator can change markets, caps and other settings within the vault&apos;s on-chain rules. Many changes wait out a timelock first.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>4. Your responsibility</h2>
            <ul className={LIST}>
              <li>You decide whether to use a vault or a guide, and you accept the risks of doing so.</li>
              <li>You do your own research and get your own professional advice before any financial decision.</li>
              <li>You keep your keys, devices and seed phrases secure, and check every URL, address and transaction before you sign.</li>
              <li>You follow the laws that apply to you, including tax and sanctions laws.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>5. No warranty</h2>
            <p className={BODY}>
              The app, the code and all content are provided &quot;as is&quot; and &quot;as
              available&quot;, without any warranty, express or implied, including merchantability, fitness for a
              particular purpose, accuracy and non-infringement. They can be wrong, out of date, unavailable or
              changed at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>6. Limitation of liability</h2>
            <p className={BODY}>
              To the maximum extent permitted by law, we are not liable for any direct, indirect, incidental, special
              or consequential loss arising from your use of the app, the vaults or any content, including
              loss of digital assets, smart-contract exploits, liquidations, oracle or market failures, interface or
              phishing attacks, downtime, and errors in anything we publish.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>7. Indemnity</h2>
            <p className={BODY}>
              You agree to indemnify and hold us harmless from any claim, loss or expense arising from your use of the
              app or your breach of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>8. Open source and third parties</h2>
            <p className={BODY}>
              Our code is published under open-source licenses; use it under those licenses. The app links to and
              relies on third parties (Morpho, wallets, RPC providers, block explorers and others) with their own terms
              and risks. We are not responsible for them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>9. Changes</h2>
            <p className={BODY}>
              We can change or take down the app, and change these terms, at any time. Continuing to use the app
              means you accept the current terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>10. Governing law</h2>
            <p className={BODY}>
              These terms are governed by the laws of the United States and of the U.S. state where the operator of
              the app resides, without regard to conflict-of-law rules. If any part of these terms is unenforceable,
              the rest stays in effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>11. Contact</h2>
            <p className={BODY}>Ask your instructor if you have a question about these terms.</p>
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

export default TermsPage;
