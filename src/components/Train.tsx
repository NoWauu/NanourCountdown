/**
 * The ride, in four acts:
 *
 *   waiting  — nothing on screen yet
 *   boarding — the train pulls in, he walks up the platform and gets on
 *   riding   — the country rushes past while he sits in a lit window
 *   arrived  — he steps down at the far end, and she is there
 *
 * The coarse state comes from React (it re-renders every second anyway); the
 * loops and the sequencing are CSS, anchored with negative animation delays so
 * a page loaded halfway through an act picks it up in the right place.
 */

import { useRef } from 'react';
import { Layer, FarTile, MidTile, NearTile } from './Scenery';
import { Heart, Walking, Waiting, Hugging, Passenger } from './Figures';
import type { RidePhase } from '../useCountdown';

/** Seconds the train takes to roll into the platform and stop. */
const PULL_IN = 7;
/** Seconds from the train stopping to him being aboard. */
const BOARDING_WALK = 13;
/** The door of the second coach, in the train's own coordinates. */
const DOOR_X = 660;
/** Where everyone stands: the wheels rest on 274. */
const PLATFORM_Y = 276;

const COACH_WIDTH = 300;

function Coach({ x }: { x: number }) {
  const windows = [0, 1, 2, 3].map((i) => x + 46 + i * 62);

  return (
    <g className="train__coach">
      <rect className="train__roof" x={x} y={118} width={COACH_WIDTH} height={16} rx={8} />
      <rect className="train__body" x={x + 8} y={130} width={COACH_WIDTH - 16} height={98} rx={12} />

      {windows.map((wx, i) => (
        <g key={wx}>
          <rect className="train__glow" x={wx - 10} y={138} width={64} height={60} rx={14} />
          <rect
            className="train__window"
            x={wx}
            y={148}
            width={44}
            height={40}
            rx={6}
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        </g>
      ))}

      <rect className="train__skirt" x={x + 8} y={222} width={COACH_WIDTH - 16} height={10} rx={5} />

      {[x + 58, x + 104, x + 196, x + 242].map((wx) => (
        <g key={wx} className="train__wheelset">
          <g className="train__wheel">
            <circle className="train__tyre" cx={wx} cy={244} r={20} />
            <circle className="train__hub" cx={wx} cy={244} r={5} />
            <line className="train__spoke" x1={wx - 20} y1={244} x2={wx + 20} y2={244} />
            <line className="train__spoke" x1={wx} y1={224} x2={wx} y2={264} />
          </g>
        </g>
      ))}
    </g>
  );
}

/** Platform furniture: the name of the station, and lamps over the edge. */
function Station({ name }: { name: string }) {
  return (
    <g className="station">
      {[610, 1352].map((x) => (
        <g key={x} className="station__lamp">
          <ellipse className="station__pool" cx={x} cy={PLATFORM_Y} rx={96} ry={15} />
          <rect className="station__post" x={x - 4} y={104} width={8} height={172} />
          <path className="station__shade" d={`M${x - 22} 104 L${x + 22} 104 L${x + 12} 86 L${x - 12} 86 Z`} />
          <circle className="station__bulb" cx={x} cy={110} r={26} />
        </g>
      ))}

      <g className="station__sign">
        <rect className="station__post" x={144} y={96} width={9} height={180} />
        <rect className="station__board" x={40} y={38} width={218} height={60} rx={10} />
        <text className="station__name" x={149} y={76} textAnchor="middle">
          {name}
        </text>
      </g>
    </g>
  );
}

/**
 * He appears part-way into the boarding act, so his walk is anchored to the
 * moment he shows up rather than to the start of the act.
 */
function Boarder({ elapsed }: { elapsed: number }) {
  const start = useRef(elapsed).current;

  return (
    <g
      className="cast cast--boarding"
      transform={`translate(100 ${PLATFORM_Y}) scale(1.3)`}
      style={{ ['--delay' as string]: `${-(start - PULL_IN)}s` }}
    >
      <g className="cast__move">
        <Walking suitcase />
      </g>
    </g>
  );
}

interface TrainProps {
  /** Where the train is leaving from — on the sign while he boards. */
  origin: string;
  /** Where it is going — on the sign at the far end, and out in the country. */
  destination: string;
  phase: RidePhase;
  /** Seconds since this phase began. */
  phaseElapsed: number;
  /** Share of the ride already done, 0 to 1 — the train speeds up towards the end. */
  rideProgress: number;
}

/**
 * Where in the act we were when this phase started on screen. The page
 * re-renders every second; if the CSS delays followed `phaseElapsed` they
 * would re-seek every animation each time and the scene would stutter. Taking
 * the reading once per phase lets the browser keep the clock from there.
 */
function usePhaseAnchor(phase: RidePhase, phaseElapsed: number): number {
  const anchor = useRef({ phase, phaseElapsed });
  if (anchor.current.phase !== phase) anchor.current = { phase, phaseElapsed };
  return anchor.current.phaseElapsed;
}

export function Train({ origin, destination, phase, phaseElapsed, rideProgress }: TrainProps) {
  const anchor = usePhaseAnchor(phase, phaseElapsed);
  /**
   * Every animation is timed off this multiplier, so the whole scene runs a
   * little faster the closer the arrival gets. Quantised, otherwise the
   * per-second re-render would keep nudging animation durations mid-cycle.
   */
  const pace = Math.round((1.2 - 0.55 * rideProgress) * 20) / 20;

  const rolling = phase === 'riding';
  const pulling = phase === 'boarding' && phaseElapsed < PULL_IN;
  const departing = rolling && phaseElapsed < 4;
  /** Held for the whole act: the braking slide is where the country came to rest. */
  const braking = phase === 'arrived';
  /** Wheels turning: either out on the line, or still coasting into the platform. */
  const running = rolling || pulling;

  const walkingUp = phase === 'boarding' && phaseElapsed >= PULL_IN - 1 && phaseElapsed < PULL_IN + BOARDING_WALK + 1;
  const seated = rolling || (phase === 'boarding' && phaseElapsed >= PULL_IN + BOARDING_WALK);
  const atStation = phase !== 'riding';

  const drivers = [812, 912, 1012];
  const garland = Array.from({ length: 11 }, (_, i) => garlandPoint(i / 10));
  const garlandPath = `M ${GARLAND.start.x} ${GARLAND.start.y} Q ${GARLAND.control.x} ${GARLAND.control.y} ${GARLAND.end.x} ${GARLAND.end.y}`;

  const className = [
    'train',
    rolling ? 'train--scrolling' : 'train--stopped',
    running ? 'train--running' : '',
    pulling ? 'train--pulling' : '',
    departing ? 'train--departing' : '',
    braking ? 'train--braking' : '',
    phase === 'arrived' ? 'train--arrived' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        ['--pace' as string]: pace,
        ['--pull-delay' as string]: `${-anchor}s`,
        /* Speeding up and slowing down have to pick up exactly where the other
           left off, so they start when the class lands rather than being
           re-seeked to the clock — except on a page opened long after the act
           began, where they are simply already over. */
        ['--launch-delay' as string]: anchor < 6 ? '0s' : '-30s',
        ['--brake-delay' as string]: anchor < 6 ? '0s' : '-30s',
      }}
    >
      <Layer className="scenery--far" height={300} tile={<FarTile />} />
      <Layer className="scenery--mid" height={300} tile={<MidTile destination={destination} sign={rolling} />} />

      <div className="train__haze" />
      <div className="train__track" />
      <div className="train__rush" />
      {atStation && <div className="train__platform" />}

      {/* the platform stands still while the train slides in and out of it */}
      {atStation && (
        <div className="train__stage train__stage--back">
          <svg viewBox="0 0 1400 320" fill="none">
            <Station name={phase === 'arrived' ? destination : origin} />
          </svg>
        </div>
      )}

      <div className="train__rig">
        <svg className="train__svg" viewBox="0 0 1400 320" fill="none">
          <defs>
            <linearGradient id="trainSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b2f55" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#3b1e52" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="trainEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--cream)" />
              <stop offset="55%" stopColor="var(--peach)" />
              <stop offset="100%" stopColor="var(--rose)" />
            </linearGradient>
            <linearGradient id="trainRoof" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--rose)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--peach)" stopOpacity="0.55" />
            </linearGradient>
            <radialGradient id="windowGlow">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lampGlow">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="haloGlow">
              <stop offset="0%" stopColor="var(--rose)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--rose)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="beamGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </linearGradient>
            <clipPath id="coachWindow">
              <rect x={478} y={148} width={44} height={40} rx={6} />
            </clipPath>
          </defs>

          {/* warm pool of light the train carries with it */}
          <ellipse className="train__halo" cx={700} cy={250} rx={620} ry={92} />

          {/* couplings, drawn first so the stock sits on top of them */}
          <line className="train__coupling" x1={330} y1={222} x2={370} y2={222} />
          <line className="train__coupling" x1={670} y1={222} x2={712} y2={222} />

          <Coach x={30} />
          <Coach x={370} />

          {/* him, through the second window of the second coach */}
          {seated && (
            <g className="train__passenger" clipPath="url(#coachWindow)">
              <g transform={`translate(500 ${186})`}>
                <Passenger />
              </g>
            </g>
          )}

          {/* the locomotive */}
          <g className="train__loco">
            <rect className="train__roof" x={706} y={92} width={190} height={16} rx={8} />
            <rect className="train__body" x={716} y={104} width={170} height={124} rx={12} />
            <rect className="train__glow" x={730} y={116} width={142} height={72} rx={18} />
            <rect className="train__window" x={742} y={126} width={118} height={52} rx={8} />

            {/* boiler */}
            <rect className="train__body" x={886} y={142} width={294} height={86} rx={20} />
            <rect className="train__band" x={962} y={142} width={10} height={86} />
            <rect className="train__band" x={1074} y={142} width={10} height={86} />
            <Heart className="train__crest" x={1020} y={185} size={44} />

            {/* chimney */}
            <rect className="train__body" x={1116} y={96} width={40} height={48} rx={4} />
            <rect className="train__body" x={1106} y={86} width={60} height={16} rx={6} />

            {/* smokebox door and lamp */}
            <circle className="train__smokebox" cx={1180} cy={185} r={44} />
            <circle className="train__lampGlow" cx={1188} cy={158} r={34} />
            <circle className="train__lamp" cx={1188} cy={158} r={11} />
            <path className="train__beam" d="M1196 148 L1398 92 L1398 224 L1196 170 Z" />

            {/* cowcatcher */}
            <path className="train__skirt" d="M1206 214 L1268 214 L1300 254 L1206 254 Z" />

            <rect className="train__skirt" x={716} y={222} width={490} height={12} rx={6} />

            {drivers.map((cx) => (
              <g key={cx} className="train__wheelset train__wheelset--driver">
                <g className="train__wheel train__wheel--driver">
                  <circle className="train__tyre" cx={cx} cy={238} r={36} />
                  <circle className="train__hub" cx={cx} cy={238} r={8} />
                  <line className="train__spoke" x1={cx - 36} y1={238} x2={cx + 36} y2={238} />
                  <line className="train__spoke" x1={cx} y1={202} x2={cx} y2={274} />
                  <line className="train__spoke" x1={cx - 25} y1={213} x2={cx + 25} y2={263} />
                  <line className="train__spoke" x1={cx - 25} y1={263} x2={cx + 25} y2={213} />
                </g>
              </g>
            ))}

            <line className="train__rod" x1={806} y1={256} x2={1018} y2={256} />

            {[1122, 1180].map((cx) => (
              <g key={cx} className="train__wheelset">
                <g className="train__wheel train__wheel--pony">
                  <circle className="train__tyre" cx={cx} cy={250} r={20} />
                  <circle className="train__hub" cx={cx} cy={250} r={5} />
                  <line className="train__spoke" x1={cx - 20} y1={250} x2={cx + 20} y2={250} />
                  <line className="train__spoke" x1={cx} y1={230} x2={cx} y2={270} />
                </g>
              </g>
            ))}
          </g>

          {/* garland of hearts, strung from the last coach to the cab */}
          <g className="train__garland">
            <path className="train__string" d={garlandPath} />
            {garland.map((point, i) => (
              <Heart
                key={i}
                className="train__bunting"
                x={point.x}
                y={point.y + 14}
                size={i % 2 ? 15 : 20}
                style={{ animationDelay: `${(i % 5) * 0.35}s` }}
              />
            ))}
          </g>

          {/* steam: hearts, streaming back over the coaches */}
          <g className="train__steam">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Heart
                key={i}
                className="train__puff"
                x={1136}
                y={70}
                size={24 + (i % 4) * 12}
                style={{ animationDelay: `${i * 0.34}s` }}
              />
            ))}
          </g>

          {/* sparks trailing off the last wheels */}
          <g className="train__sparks">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                className="train__spark"
                cx={64}
                cy={252}
                r={3 + (i % 3)}
                style={{ animationDelay: `${i * 0.42}s` }}
              />
            ))}
          </g>

        </svg>
      </div>

      {/* the people, on the platform in front of the train — they stay put */}
      {(walkingUp || phase === 'arrived') && (
        <div className="train__stage train__stage--front">
          <svg viewBox="0 0 1400 320" fill="none">
            {/* him, walking up the platform to the door */}
            {walkingUp && <Boarder elapsed={phaseElapsed} />}

            {/* the far end: he steps down, she is waiting, they meet */}
            {phase === 'arrived' && (
              <g className="reunion" style={{ ['--delay' as string]: `${-anchor}s` }}>
                <g className="cast cast--traveller" transform={`translate(${DOOR_X} ${PLATFORM_Y}) scale(1.3)`}>
                  <g className="cast__move">
                    <g className="cast__before"><Walking suitcase /></g>
                    <g className="cast__after"><Hugging /></g>
                  </g>
                </g>

                <g className="cast cast--greeter" transform={`translate(925 ${PLATFORM_Y}) scale(-1.3 1.3)`}>
                  <g className="cast__move">
                    <g className="cast__before"><Waiting /></g>
                    <g className="cast__after"><Hugging hair /></g>
                  </g>
                </g>

                <g className="cast__joy" transform="translate(868 144)">
                  {[0, 1, 2].map((i) => (
                    <Heart
                      key={i}
                      className="joy__heart"
                      x={(i - 1) * 30}
                      y={0}
                      size={20 + (i % 2) * 10}
                      style={{ animationDelay: `${i * 1.1}s` }}
                    />
                  ))}
                </g>
              </g>
            )}
          </svg>
        </div>
      )}

      <Layer className="scenery--near" height={300} tile={<NearTile />} />

      <div className="train__streaks">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span
            key={i}
            className="streak"
            style={{
              bottom: `${8 + i * 11}%`,
              width: `${14 + (i % 4) * 9}%`,
              animationDelay: `${i * 0.31}s`,
              animationDuration: `calc(var(--pace, 1) * ${1.1 + (i % 3) * 0.45}s)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* The garland: one quadratic curve, hearts hanging off it at even steps. */
const GARLAND = { start: { x: 42, y: 108 }, control: { x: 470, y: 26 }, end: { x: 892, y: 84 } };

function garlandPoint(t: number) {
  const inv = 1 - t;
  const { start, control, end } = GARLAND;
  return {
    x: inv * inv * start.x + 2 * inv * t * control.x + t * t * end.x,
    y: inv * inv * start.y + 2 * inv * t * control.y + t * t * end.y,
  };
}
