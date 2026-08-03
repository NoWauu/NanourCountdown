/**
 * The country the train runs through: three layers, each on its own loop, so
 * the ride reads as depth rather than as one flat drawing sliding past.
 */

/**
 * Every layer is one tile drawn twice, side by side, inside a strip twice as
 * wide as the page. Sliding the strip by exactly half its width loops without
 * a seam.
 */
export function Layer({ className, tile, height }: {
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
export function FarTile() {
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

/**
 * Middle distance: pines, two lit houses, and a sign for the line — the sign
 * only while the train is running, so it never sits behind a station.
 */
export function MidTile({ destination, sign }: { destination: string; sign: boolean }) {
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

      {/* the sign out by the line */}
      {sign && (
        <g className="scenery__sign">
          <rect className="scenery__post" x={578} y={236} width={7} height={64} />
          <rect className="scenery__post" x={634} y={236} width={7} height={64} />
          <rect className="scenery__board" x={548} y={186} width={124} height={52} rx={8} />
          <text className="scenery__label" x={610} y={219} textAnchor="middle">
            {destination}
          </text>
        </g>
      )}
    </>
  );
}

/** Closest, in front of the train: telegraph poles, wires and grass. */
export function NearTile() {
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
