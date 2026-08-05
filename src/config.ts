/**
 * Everything you can change without touching the rest of the app.
 *
 * Each value can also be set with an environment variable at build time
 * (`.env` locally, project settings on Vercel, build args in Docker), which
 * lets you redeploy a new date without editing code. See `.env.example`.
 */

const env = import.meta.env;

export interface CountdownConfig {
  /** Moment the train leaves — the page starts rolling from here. */
  departsAt: string;
  /** Moment I land in her city, ISO 8601 with an explicit UTC offset. */
  arrivesAt: string;
  /** Moment we actually move in together — a couple of days later. */
  movesInAt: string;
  /** Moment the wait started — sets where the journey line begins. */
  waitStartedAt: string;
  /** City I leave. */
  fromCity: string;
  /** City I land in. */
  toCity: string;
  /** What the second leg leads to, e.g. "our place". */
  homeLabel: string;
  /** Small line above the counter, before I land. */
  eyebrow: string;
  /** Small line above the counter, between landing and moving in. */
  settlingEyebrow: string;
  /** Line under the counter, before I land. */
  message: string;
  /** Line under the counter, between landing and moving in. */
  settlingMessage: string;
  /** What the page says once we live together. */
  arrivedMessage: string;
  /** Names of the two milestones, shown on the step markers. */
  arrivalStep: string;
  moveInStep: string;
  /** How early the train pulls into the platform, in seconds. */
  boardingLeadSeconds: number;
  /** Counter reading that brings the packing scene in — 2 means it starts at J-2. */
  packingFromDay: number;
  /** Locale used to format the dates. */
  locale: string;
  /** IANA time zone the dates are displayed in. */
  timeZone: string;
}

export const config: CountdownConfig = {
  departsAt: env.VITE_DEPARTS_AT ?? '2026-08-11T07:35:00+02:00',
  arrivesAt: env.VITE_ARRIVES_AT ?? '2026-08-11T11:46:00+02:00',
  movesInAt: env.VITE_MOVES_IN_AT ?? '2026-08-13T10:00:00+02:00',
  waitStartedAt: env.VITE_WAIT_STARTED_AT ?? '2026-07-24T21:20:40+02:00',
  fromCity: env.VITE_FROM_CITY ?? 'Esbly',
  toCity: env.VITE_TO_CITY ?? 'Brest',
  homeLabel: env.VITE_HOME_LABEL ?? 'our place',
  eyebrow: env.VITE_EYEBROW ?? 'until I land in Brest',
  settlingEyebrow: env.VITE_SETTLING_EYEBROW ?? 'until we live together',
  message: env.VITE_MESSAGE ?? 'One last countdown, then no more counting.',
  settlingMessage: env.VITE_SETTLING_MESSAGE ?? 'Same city now. Two more sleeps and the keys are ours.',
  arrivedMessage: env.VITE_ARRIVED_MESSAGE ?? "I'm here. Open the door.",
  arrivalStep: env.VITE_ARRIVAL_STEP ?? 'I land',
  moveInStep: env.VITE_MOVE_IN_STEP ?? 'we move in',
  boardingLeadSeconds: Number(env.VITE_BOARDING_LEAD_SECONDS ?? 300),
  packingFromDay: Number(env.VITE_PACKING_FROM_DAY ?? 2),
  locale: env.VITE_LOCALE ?? 'en-GB',
  timeZone: env.VITE_TIME_ZONE ?? 'Europe/Paris',
};

export const departsAt = new Date(config.departsAt);
export const arrivesAt = new Date(config.arrivesAt);
export const movesInAt = new Date(config.movesInAt);
export const waitStartedAt = new Date(config.waitStartedAt);

/** One stable object so the countdown hook does not restart every render. */
export const journeyDates = {
  waitStartedAt,
  departsAt,
  arrivesAt,
  movesInAt,
  boardingLead: config.boardingLeadSeconds * 1000,
  packingFromDay: config.packingFromDay,
};
