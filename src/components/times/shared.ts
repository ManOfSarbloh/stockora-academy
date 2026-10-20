/** Formatting helpers and constants shared by the Trading Times components. */
import { useEffect, useState } from 'react';
import { getLocale, intlLocale, t } from '@/i18n';
import type { MarketState } from '@/lib/market-hours';

export const DEFAULT_ZONE = 'Europe/Vienna';

export const COMMON_ZONES = [
  'Europe/Vienna',
  'Europe/Berlin',
  'Europe/Zurich',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Sao_Paulo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Hong_Kong',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
];

/** Every IANA zone the browser knows, if it can list them. */
export function allZones(): string[] {
  try {
    const f = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf;
    return f ? f('timeZone') : COMMON_ZONES;
  } catch {
    return COMMON_ZONES;
  }
}

export function deviceZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

/** "Europe/Vienna" → "Vienna" */
export const zoneLabel = (z: string) => z.split('/').pop()!.replace(/_/g, ' ');

/** Re-render on a timer so live status and countdowns stay current. */
export function useNow(intervalMs = 15000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    const onVis = () => document.visibilityState === 'visible' && setNow(new Date());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [intervalMs]);
  return now;
}

/** 45 min / 2 h 05 min / 3 days */
export function fmtDuration(ms: number): string {
  const min = Math.max(0, Math.round(ms / 60000));
  if (min < 60) return t('tt.duration.min', { m: min });
  if (min < 48 * 60) return t('tt.duration.hmin', { h: Math.floor(min / 60), m: String(min % 60).padStart(2, '0') });
  return t('tt.duration.days', { d: Math.round(min / 1440) });
}

/** "Tue 13 Oct" for a calendar date string (zone-independent). */
export function fmtDay(date: string, withYear = false): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Intl.DateTimeFormat(intlLocale[getLocale()], {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: withYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Visual treatment per state: colour token, symbol (never colour alone) and label. */
export const STATE_STYLE: Record<MarketState, { cls: string; symbol: string }> = {
  open: { cls: 'tt-open', symbol: '●' },
  auction: { cls: 'tt-auction', symbol: '◆' },
  pre: { cls: 'tt-ext', symbol: '◐' },
  post: { cls: 'tt-ext', symbol: '◑' },
  lunch: { cls: 'tt-pause', symbol: '❙❙' },
  closed: { cls: 'tt-closed', symbol: '○' },
  holiday: { cls: 'tt-closed', symbol: '✕' },
  weekend: { cls: 'tt-closed', symbol: '○' },
  unknown: { cls: 'tt-closed', symbol: '?' },
};
