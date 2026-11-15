'use client';

import Link from 'next/link';
import {
  BookOpen,
  Bot,
  Cloud,
  Droplets,
  ExternalLink,
  GitFork,
  KeyRound,
  LayoutGrid,
  Plus,
  Shield,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import {
  CuratorPanel,
  CuratorSectionHeader,
} from '@/components/morpho/CuratorChrome';
import {
  ALCHEMY_DASHBOARD_URL,
  GITHUB_URL,
  MORPHO_APP_VAULTS_URL,
  MORPHO_BOTS_GITHUB_URL,
  MORPHO_CURATOR_V2_VAULTS_URL,
  MORPHO_CURATOR_CREATE_MARKET_URL,
  MORPHO_CURATOR_CREATE_VAULT_URL,
  MORPHO_DOCS_GET_STARTED_URL,
  MORPHO_FIXED_RATE_MARKETS_URL,
  MORPHO_LIQUIDATION_APP_URL,
  MORPHO_ORACLE_PORTAL_URL,
  MORPHO_VARIABLE_RATE_MARKETS_URL,
  VERCEL_URL,
  WALLETCONNECT_DASHBOARD_URL,
} from '@/lib/constants';

type HubLink = {
  title: string;
  description: string;
  href: string;
  icon: typeof Shield;
  external?: boolean;
};

const IN_APP_TOOLS: readonly HubLink[] = [
  {
    title: 'Multisig Safe',
    description: 'Queue and execute Curator / Allocator / Sentinel Safe transactions.',
    href: '/safe',
    icon: Users,
  },
];

const CURATOR_EXTERNAL: readonly HubLink[] = [
  {
    title: 'Morpho Curator',
    description: 'curator.morpho.org — Vault V2 caps, roles, and emergency actions.',
    href: MORPHO_CURATOR_V2_VAULTS_URL,
    icon: Shield,
    external: true,
  },
  {
    title: 'Create Morpho Blue market',
    description: 'Official Morpho Curator create-market flow.',
    href: MORPHO_CURATOR_CREATE_MARKET_URL,
    icon: Plus,
    external: true,
  },
  {
    title: 'Create Morpho Vault V2',
    description: 'Official Morpho Curator vault setup (identity, adapter, roles, fees).',
    href: MORPHO_CURATOR_CREATE_VAULT_URL,
    icon: Shield,
    external: true,
  },
  {
    title: 'Oracle Portal',
    description: 'Build, decode, and validate oracles before deploy.',
    href: MORPHO_ORACLE_PORTAL_URL,
    icon: Sparkles,
    external: true,
  },
  {
    title: 'Morpho Bots',
    description: 'Official Morpho automation bots for allocating and monitoring vaults.',
    href: MORPHO_BOTS_GITHUB_URL,
    icon: Bot,
    external: true,
  },
  {
    title: 'Morpho Docs',
    description: 'Get started with Morpho — Earn, Borrow, curate, API, and SDK.',
    href: MORPHO_DOCS_GET_STARTED_URL,
    icon: BookOpen,
    external: true,
  },
];

const ACCOUNT_LINKS: readonly HubLink[] = [
  {
    title: 'GitHub',
    description: 'Host this repo.',
    href: GITHUB_URL,
    icon: GitFork,
    external: true,
  },
  {
    title: 'Vercel',
    description: 'Deploy the app and the curator dashboard.',
    href: VERCEL_URL,
    icon: Cloud,
    external: true,
  },
  {
    title: 'WalletConnect',
    description: 'Create a project ID for wallet connect.',
    href: WALLETCONNECT_DASHBOARD_URL,
    icon: Wallet,
    external: true,
  },
  {
    title: 'Alchemy',
    description: 'Create an API key for Base.',
    href: ALCHEMY_DASHBOARD_URL,
    icon: KeyRound,
    external: true,
  },
];

const USER_LINKS: readonly HubLink[] = [
  {
    title: 'Morpho App — Vaults',
    description: 'Browse and deposit into Morpho vaults.',
    href: MORPHO_APP_VAULTS_URL,
    icon: LayoutGrid,
    external: true,
  },
  {
    title: 'Morpho Markets — Fixed rate',
    description: 'Fixed-term markets (lend or borrow until maturity).',
    href: MORPHO_FIXED_RATE_MARKETS_URL,
    icon: LayoutGrid,
    external: true,
  },
  {
    title: 'Morpho App — Variable rate',
    description: 'Variable-rate Morpho Blue markets.',
    href: MORPHO_VARIABLE_RATE_MARKETS_URL,
    icon: LayoutGrid,
    external: true,
  },
  {
    title: 'Liquidation App',
    description: 'Morpho liquidation interface for Blue markets.',
    href: MORPHO_LIQUIDATION_APP_URL,
    icon: Droplets,
    external: true,
  },
];

function HubLinkRow({ tool }: { tool: HubLink }) {
  const Icon = tool.icon;
  const className =
    'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40';
  const inner = (
    <>
      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {tool.title}
          {tool.external ? (
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          ) : null}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {tool.description}
        </span>
      </span>
    </>
  );

  if (tool.external) {
    return (
      <a href={tool.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={tool.href} className={className}>
      {inner}
    </Link>
  );
}

export default function CuratorToolsPage() {
  return (
    <AppShell
      title="Curator tools"
      description="Curator hub — in-app flows and official Morpho surfaces."
    >
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <section className="space-y-3">
          <CuratorSectionHeader
            title="In this app"
            description="Shortcuts into Vaults, Markets, and Safe. Primary nav is in the top bar."
          />
          <CuratorPanel>
            <div className="divide-y divide-border">
              {IN_APP_TOOLS.map((tool) => (
                <HubLinkRow key={tool.href} tool={tool} />
              ))}
            </div>
          </CuratorPanel>
        </section>

        <section className="space-y-3">
          <CuratorSectionHeader
            title="Curator external"
            description="curator.morpho.org, the oracle portal, Morpho bots, and the docs."
          />
          <CuratorPanel>
            <div className="divide-y divide-border">
              {CURATOR_EXTERNAL.map((tool) => (
                <HubLinkRow key={tool.href} tool={tool} />
              ))}
            </div>
          </CuratorPanel>
        </section>

        <section className="space-y-3">
          <CuratorSectionHeader
            title="Accounts"
            description="GitHub, Vercel, WalletConnect, and Alchemy. Create these before you deploy."
          />
          <CuratorPanel>
            <div className="divide-y divide-border">
              {ACCOUNT_LINKS.map((tool) => (
                <HubLinkRow key={tool.href} tool={tool} />
              ))}
            </div>
          </CuratorPanel>
        </section>

        <section className="space-y-3">
          <CuratorSectionHeader
            title="User"
            description="Public Morpho apps: vaults, fixed-rate markets, and variable-rate markets."
          />
          <CuratorPanel>
            <div className="divide-y divide-border">
              {USER_LINKS.map((tool) => (
                <HubLinkRow key={tool.href} tool={tool} />
              ))}
            </div>
          </CuratorPanel>
        </section>
      </div>
    </AppShell>
  );
}
