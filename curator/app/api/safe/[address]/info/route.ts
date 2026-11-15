import { NextRequest, NextResponse } from 'next/server';
import { getAddress, isAddress } from 'viem';
import { readSafeOnChainInfo } from '@/lib/safe/onchain-reads';
import { fetchSafeProposers } from '@/lib/safe/fetch-safe-proposers.server';
import { getSafeByAddress, isPlaceholderSafeAddress } from '@/lib/safe/config';
import { mergeApiCacheHeaders } from '@/lib/api/response-cache';
import { handleApiError } from '@/lib/utils/error-handler';
import {
  createRateLimitMiddleware,
  MINUTE_MS,
  RATE_LIMIT_REQUESTS_PER_MINUTE,
} from '@/lib/utils/rate-limit';

type RouteParams = { params: Promise<{ address: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  // Keep each client to the shared per-route budget.
  const rateLimitResult = createRateLimitMiddleware(RATE_LIMIT_REQUESTS_PER_MINUTE, MINUTE_MS)(request);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429, headers: rateLimitResult.headers }
    );
  }
  try {
    const { address: raw } = await params;
    if (!isAddress(raw) || isPlaceholderSafeAddress(raw)) {
      return NextResponse.json({ error: 'Invalid Safe address' }, { status: 400 });
    }

    const address = getAddress(raw);
    // Only the Safes in lib/safe/config.ts: an open address parameter let anyone spend the
    // server's RPC budget reading arbitrary accounts.
    if (!getSafeByAddress(address)) {
      return NextResponse.json({ error: 'Not a configured Safe' }, { status: 404 });
    }
    const [info, proposersInfo] = await Promise.all([
      readSafeOnChainInfo(address),
      fetchSafeProposers(address),
    ]);
    const config = getSafeByAddress(address);

    return NextResponse.json(
      {
        ...info,
        ...proposersInfo,
        nonce: info.nonce.toString(),
        ethBalance: info.ethBalance.toString(),
        role: config?.role ?? null,
        label: config?.label ?? null,
      },
      { headers: mergeApiCacheHeaders(undefined, 15) }
    );
  } catch (error) {
    const { error: apiError, statusCode } = handleApiError(error, 'Failed to read Safe info');
    return NextResponse.json({ error: apiError.message }, { status: statusCode });
  }
}
