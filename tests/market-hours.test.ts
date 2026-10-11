import { describe, expect, it } from 'vitest';
import exchangesData from '../content/exchanges.json';
import {
  addDays,
  convertLocalTime,
  daySchedule,
  dstTransitions,
  gapPeriods,
  intersect,
  localSessions,
  minutesToHHMM,
  offsetMinutes,
  regularMinutesIn,
  regularOnly,
  statusAt,
  timelineForViewerDay,
  weekdayOf,
  zonedDate,
  zonedTime,
  zonedTimeToUtc,
  type Exchange,
} from '../src/lib/market-hours';

const exchanges = exchangesData as unknown as Exchange[];
const ex = (id: string) => {
  const e = exchanges.find((x) => x.id === id);
  if (!e) throw new Error(id);
  return e;
};
const iso = (d: Date) => d.toISOString().slice(0, 16) + 'Z';
const at = (s: string) => new Date(s);

describe('time-zone conversion', () => {
  it('converts wall-clock times on both sides of the European DST switch', () => {
    expect(iso(zonedTimeToUtc('2026-03-27', '09:00', 'Europe/Vienna'))).toBe('2026-03-27T08:00Z');
    expect(iso(zonedTimeToUtc('2026-03-30', '09:00', 'Europe/Vienna'))).toBe('2026-03-30T07:00Z');
    expect(iso(zonedTimeToUtc('2026-10-26', '09:00', 'Europe/Vienna'))).toBe('2026-10-26T08:00Z');
  });
  it('handles times skipped or repeated by a DST change', () => {
    // 02:30 does not exist in Vienna on 29 March 2026; it resolves after the jump.
    expect(iso(zonedTimeToUtc('2026-03-29', '02:30', 'Europe/Vienna'))).toBe('2026-03-29T01:30Z');
    // 02:30 happens twice on 25 October 2026; the first occurrence is used.
    expect(iso(zonedTimeToUtc('2026-10-25', '02:30', 'Europe/Vienna'))).toBe('2026-10-25T00:30Z');
  });
  it('reads dates, times and offsets in a zone', () => {
    const t = at('2026-07-01T22:30:00Z');
    expect(zonedDate(t, 'Europe/Vienna')).toBe('2026-07-02');
    expect(zonedTime(t, 'Europe/Vienna')).toBe('00:30');
    expect(offsetMinutes(t, 'Europe/Vienna')).toBe(120);
    expect(offsetMinutes(t, 'Asia/Kolkata')).toBe(330);
    expect(offsetMinutes(t, 'America/New_York')).toBe(-240);
  });
  it('does calendar arithmetic', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(weekdayOf('2026-10-11')).toBe(0); // Sunday
  });
  it('converts a market time to another zone, with the day shift', () => {
    expect(convertLocalTime('2026-01-15', '09:30', 'America/New_York', 'Europe/Vienna')).toMatchObject({ date: '2026-01-15', time: '15:30', dayShift: 0 });
    expect(convertLocalTime('2026-01-15', '09:00', 'Asia/Tokyo', 'Europe/Vienna')).toMatchObject({ date: '2026-01-15', time: '01:00', dayShift: 0 });
    expect(convertLocalTime('2026-01-15', '20:00', 'America/New_York', 'Asia/Tokyo')).toMatchObject({ date: '2026-01-16', time: '10:00', dayShift: 1 });
  });
});

describe('DST transitions (computed, not hard-coded)', () => {
  it('finds the 2026 switch dates in Europe, the US and Australia', () => {
    expect(dstTransitions('Europe/Vienna', 2026).map((t) => iso(t.instant))).toEqual(['2026-03-29T01:00Z', '2026-10-25T01:00Z']);
    expect(dstTransitions('America/New_York', 2026).map((t) => iso(t.instant))).toEqual(['2026-03-08T07:00Z', '2026-11-01T06:00Z']);
    const syd = dstTransitions('Australia/Sydney', 2026);
    expect(syd.map((t) => zonedDate(t.instant, 'UTC'))).toEqual(['2026-04-04', '2026-10-03']);
    expect(syd[0].offsetBefore).toBe(660);
    expect(syd[0].offsetAfter).toBe(600);
  });
  it('finds no transitions in zones without DST', () => {
    expect(dstTransitions('Asia/Tokyo', 2026)).toEqual([]);
    expect(dstTransitions('America/Sao_Paulo', 2026)).toEqual([]);
  });
  it('splits the year into periods with a constant Vienna–New York gap', () => {
    const p = gapPeriods('Europe/Vienna', 'America/New_York', 2026);
    expect(p.map((x) => x.gapMinutes / 60)).toEqual([-6, -5, -6, -5, -6]);
    expect(p.map((x) => zonedDate(x.from, 'UTC'))).toEqual(['2026-01-01', '2026-03-08', '2026-03-29', '2026-10-25', '2026-11-01']);
  });
});

describe('NYSE core session seen from Vienna', () => {
  const nyse = ex('nyse');
  const inVienna = (date: string) =>
    regularOnly(daySchedule(nyse, date).intervals).map((i) => `${zonedTime(i.start, 'Europe/Vienna')}-${zonedTime(i.end, 'Europe/Vienna')}`)[0];
  it('is normally 15:30–22:00', () => {
    expect(inVienna('2026-01-15')).toBe('15:30-22:00');
    expect(inVienna('2026-07-15')).toBe('15:30-22:00');
    expect(inVienna('2026-11-03')).toBe('15:30-22:00');
  });
  it('is an hour earlier while only one side has switched', () => {
    expect(inVienna('2026-03-16')).toBe('14:30-21:00');
    expect(inVienna('2026-10-27')).toBe('14:30-21:00');
  });
});

describe('weekends, holidays and status', () => {
  it('reports weekends and the next opening', () => {
    const s = statusAt(ex('wiener-boerse'), at('2026-10-10T10:00:00Z')); // Saturday
    expect(s.state).toBe('weekend');
    expect(s.nextState).toBe('auction');
    expect(iso(s.nextChange!)).toBe('2026-10-12T06:55Z'); // Monday 08:55 Vienna (CEST)
  });
  it('reports exchange holidays and skips them for the next opening', () => {
    const s = statusAt(ex('wiener-boerse'), at('2026-12-24T09:00:00Z'));
    expect(s.state).toBe('holiday');
    expect(s.day.holiday?.name).toBe('Christmas Eve');
    expect(zonedDate(s.nextChange!, 'Europe/Vienna')).toBe('2026-12-28');
  });
  it('knows Vienna trades on some public holidays', () => {
    expect(daySchedule(ex('wiener-boerse'), '2026-12-08').kind).toBe('trading');
  });
  it('shows open, auction and closed phases with countdown targets', () => {
    const vie = ex('wiener-boerse');
    expect(statusAt(vie, at('2026-10-13T08:00:00Z')).state).toBe('open'); // 10:00 local
    const auction = statusAt(vie, at('2026-10-13T15:31:00Z')); // 17:31 local
    expect(auction.state).toBe('auction');
    expect(auction.nextState).toBe('post');
    const closed = statusAt(vie, at('2026-10-13T17:00:00Z')); // 19:00 local
    expect(closed.state).toBe('closed');
    expect(iso(closed.nextChange!)).toBe('2026-10-14T06:55Z');
  });
  it('handles the Tokyo lunch break', () => {
    const s = statusAt(ex('jpx'), at('2026-10-13T03:00:00Z')); // 12:00 JST
    expect(s.state).toBe('lunch');
    expect(zonedTime(s.nextChange!, 'Asia/Tokyo')).toBe('12:30');
    expect(s.nextState).toBe('open');
  });
  it('handles pre-market and after-hours in New York', () => {
    expect(statusAt(ex('nyse'), at('2026-10-13T12:00:00Z')).state).toBe('pre'); // 08:00 ET
    expect(statusAt(ex('nyse'), at('2026-10-13T21:00:00Z')).state).toBe('post'); // 17:00 ET
  });
  it('flags years without an official holiday list', () => {
    expect(daySchedule(ex('euronext-paris'), '2027-03-01').holidaysUnknown).toBe(true);
    expect(daySchedule(ex('euronext-paris'), '2026-03-02').holidaysUnknown).toBe(false);
    expect(daySchedule(ex('sgx'), '2026-10-13').holidaysUnknown).toBe(true);
  });
  it('stops at the end of confirmed hours', () => {
    expect(daySchedule(ex('b3'), '2026-11-03').kind).toBe('hours-unconfirmed');
    expect(statusAt(ex('b3'), at('2026-11-03T15:00:00Z')).state).toBe('unknown');
  });
});

describe('special days', () => {
  it('applies early closes with the closing auction moved forward', () => {
    const lse = localSessions(ex('lse'), '2026-12-24', ex('lse').holidays.find((h) => h.date === '2026-12-24'));
    expect(lse.map((s) => `${s.type} ${minutesToHHMM(s.start)}-${minutesToHHMM(s.end)}`)).toEqual([
      'auction-open 07:50-08:00',
      'regular 08:00-12:30',
      'auction-close 12:30-12:35',
    ]);
  });
  it('keeps a shortened extended session where the exchange publishes one', () => {
    const d = daySchedule(ex('nyse'), '2026-11-27');
    const fmt = d.intervals.map((i) => `${i.type} ${zonedTime(i.start, 'America/New_York')}-${zonedTime(i.end, 'America/New_York')}`);
    expect(fmt).toEqual(['pre 04:00-09:30', 'regular 09:30-13:00', 'post 13:00-17:00']);
  });
  it('drops the lunch break and afternoon on Hong Kong half days', () => {
    const d = daySchedule(ex('hkex'), '2026-12-24');
    const fmt = d.intervals.map((i) => `${i.type} ${zonedTime(i.start, 'Asia/Hong_Kong')}-${zonedTime(i.end, 'Asia/Hong_Kong')}`);
    expect(fmt).toEqual(['auction-open 09:00-09:30', 'regular 09:30-12:00', 'auction-close 12:00-12:10']);
  });
  it('applies late openings', () => {
    const d = daySchedule(ex('b3'), '2026-02-18');
    const fmt = d.intervals.map((i) => `${i.type} ${zonedTime(i.start, 'America/Sao_Paulo')}-${zonedTime(i.end, 'America/Sao_Paulo')}`);
    expect(fmt[0]).toBe('auction-open 12:45-13:00');
    expect(fmt[1]).toBe('regular 13:00-16:55');
  });
  it('uses a different Friday schedule in Tel Aviv and no Sunday trading', () => {
    const fri = daySchedule(ex('tase'), '2026-10-16');
    expect(zonedTime(regularOnly(fri.intervals)[0].end, 'Asia/Jerusalem')).toBe('13:34');
    const thu = daySchedule(ex('tase'), '2026-10-15');
    expect(zonedTime(regularOnly(thu.intervals)[0].end, 'Asia/Jerusalem')).toBe('17:14');
    expect(daySchedule(ex('tase'), '2026-10-11').kind).toBe('weekend');
  });
  it('marks half days whose hours are not published', () => {
    const d = daySchedule(ex('euronext-paris'), '2026-12-24');
    expect(d.kind).toBe('trading');
    expect(d.halfDayHoursUnknown).toBe(true);
  });
});

describe('timeline, overlaps and the trading helper', () => {
  it('places an exchange day on the viewer timeline', () => {
    const { segments } = timelineForViewerDay(ex('nyse'), '2026-01-15', 'Europe/Vienna');
    const reg = segments.find((s) => s.type === 'regular')!;
    expect([reg.startMin, reg.endMin]).toEqual([15.5 * 60, 22 * 60]);
    // NYSE's late session runs past Vienna midnight and is cut at the end of the day.
    expect(segments[segments.length - 1].endMin).toBe(24 * 60);
  });
  it('includes sessions from the previous exchange day (Sydney seen from Vienna)', () => {
    const { segments } = timelineForViewerDay(ex('asx'), '2026-01-15', 'Europe/Vienna');
    // 10:00–16:00 Sydney (UTC+11) on the 15th = 00:00–06:00 in Vienna (UTC+1).
    const reg = segments.find((s) => s.type === 'regular')!;
    expect([reg.startMin, reg.endMin]).toEqual([0, 6 * 60]);
  });
  it('computes the Europe–US overlap', () => {
    const lse = regularOnly(daySchedule(ex('lse'), '2026-01-15').intervals);
    const nyse = regularOnly(daySchedule(ex('nyse'), '2026-01-15').intervals);
    const o = intersect(lse, nyse);
    expect(o.map((x) => `${zonedTime(x.start, 'Europe/London')}-${zonedTime(x.end, 'Europe/London')}`)).toEqual(['14:30-16:30']);
  });
  it('counts regular trading minutes inside a window', () => {
    const from = zonedTimeToUtc('2026-10-13', '18:00', 'Europe/Vienna');
    const to = zonedTimeToUtc('2026-10-13', '22:00', 'Europe/Vienna');
    expect(regularMinutesIn(ex('nyse'), from, to)).toBe(240);
    expect(regularMinutesIn(ex('wiener-boerse'), from, to)).toBe(0);
  });
});
