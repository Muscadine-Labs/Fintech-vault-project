'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { KpiCard } from '@/components/KpiCard';
import { useProtocolStats } from '@/lib/hooks/useProtocolStats';
import { AppShell } from '@/components/layout/AppShell';
import {
  ProtocolStatsDetail,
  type ProtocolStatKey,
} from '@/components/overview/ProtocolStatsDetail';

const ChartTvl = dynamic(() => import('@/components/ChartTvl').then(mod => ({ default: mod.ChartTvl })), {
  loading: () => <div className="h-72 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />,
  ssr: false,
});

export default function Home() {
  const { data: stats, isLoading } = useProtocolStats();
  const [selectedStat, setSelectedStat] = useState<ProtocolStatKey | null>(null);

  const toggleStat = (key: ProtocolStatKey) => {
    setSelectedStat((prev) => (prev === key ? null : key));
  };

  return (
    <AppShell
      title="Overview"
      description="Select a vault from the sidebar to view risk and configuration."
    >
      <div className="space-y-6">
        {stats?.warning ? (
          <p className="rounded-lg border border-amber-500/50 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-200">
            {stats.warning}
          </p>
        ) : null}
        <div className="rounded-lg border bg-card/40 p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <p className="col-span-full text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Protocol
            </p>
            <KpiCard
              title="TVL"
              value={stats?.totalDeposited || 0}
              isLoading={isLoading}
              format="usd_full"
              compact
              className="border-0 bg-muted/40 shadow-none py-2"
              onClick={() => toggleStat('tvl')}
              selected={selectedStat === 'tvl'}
            />
            <KpiCard
              title="Users"
              value={stats?.users || 0}
              isLoading={isLoading}
              format="number"
              compact
              className="border-0 bg-muted/40 shadow-none py-2"
              onClick={() => toggleStat('users')}
              selected={selectedStat === 'users'}
            />
            <KpiCard
              title="Active Vaults"
              value={stats?.activeVaults || 0}
              isLoading={isLoading}
              format="number"
              compact
              className="border-0 bg-muted/40 shadow-none py-2"
              onClick={() => toggleStat('vaults')}
              selected={selectedStat === 'vaults'}
            />
          </div>

          {selectedStat && (
            <div className="border-t border-border/60 pt-3">
              <ProtocolStatsDetail selected={selectedStat} stats={stats} />
            </div>
          )}
        </div>

        <ChartTvl
          totalData={stats?.tvlTrend}
          vaultData={stats?.tvlByVault}
          isLoading={isLoading}
          title="TVL Over Time"
          breakdownLabel="By Vault"
        />
      </div>
    </AppShell>
  );
}
