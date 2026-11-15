import { redirect } from 'next/navigation';
import { configuredSafeAccounts } from '@/lib/safe/config';

export default function SafeIndexPage() {
  const real = configuredSafeAccounts();
  if (real.length === 1) redirect(`/safe/${real[0].role}`);
  if (real.length > 1) redirect(`/safe/${real[0].role}`);
  return null;
}
