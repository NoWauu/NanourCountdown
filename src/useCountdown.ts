import { useEffect, useState } from 'react';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export type Phase = 'days' | 'hours' | 'minutes' | 'seconds' | 'arrived';

export interface Countdown {
  /** Milliseconds left, floored at 0. */
  remaining: number;
  /** Which unit the big counter is showing. */
  phase: Phase;
  /** The big counter itself, e.g. "J-42". */
  label: string;
  /** Full breakdown of the time left, largest unit first. */
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Share of the whole wait already served, 0 to 1. */
  progress: number;
}

/**
 * The counter shows one unit at a time and steps down as the wait shortens:
 * days while more than a day is left, then hours, then minutes, then seconds.
 */
function toLabel(phase: Phase, d: number, h: number, m: number, s: number): string {
  switch (phase) {
    case 'days':
      return `J-${d}`;
    case 'hours':
      return `H-${h}`;
    case 'minutes':
      return `M-${m}`;
    case 'seconds':
      return `S-${s}`;
    case 'arrived':
      return 'JOUR J';
  }
}

export function measure(target: Date, start: Date, now: Date = new Date()): Countdown {
  const remaining = Math.max(0, target.getTime() - now.getTime());

  const days = Math.floor(remaining / DAY);
  const hours = Math.floor((remaining % DAY) / HOUR);
  const minutes = Math.floor((remaining % HOUR) / MINUTE);
  const seconds = Math.floor((remaining % MINUTE) / SECOND);

  let phase: Phase;
  if (remaining <= 0) phase = 'arrived';
  else if (remaining >= DAY) phase = 'days';
  else if (remaining >= HOUR) phase = 'hours';
  else if (remaining >= MINUTE) phase = 'minutes';
  else phase = 'seconds';

  const span = target.getTime() - start.getTime();
  const served = now.getTime() - start.getTime();
  const progress = span > 0 ? Math.min(1, Math.max(0, served / span)) : 1;

  return { remaining, phase, label: toLabel(phase, days, hours, minutes, seconds), days, hours, minutes, seconds, progress };
}

/**
 * Two milestones, in order: the day I land in her city, then the day we move
 * in. The counter tracks whichever one is still ahead.
 */
export type Stage = 'travelling' | 'settling' | 'home';

export interface Journey extends Countdown {
  stage: Stage;
}

export interface JourneyDates {
  waitStartedAt: Date;
  arrivesAt: Date;
  movesInAt: Date;
}

export function measureJourney(dates: JourneyDates, now: Date = new Date()): Journey {
  const { waitStartedAt, arrivesAt, movesInAt } = dates;

  if (now.getTime() < arrivesAt.getTime()) {
    return { stage: 'travelling', ...measure(arrivesAt, waitStartedAt, now) };
  }

  const settling = measure(movesInAt, arrivesAt, now);
  return { stage: settling.phase === 'arrived' ? 'home' : 'settling', ...settling };
}

export function useJourney(dates: JourneyDates): Journey {
  const [journey, setJourney] = useState(() => measureJourney(dates));

  useEffect(() => {
    setJourney(measureJourney(dates));
    const id = window.setInterval(() => setJourney(measureJourney(dates)), SECOND);
    return () => window.clearInterval(id);
  }, [dates]);

  return journey;
}
