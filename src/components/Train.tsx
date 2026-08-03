/**
 * The ride itself. From the departure time until the arrival, the bottom of
 * the page becomes a moving window: the train holds its place while three
 * layers of scenery rush past it at different speeds. It stays in the bottom
 * band, so the counter above it is never covered.
 */

const HEART =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

/**
 * Heart drawn at its own scale, centred on (x, y). The placement lives on a
 * wrapping group because a CSS animation on the path would override a
 * `transform` attribute set on the same element.
 */
function Heart({ x, y, size, className, style }: {
  x: number;
  y: number;
  size: number;
  className: string;
  style?: React.CSSProperties;
}) {
  const scale = size / 24;
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}>
      <path className={className} style={style} d={HEART} />
    </g>
  );
}

/* ------------------------------------------------------------ the scenery */

/**
 * Every layer is one tile drawn twice, side by side, inside a strip twice as
 * wide as the page. Sliding the strip by exactly half its width loops without
 * a seam, and each layer runs at its own speed to give the ride some depth.
 */
function Layer({ className, tile, height }: {
  className: string;
  tile: React.ReactNode;
  height: number;
}) {
  return (
    <div className={`scenery ${className}`}>
      <svg viewBox={`0 0 2000 ${height}`} preserveAspectRatio="none" fill="none">
        <g>{tile}</g>
        <g transform="translate(1000 0)">{tile}</g>
      </svg>
    </div>
  );
}

/** Far away: hills, and a town with its lights on. */
function FarTile() {
  const lights = [612, 636, 668, 700, 726, 760, 792];

  return (
    <>
      <path
        className="scenery__hill"
        d="M0 300 C 90 232 150 250 220 214 C 300 172 360 206 430 236 C 500 266 560 246 640 220
           C 720 194 790 226 860 250 C 920 270 960 284 1000 300 Z"
      />
      <path
        className="scenery__hill scenery__hill--back"
        d="M0 300 C 60 268 120 210 200 196 C 280 182 320 232 400 244 C 470 254 520 214 600 200
           C 690 184 760 224 840 234 C 910 242 960 276 1000 300 Z"
      />
      {lights.map((x, i) => (
        <circle
          key={x}
          className="scenery__lamp"
          cx={x}
          cy={228 + (i % 3) * 12}
          r={3}
          style={{ animationDelay: `${i * 0.9}s` }}
        />
      ))}
    </>
  );
}

/** Middle distance: pines, two lit houses, and the sign for the destination. */
function MidTile({ destination }: { destination: string }) {
  const pines = [40, 128, 208, 700, 786, 880, 962];

  return (
    <>
      {pines.map((x, i) => {
        const h = 116 + (i % 3) * 34;
        return (
          <path
            key={x}
            className="scenery__pine"
            d={`M${x} 300 L${x + 26} ${300 - h} L${x + 52} 300 Z`}
          />
        );
      })}

      {/* two houses, windows lit */}
      <g className="scenery__house">
        <path className="scenery__roof" d="M300 232 L346 194 L392 232 Z" />
        <rect className="scenery__wall" x={308} y={230} width={76} height={70} />
        <rect className="scenery__pane" x={322} y={248} width={20} height={20} />
        <rect className="scenery__pane" x={352} y={248} width={20} height={20} />
        <rect className="scenery__pane" x={336} y={278} width={22} height={22} />
      </g>
      <g className="scenery__house">
        <path className="scenery__roof" d="M424 250 L462 218 L500 250 Z" />
        <rect className="scenery__wall" x={432} y={248} width={62} height={52} />
        <rect className="scenery__pane" x={444} y={262} width={16} height={16} />
        <rect className="scenery__pane" x={468} y={262} width={16} height={16} />
      </g>

      {/* the sign on the platform */}
      <g className="scenery__sign">
        <rect className="scenery__post" x={578} y={236} width={7} height={64} />
        <rect className="scenery__post" x={634} y={236} width={7} height={64} />
        <rect className="scenery__board" x={548} y={186} width={124} height={52} rx={8} />
        <text className="scenery__label" x={610} y={219} textAnchor="middle">
          {destination}
        </text>
      </g>
    </>
  );
}

/** Closest, in front of the train: telegraph poles, wires and grass. */
function NearTile() {
  return (
    <>
      <path className="scenery__wire" d="M0 96 Q 250 168 500 96 T 1000 96" />
      <path className="scenery__wire" d="M0 118 Q 250 196 500 118 T 1000 118" />

      {[0, 500].map((x) => (
        <g key={x} className="scenery__pole">
          <rect x={x - 8} y={72} width={16} height={228} />
          <rect x={x - 44} y={84} width={88} height={11} rx={4} />
          <rect x={x - 32} y={112} width={64} height={9} rx={4} />
        </g>
      ))}

      {[80, 190, 320, 430, 560, 690, 820, 930].map((x, i) => (
        <path
          key={x}
          className="scenery__grass"
          d={`M${x} 300 Q ${x + 10} ${262 - (i % 3) * 14} ${x + 26} 300 Z`}
        />
      ))}
    </>
  );
}

/* -------------------------------------------------------------- the train */

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
        <g key={wx} className="train__wheel">
          <circle className="train__tyre" cx={wx} cy={244} r={20} />
          <circle className="train__hub" cx={wx} cy={244} r={5} />
          <line className="train__spoke" x1={wx - 20} y1={244} x2={wx + 20} y2={244} />
          <line className="train__spoke" x1={wx} y1={224} x2={wx} y2={264} />
        </g>
      ))}
    </g>
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

interface TrainProps {
  /** City on the platform sign that flies past. */
  destination: string;
  /** Share of the ride already done, 0 to 1 — the train speeds up towards the end. */
  rideProgress: number;
}

export function Train({ destination, rideProgress }: TrainProps) {
  /**
   * Every animation is timed off this multiplier, so the whole scene runs a
   * little faster the closer the arrival gets. Quantised, otherwise the
   * per-second re-render would keep nudging animation durations mid-cycle.
   */
  const pace = Math.round((1.2 - 0.55 * rideProgress) * 20) / 20;

  const drivers = [812, 912, 1012];
  const garland = Array.from({ length: 11 }, (_, i) => garlandPoint(i / 10));
  const garlandPath = `M ${GARLAND.start.x} ${GARLAND.start.y} Q ${GARLAND.control.x} ${GARLAND.control.y} ${GARLAND.end.x} ${GARLAND.end.y}`;

  return (
    <div className="train" aria-hidden="true" style={{ ['--pace' as string]: pace }}>
      <Layer className="scenery--far" height={300} tile={<FarTile />} />
      <Layer className="scenery--mid" height={300} tile={<MidTile destination={destination} />} />

      <div className="train__haze" />
      <div className="train__track" />
      <div className="train__rush" />

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
          </defs>

          {/* warm pool of light the train carries with it */}
          <ellipse className="train__halo" cx={700} cy={250} rx={620} ry={92} />

          {/* couplings, drawn first so the stock sits on top of them */}
          <line className="train__coupling" x1={330} y1={222} x2={370} y2={222} />
          <line className="train__coupling" x1={670} y1={222} x2={712} y2={222} />

          <Coach x={30} />
          <Coach x={370} />

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
              <g key={cx} className="train__wheel train__wheel--driver">
                <circle className="train__tyre" cx={cx} cy={238} r={36} />
                <circle className="train__hub" cx={cx} cy={238} r={8} />
                <line className="train__spoke" x1={cx - 36} y1={238} x2={cx + 36} y2={238} />
                <line className="train__spoke" x1={cx} y1={202} x2={cx} y2={274} />
                <line className="train__spoke" x1={cx - 25} y1={213} x2={cx + 25} y2={263} />
                <line className="train__spoke" x1={cx - 25} y1={263} x2={cx + 25} y2={213} />
              </g>
            ))}

            <line className="train__rod" x1={806} y1={256} x2={1018} y2={256} />

            {[1122, 1180].map((cx) => (
              <g key={cx} className="train__wheel train__wheel--pony">
                <circle className="train__tyre" cx={cx} cy={250} r={20} />
                <circle className="train__hub" cx={cx} cy={250} r={5} />
                <line className="train__spoke" x1={cx - 20} y1={250} x2={cx + 20} y2={250} />
                <line className="train__spoke" x1={cx} y1={230} x2={cx} y2={270} />
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
