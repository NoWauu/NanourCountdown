/**
 * The ride itself. From the departure time until the arrival, a train rolls
 * across the bottom of the page: line art, so it reads as motion without ever
 * covering the counter sitting above it.
 */

interface CoachProps {
  /** Left edge of the coach in SVG units. */
  x: number;
}

const COACH_WIDTH = 300;

function Coach({ x }: CoachProps) {
  const windows = [0, 1, 2, 3].map((i) => x + 46 + i * 62);

  return (
    <g className="train__coach">
      <rect className="train__roof" x={x} y={118} width={COACH_WIDTH} height={16} rx={8} />
      <rect className="train__body" x={x + 8} y={130} width={COACH_WIDTH - 16} height={98} rx={12} />

      {windows.map((wx) => (
        <rect key={wx} className="train__window" x={wx} y={148} width={44} height={40} rx={6} />
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

export function Train() {
  const drivers = [812, 912, 1012];

  return (
    <div className="train" aria-hidden="true">
      <div className="train__track" />

      <div className="train__rig">
        <svg className="train__svg" viewBox="0 0 1400 300" fill="none">
          {/* couplings, drawn first so the stock sits on top of them */}
          <line className="train__coupling" x1={330} y1={222} x2={370} y2={222} />
          <line className="train__coupling" x1={670} y1={222} x2={712} y2={222} />

          <Coach x={30} />
          <Coach x={370} />

          {/* the locomotive */}
          <g className="train__loco">
            <rect className="train__roof" x={706} y={92} width={190} height={16} rx={8} />
            <rect className="train__body" x={716} y={104} width={170} height={124} rx={12} />
            <rect className="train__window" x={742} y={126} width={118} height={52} rx={8} />

            {/* boiler */}
            <rect className="train__body" x={886} y={142} width={294} height={86} rx={20} />
            <rect className="train__band" x={962} y={142} width={10} height={86} />
            <rect className="train__band" x={1074} y={142} width={10} height={86} />

            {/* chimney */}
            <rect className="train__body" x={1116} y={96} width={40} height={48} rx={4} />
            <rect className="train__body" x={1106} y={86} width={60} height={16} rx={6} />

            {/* smokebox door and lamp */}
            <circle className="train__smokebox" cx={1180} cy={185} r={44} />
            <circle className="train__lamp" cx={1188} cy={158} r={11} />
            <path className="train__beam" d="M1196 148 L1392 96 L1392 220 L1196 170 Z" />

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

          {/* steam, drifting back over the coaches */}
          <g className="train__steam">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                className="train__puff"
                cx={1136}
                cy={80}
                r={16 + i * 5}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
