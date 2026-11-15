import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rateLimitIdentifier, resolveClientIp } from '@/lib/utils/rate-limit';

function req(headers: Record<string, string>): Request {
  return new Request('http://localhost:3001/api/markets', { headers });
}

const ORIGINAL_VERCEL = process.env.VERCEL;

beforeEach(() => {
  delete process.env.VERCEL;
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (ORIGINAL_VERCEL === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = ORIGINAL_VERCEL;
});

describe('resolveClientIp', () => {
  it('ignores caller-supplied forwarding headers', () => {
    expect(resolveClientIp(req({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }))).toBe('unknown');
    expect(resolveClientIp(req({ 'cf-connecting-ip': '9.9.9.9' }))).toBe('unknown');
    expect(resolveClientIp(req({ 'true-client-ip': '9.9.9.9' }))).toBe('unknown');
    expect(resolveClientIp(req({ 'x-real-ip': '9.9.9.9' }))).toBe('unknown');
  });

  it('ignores x-vercel-forwarded-for when not running on Vercel', () => {
    expect(resolveClientIp(req({ 'x-vercel-forwarded-for': '9.9.9.9' }))).toBe('unknown');
  });

  it('uses x-vercel-forwarded-for on Vercel', () => {
    process.env.VERCEL = '1';
    expect(resolveClientIp(req({ 'x-vercel-forwarded-for': '5.6.7.8, 1.1.1.1' }))).toBe('5.6.7.8');
  });

  it('prefers the Vercel header over a caller-supplied x-forwarded-for', () => {
    process.env.VERCEL = '1';
    expect(
      resolveClientIp(
        req({
          'x-forwarded-for': 'spoofed, 203.0.113.7',
          'x-vercel-forwarded-for': '5.6.7.8',
        })
      )
    ).toBe('5.6.7.8');
  });

  it('reports a stable identifier when no headers are present', () => {
    expect(resolveClientIp(req({}))).toBe('unknown');
  });
});

describe('rateLimitIdentifier', () => {
  it('keys each endpoint path separately for the same client', () => {
    process.env.VERCEL = '1';
    const headers = { 'x-vercel-forwarded-for': '1.2.3.4' };
    const a = new Request('https://x.test/api/vaults/0xAB/risk', { headers });
    const b = new Request('https://x.test/api/vaults/0xab/governance', { headers });
    expect(rateLimitIdentifier(a)).not.toBe(rateLimitIdentifier(b));
    expect(rateLimitIdentifier(a)).toBe(
      rateLimitIdentifier(new Request('https://x.test/api/vaults/0xcd/risk', { headers }))
    );
    expect(rateLimitIdentifier(a)).toBe(
      rateLimitIdentifier(new Request('https://x.test/api/vaults/0xab/risk?x=1', { headers }))
    );
  });

  it('does not mint a new bucket when the caller rotates x-forwarded-for', () => {
    const a = rateLimitIdentifier(
      new Request('https://x.test/api/markets', { headers: { 'x-forwarded-for': '1.1.1.1' } })
    );
    const b = rateLimitIdentifier(
      new Request('https://x.test/api/markets', { headers: { 'x-forwarded-for': '2.2.2.2' } })
    );
    expect(a).toBe(b);
  });
});
