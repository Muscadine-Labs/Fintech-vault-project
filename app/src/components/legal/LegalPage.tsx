import React from 'react';
import Link from 'next/link';

const SECTION_HEADING = 'text-2xl font-semibold text-[var(--foreground)] mb-4 border-b border-[var(--border)] pb-2';
const BODY = 'text-[var(--foreground-secondary)] mb-4';
const LIST = 'text-[var(--foreground-secondary)] list-disc list-inside space-y-2 mb-4';

const LegalPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="max-w-none">
          <h1 className="text-4xl font-light text-[var(--foreground)] mb-4 font-serif border-b-2 border-[var(--border)] pb-4">
            Legal Disclaimer
          </h1>
          <p className="text-[var(--foreground-secondary)] italic mb-8">Last updated: January 2027</p>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 mb-8 rounded-sm">
            <p className="text-[var(--foreground)] font-semibold mb-2">
              Nothing in this app is an offer to sell or a solicitation to buy any product, service, or
              investment.
            </p>
            <p className="text-[var(--foreground-secondary)]">
              Past performance is not a reliable indicator of future results. Yields are variable and not guaranteed.
              This app does not provide investment advice; seek your own professional advice before making any
              decision.
            </p>
          </div>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>1. A personal project</h2>
            <p className={BODY}>
              This is a personal, non-commercial project run by an individual. It is not a company and has no
              clients, customers or employees. We do not sell anything, charge fees to anyone, take payment, or manage
              money for other people.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>2. Not advice</h2>
            <p className={BODY}>
              Everything in this app is general information, shared for free. None of it is
              financial, investment, trading, tax or legal advice, a recommendation, or a statement that anything is
              suitable for you. We are not a bank, broker, investment adviser, fund or custodian, and using the app
              creates no professional or advisory relationship.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>3. No custody</h2>
            <p className={BODY}>
              We never hold your keys or your assets. Vault deposits and withdrawals are transactions you sign
              yourself with smart contracts on Base. The vault, market and Morpho contracts are third-party,
              open-source code that we do not control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>4. Risk</h2>
            <p className={BODY}>Using crypto, DeFi or the vaults can lose you some or all of your money. Risks include:</p>
            <ul className={LIST}>
              <li>Smart-contract bugs and exploits in the vault, market, oracle or Morpho contracts</li>
              <li>Liquidations, bad debt, oracle failures and depegs in the underlying markets</li>
              <li>Withdrawals that wait for market liquidity, or pay a penalty to exit early</li>
              <li>Price volatility</li>
              <li>Phishing, fake sites, malicious browser extensions and compromised wallets</li>
              <li>Lost or stolen keys and seed phrases, and transactions that cannot be undone</li>
              <li>Changes in law, regulation and tax treatment</li>
            </ul>
            <p className={BODY}>
              See the <Link href="/risk" className="text-[var(--primary)] underline">Risk</Link> page for how the vaults work. Never put in more than you can afford to lose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>5. No warranty, no liability</h2>
            <p className={BODY}>
              Everything here is provided &quot;as is&quot;, without any warranty. It can be incomplete, wrong or out
              of date. To the maximum extent permitted by law, we are not liable for any loss arising from your use of
              the app, the vaults or anything we publish. The full terms are in the{' '}
              <Link href="/terms" className="text-[var(--primary)] underline">Terms of Use</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={SECTION_HEADING}>6. Contact</h2>
            <p className={BODY}>Ask your instructor if you have a question about this disclaimer.</p>
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

export default LegalPage;
