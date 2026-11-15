import React from 'react';
import Link from 'next/link';

const RiskPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="max-w-none">
          <h1 className="text-4xl font-light text-[var(--foreground)] mb-4 font-serif border-b-2 border-[var(--border)] pb-4">
            Risk
          </h1>
          <p className="text-[var(--foreground-secondary)] italic mb-8">Last updated: November 2026</p>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-light text-[var(--foreground)] mb-2 font-serif">Not a bank · Not advice</h2>
            <p className="text-[var(--foreground-secondary)]">
              This is a <strong>personal, non-commercial project</strong>, not a business, bank, broker,
              investment adviser, fund, or custodian. Nothing here is investment, tax, or legal advice. Digital asset
              strategies involve substantial risk, including total loss of principal. Past or projected yield is not a
              guarantee of future results. You retain custody of your assets and are solely responsible for wallet
              security, transaction signing, and eligibility in your jurisdiction. On-chain state is the source of
              truth. See also our{' '}
              <Link href="/legal" className="underline font-medium text-[var(--foreground)]">
                legal disclaimer
              </Link>
              .
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">What this is</h2>
            <p className="text-[var(--foreground-secondary)] mb-4">
              The curator runs a few Morpho vaults on Base and chooses their markets and caps. Deposits and
              withdrawals are signed from your own non-custodial wallet. Each vault sets its own performance and
              management fees, shown on the vault page. We do not hold private keys, guarantee returns, or insure
              deposits.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Material risks</h2>
            <ul className="text-[var(--foreground-secondary)] list-disc list-inside space-y-2">
              <li>Smart contract bugs or exploits in vault, market, or dependency contracts</li>
              <li>Market, liquidity, and oracle failures (depegs, illiquid exits, bad prices)</li>
              <li>Forced early withdrawals pay a penalty when markets lack free cash</li>
              <li>Curator decisions (market listings, parameters, pauses) — not a guarantee of safety</li>
              <li>Regulatory change and product availability in your jurisdiction</li>
              <li>User error (lost keys, phishing, wrong chain, unsigned transaction mistakes)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Market &amp; collateral framework</h2>
            <p className="text-[var(--foreground-secondary)] mb-4">
              The curator lists Morpho markets that meet minimum liquidity, collateralization, and operational criteria.
              Concentration limits, asset type, and oracle dependencies are reviewed before onboarding. Markets can be
              removed or capped when conditions change. Every vault supplies only to Morpho markets (overcollateralized
              lending).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Monitoring</h2>
            <p className="text-[var(--foreground-secondary)] mb-4">
              The curator reviews utilization, collateral factors, and reported incidents on a recurring basis. Sentinels can pull funds back
              to idle or lower caps, per on-chain roles. Most setting changes wait out an on-chain timelock before
              they take effect, and the app shows pending changes on each vault&apos;s Overview. We may update documentation, app notices, or parameters when risk
              increases; we are not obligated to recover anyone&apos;s funds in a failure event.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Responsibilities</h2>
            <div className="overflow-x-auto border border-[var(--border)] rounded-lg mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-[var(--surface)]">
                    <th className="text-left p-3 font-medium text-[var(--foreground)]">Party</th>
                    <th className="text-left p-3 font-medium text-[var(--foreground)]">Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium text-[var(--foreground)] align-top">You (user)</td>
                    <td className="p-3 text-[var(--foreground-secondary)]">Custody keys, sign transactions, tax reporting, suitability, reading on-chain state</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium text-[var(--foreground)] align-top">Curator</td>
                    <td className="p-3 text-[var(--foreground-secondary)]">Chooses vault markets and caps; runs the open-source interface; never holds deposits</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium text-[var(--foreground)] align-top">Morpho &amp; markets</td>
                    <td className="p-3 text-[var(--foreground-secondary)]">Protocol logic, market liquidity, governance of underlying infrastructure</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[var(--foreground)] align-top">Third parties</td>
                    <td className="p-3 text-[var(--foreground-secondary)]">Wallets, RPC providers, Morpho&apos;s API, block explorers — separate terms and risks</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[var(--foreground-secondary)] text-sm">
              On-chain roles and contract addresses are set per vault. Verify them on-chain before depositing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Audits &amp; dependencies</h2>
            <p className="text-[var(--foreground-secondary)] mb-4">
              Vaults use Morpho-developed ERC-4626 infrastructure. Third-party audits cover specific contracts and versions
              — not every integration, frontend, or future parameter change. Review Morpho&apos;s published audit reports
              and scope before depositing.
            </p>
            <a
              href="https://docs.morpho.org/get-started/resources/audits/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] font-medium underline"
            >
              Morpho audits — security reviews →
            </a>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Related documents</h2>
            <ul className="text-[var(--foreground-secondary)] list-disc list-inside space-y-2">
              <li>
                <Link href="/terms" className="text-[var(--primary)] underline">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-[var(--primary)] underline">
                  Legal disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[var(--primary)] underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <Link href="/" className="inline-flex items-center text-[var(--primary)] hover:text-[var(--primary)] font-semibold transition-colors">
              ← Back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskPage;
