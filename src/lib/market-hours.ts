/**
 * Market hours logic for the Trading Times tool. Pure functions, unit-tested.
 *
 * Exchange sessions are stored in local exchange time. Every conversion goes through the
 * runtime's IANA time-zone database (Intl), so daylight saving time is computed, never hard-coded.
 * Dates are handled as "YYYY-MM-DD" strings in a given zone; instants as JS Date objects.
 */

export type SessionType = 'pre' | 'auction-open' | 'regular' | 'lunch' | 'auction-close' | 'post';

export interface Session {
  type: SessionType;
  start: string; // "HH:MM" local
  end: string;
  label?: string;
}

export interface Holiday {
  date: string;
  name: string;
  earlyClose?: string;
  earlyPostClose?: string;
  lateOpen?: string;
  halfDay?: boolean;
}

export interface Exchange {
  id: string;
  name: string;
  shortName: string;
  city: string;
  country: string;
  region: string;
  timeZone: string;
  website: string;
  hoursSource: string;
  sessions: Session[];
  weekdaySessions?: Record<string, Session[]>;
  tradingDays?: number[];
  sessionsValidUntil?: string;
  holidays: Holiday[];
  holidaysSource: string;
  holidayYears: number[];
  extraSources?: { title: string; url: string }[];
  asOf: string;
  notes?: string;
}

// ---------------------------------------------------------------------------------------------
// Time-zone helpers
// ---------------------------------------------------------------------------------------------

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = fmtCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short',
    });
    fmtCache.set(timeZone, f);
  }
  return f;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number; // 0 = Sunday
}

/** Calendar date and wall-clock time of an instant in a time zone. */
export function zonedParts(instant: Date, timeZone: string): ZonedParts {
  const p: Record<string, string> = {};
  for (const x of partsFormatter(timeZone).formatToParts(instant)) p[x.type] = x.value;
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour) % 24,
    minute: Number(p.minute),
    second: Number(p.second),
    weekday: WEEKDAYS.indexOf(p.weekday),
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "YYYY-MM-DD" of an instant in a time zone. */
export function zonedDate(instant: Date, timeZone: string): string {
  const p = zonedParts(instant, timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** "HH:MM" of an instant in a time zone. */
export function zonedTime(instant: Date, timeZone: string): string {
  const p = zonedParts(instant, timeZone);
  return `${pad(p.hour)}:${pad(p.minute)}`;
}

/** UTC offset of a time zone at an instant, in minutes (e.g. +60 for Vienna in winter). */
export function offsetMinutes(instant: Date, timeZone: string): number {
  const p = zonedParts(instant, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(instant.getTime() / 1000) * 1000) / 60000);
}

const parseDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return { y, m, day };
};
const parseTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
export const minutesToHHMM = (min: number) => `${pad(Math.floor(min / 60) % 24)}:${pad(min % 60)}`;

/**
 * The instant at which the wall clock in `timeZone` shows `date` `time`.
 * Times that do not exist (skipped by a DST jump) resolve to the moment after the jump;
 * ambiguous times (repeated by a DST fall-back) resolve to the first occurrence.
 */
export function zonedTimeToUtc(date: string, time: string, timeZone: string): Date {
  const { y, m, day } = parseDate(date);
  const mins = parseTime(time);
  const naive = Date.UTC(y, m - 1, day, Math.floor(mins / 60), mins % 60);
  // Offsets in force half a day before and after cover both sides of any DST change.
  const before = offsetMinutes(new Date(naive - 12 * 3600000), timeZone);
  const after = offsetMinutes(new Date(naive + 12 * 3600000), timeZone);
  const valid = [before, after]
    .map((o) => naive - o * 60000)
    .filter((t) => offsetMinutes(new Date(t), timeZone) * 60000 === naive - t);
  if (valid.length) return new Date(Math.min(...valid)); // ambiguous: first occurrence
  return new Date(naive - before * 60000); // skipped time: the moment after the jump
}

/** Add whole days to a "YYYY-MM-DD" date (calendar arithmetic, zone-independent). */
export function addDays(date: string, n: number): string {
  const { y, m, day } = parseDate(date);
  const d = new Date(Date.UTC(y, m - 1, day + n));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Day of the week of a calendar date (0 = Sunday). */
export function weekdayOf(date: string): number {
  const { y, m, day } = parseDate(date);
  return new Date(Date.UTC(y, m - 1, day)).getUTCDay();
}

// ---------------------------------------------------------------------------------------------
// Daylight saving time
// ---------------------------------------------------------------------------------------------

export interface Transition {
  instant: Date;
  offsetBefore: number;
  offsetAfter: number;
}

/** Every change of UTC offset in a zone during a calendar year (empty for zones without DST). */
export function dstTransitions(timeZone: string, year: number): Transition[] {
  const out: Transition[] = [];
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const step = 6 * 3600 * 1000;
  let prevT = start;
  let prevO = offsetMinutes(new Date(start), timeZone);
  for (let t = start + step; t <= end; t += step) {
    const o = offsetMinutes(new Date(t), timeZone);
    if (o !== prevO) {
      // Binary search to the minute.
      let lo = prevT;
      let hi = t;
      while (hi - lo > 60000) {
        const mid = Math.floor((lo + hi) / 2 / 60000) * 60000;
        if (offsetMinutes(new Date(mid), timeZone) === prevO) lo = mid;
        else hi = mid;
      }
      if (hi < end) out.push({ instant: new Date(hi), offsetBefore: prevO, offsetAfter: o });
      prevO = o;
    }
    prevT = t;
  }
  return out;
}

export interface GapPeriod {
  from: Date;
  to: Date;
  /** Clock difference zoneB − zoneA in minutes (e.g. −360: New York is six hours behind Vienna). */
  gapMinutes: number;
}

/** Periods of a year with a constant clock difference between two zones. */
export function gapPeriods(zoneA: string, zoneB: string, year: number): GapPeriod[] {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  const cuts = [...dstTransitions(zoneA, year), ...dstTransitions(zoneB, year)]
    .map((t) => t.instant.getTime())
    .sort((a, b) => a - b);
  const bounds = [start.getTime(), ...cuts, end.getTime()];
  const out: GapPeriod[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    if (bounds[i + 1] <= bounds[i]) continue;
    const probe = new Date(bounds[i]);
    const gap = offsetMinutes(probe, zoneB) - offsetMinutes(probe, zoneA);
    const last = out[out.length - 1];
    if (last && last.gapMinutes === gap) last.to = new Date(bounds[i + 1]);
    else out.push({ from: new Date(bounds[i]), to: new Date(bounds[i + 1]), gapMinutes: gap });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Exchange schedules
// ---------------------------------------------------------------------------------------------

export interface Interval {
  type: SessionType;
  label?: string;
  start: Date;
  end: Date;
}

export type DayKind = 'trading' | 'weekend' | 'holiday' | 'hours-unconfirmed';

export interface DaySchedule {
  date: string;
  kind: DayKind;
  holiday?: Holiday;
  intervals: Interval[];
  /** No official holiday list for this year is included, so the day may be a holiday. */
  holidaysUnknown: boolean;
  /** Shortened day without published hours: intervals show the normal day. */
  halfDayHoursUnknown: boolean;
}

/** Local sessions of one day after applying early closes and late opens (minutes since local midnight). */
export function localSessions(ex: Exchange, date: string, holiday?: Holiday): { type: SessionType; label?: string; start: number; end: number }[] {
  const base = ex.weekdaySessions?.[String(weekdayOf(date))] ?? ex.sessions;
  let s = base.map((x) => ({ type: x.type, label: x.label, start: parseTime(x.start), end: parseTime(x.end) }));

  if (holiday?.lateOpen) {
    const lo = parseTime(holiday.lateOpen);
    s = s.flatMap((x) => {
      if (x.type === 'auction-open') {
        const dur = x.end - x.start;
        return [{ ...x, start: lo - dur, end: lo }];
      }
      if (x.type === 'pre' || x.type === 'lunch') return x.end <= lo ? [] : [{ ...x, start: Math.max(x.start, lo) }];
      if (x.type === 'regular') return x.end <= lo ? [] : [{ ...x, start: Math.max(x.start, lo) }];
      return [x];
    });
  }

  if (holiday?.earlyClose) {
    const ec = parseTime(holiday.earlyClose);
    const closeAuction = s.find((x) => x.type === 'auction-close');
    const auctionDur = closeAuction ? closeAuction.end - closeAuction.start : 0;
    s = s.flatMap((x) => {
      if (x.type === 'regular' || x.type === 'lunch') {
        if (x.start >= ec) return [];
        return x.type === 'lunch' && x.end > ec ? [] : [{ ...x, end: Math.min(x.end, ec) }];
      }
      if (x.type === 'auction-close') return [{ ...x, start: ec, end: ec + auctionDur }];
      if (x.type === 'post') {
        if (!holiday.earlyPostClose) return [];
        return [{ ...x, start: ec + auctionDur, end: parseTime(holiday.earlyPostClose) }];
      }
      return [x];
    });
  }
  return s.filter((x) => x.end > x.start).sort((a, b) => a.start - b.start);
}

/** The full schedule of an exchange for one local calendar date. */
export function daySchedule(ex: Exchange, date: string): DaySchedule {
  const year = Number(date.slice(0, 4));
  const holidaysUnknown = !ex.holidayYears.includes(year);
  const holiday = ex.holidays.find((h) => h.date === date);
  const base = { date, holiday, holidaysUnknown, halfDayHoursUnknown: false };
  const tradingDays = ex.tradingDays ?? [1, 2, 3, 4, 5];

  if (!tradingDays.includes(weekdayOf(date))) return { ...base, kind: 'weekend', intervals: [] };
  if (holiday && !holiday.earlyClose && !holiday.lateOpen && !holiday.halfDay) return { ...base, kind: 'holiday', intervals: [] };
  if (ex.sessionsValidUntil && date > ex.sessionsValidUntil) return { ...base, kind: 'hours-unconfirmed', intervals: [] };

  const intervals = localSessions(ex, date, holiday).map((x) => ({
    type: x.type,
    label: x.label,
    start: zonedTimeToUtc(date, minutesToHHMM(x.start), ex.timeZone),
    end: zonedTimeToUtc(date, minutesToHHMM(x.end), ex.timeZone),
  }));
  return { ...base, kind: 'trading', intervals, halfDayHoursUnknown: !!holiday?.halfDay };
}

// ---------------------------------------------------------------------------------------------
// Live status
// ---------------------------------------------------------------------------------------------

export type MarketState = 'open' | 'auction' | 'pre' | 'post' | 'lunch' | 'closed' | 'holiday' | 'weekend' | 'unknown';

export const stateOf = (t: SessionType): MarketState =>
  t === 'regular' ? 'open' : t === 'auction-open' || t === 'auction-close' ? 'auction' : t === 'lunch' ? 'lunch' : t;

export interface Status {
  state: MarketState;
  interval?: Interval;
  /** When the state changes next, and to what (undefined if nothing is known within two weeks). */
  nextChange?: Date;
  nextState?: MarketState;
  localDate: string;
  localTime: string;
  day: DaySchedule;
}

/** What an exchange is doing at an instant, and when that changes. */
export function statusAt(ex: Exchange, now: Date): Status {
  const localDate = zonedDate(now, ex.timeZone);
  const day = daySchedule(ex, localDate);
  const t = now.getTime();
  const current = day.intervals.find((i) => i.start.getTime() <= t && t < i.end.getTime());

  let state: MarketState;
  if (current) state = stateOf(current.type);
  else if (day.kind === 'holiday') state = 'holiday';
  else if (day.kind === 'weekend') state = 'weekend';
  else if (day.kind === 'hours-unconfirmed') state = 'unknown';
  else state = 'closed';

  // Next change: the end of the current interval if the next one does not start right then,
  // otherwise the start of the next interval (today or on a later day).
  let nextChange: Date | undefined;
  let nextState: MarketState | undefined;
  if (current) {
    const following = day.intervals.find((i) => i.start.getTime() === current.end.getTime());
    nextChange = current.end;
    nextState = following ? stateOf(following.type) : 'closed';
  } else if (state !== 'unknown') {
    for (let d = 0; d < 15 && !nextChange; d++) {
      const sched = d === 0 ? day : daySchedule(ex, addDays(localDate, d));
      if (sched.kind === 'hours-unconfirmed') break;
      const next = sched.intervals.find((i) => i.start.getTime() > t);
      if (next) {
        nextChange = next.start;
        nextState = stateOf(next.type);
      }
    }
  }
  return { state, interval: current, nextChange, nextState, localDate, localTime: zonedTime(now, ex.timeZone), day };
}

// ---------------------------------------------------------------------------------------------
// Timeline, overlaps and conversions
// ---------------------------------------------------------------------------------------------

export interface TimelineSegment {
  type: SessionType;
  label?: string;
  /** Minutes after the viewer's local midnight (may run to the day length, 1380–1500 on DST days). */
  startMin: number;
  endMin: number;
  start: Date;
  end: Date;
}

/** Midnight-to-midnight window of a calendar date in the viewer's zone. */
export function viewerDayWindow(date: string, viewerZone: string): { start: Date; end: Date; minutes: number } {
  const start = zonedTimeToUtc(date, '00:00', viewerZone);
  const end = zonedTimeToUtc(addDays(date, 1), '00:00', viewerZone);
  return { start, end, minutes: Math.round((end.getTime() - start.getTime()) / 60000) };
}

/** An exchange's sessions that fall on a calendar day in the viewer's time zone. */
export function timelineForViewerDay(ex: Exchange, viewerDate: string, viewerZone: string): { segments: TimelineSegment[]; days: DaySchedule[] } {
  const win = viewerDayWindow(viewerDate, viewerZone);
  const days = [-1, 0, 1].map((d) => daySchedule(ex, addDays(viewerDate, d)));
  const segments: TimelineSegment[] = [];
  for (const day of days) {
    for (const i of day.intervals) {
      const s = Math.max(i.start.getTime(), win.start.getTime());
      const e = Math.min(i.end.getTime(), win.end.getTime());
      if (e <= s) continue;
      segments.push({
        type: i.type,
        label: i.label,
        start: new Date(s),
        end: new Date(e),
        startMin: Math.round((s - win.start.getTime()) / 60000),
        endMin: Math.round((e - win.start.getTime()) / 60000),
      });
    }
  }
  return { segments: segments.sort((a, b) => a.startMin - b.startMin), days };
}

/** Intersection of two lists of time intervals. */
export function intersect(a: { start: Date; end: Date }[], b: { start: Date; end: Date }[]): { start: Date; end: Date }[] {
  const out: { start: Date; end: Date }[] = [];
  for (const x of a)
    for (const y of b) {
      const s = Math.max(x.start.getTime(), y.start.getTime());
      const e = Math.min(x.end.getTime(), y.end.getTime());
      if (e > s) out.push({ start: new Date(s), end: new Date(e) });
    }
  return out.sort((p, q) => p.start.getTime() - q.start.getTime());
}

/** Regular (continuous) trading intervals only. */
export const regularOnly = <T extends { type: SessionType }>(xs: T[]) => xs.filter((x) => x.type === 'regular');

/** Minutes of regular trading of an exchange inside a time window. */
export function regularMinutesIn(ex: Exchange, from: Date, to: Date): number {
  let total = 0;
  const startDate = zonedDate(from, ex.timeZone);
  const endDate = zonedDate(to, ex.timeZone);
  for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
    for (const i of regularOnly(daySchedule(ex, d).intervals)) {
      const s = Math.max(i.start.getTime(), from.getTime());
      const e = Math.min(i.end.getTime(), to.getTime());
      if (e > s) total += (e - s) / 60000;
    }
  }
  return Math.round(total);
}

/** Convert a wall-clock time from one zone to another. */
export function convertLocalTime(date: string, time: string, fromZone: string, toZone: string): { date: string; time: string; dayShift: number; instant: Date } {
  const instant = zonedTimeToUtc(date, time, fromZone);
  const toDate = zonedDate(instant, toZone);
  const shift = Math.round((Date.UTC(...ymd(toDate)) - Date.UTC(...ymd(date))) / 86400000);
  return { date: toDate, time: zonedTime(instant, toZone), dayShift: shift, instant };
}
const ymd = (d: string): [number, number, number] => {
  const { y, m, day } = parseDate(d);
  return [y, m - 1, day];
};
