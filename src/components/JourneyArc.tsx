interface JourneyArcProps {
  from: string;
  to: string;
  /** Share of the wait already served, 0 to 1. */
  progress: number;
}

const START = { x: 20, y: 100 };
const CONTROL = { x: 500, y: 12 };
const END = { x: 980, y: 100 };

/** Point on the quadratic curve at t, so the light rides the same line it draws. */
function pointAt(t: number) {
  const inv = 1 - t;
  return {
    x: inv * inv * START.x + 2 * inv * t * CONTROL.x + t * t * END.x,
    y: inv * inv * START.y + 2 * inv * t * CONTROL.y + t * t * END.y,
  };
}

export function JourneyArc({ from, to, progress }: JourneyArcProps) {
  const light = pointAt(progress);
  const path = `M ${START.x} ${START.y} Q ${CONTROL.x} ${CONTROL.y} ${END.x} ${END.y}`;
  const percent = Math.round(progress * 100);

  return (
    <div className="journey">
      <span className="journey__city">{from}</span>

      <svg
        className="journey__arc"
        viewBox="0 0 1000 120"
        role="img"
        aria-label={`${percent}% of the wait between ${from} and ${to} is behind us`}
      >
        <defs>
          <linearGradient id="travelled" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--peach)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--rose)" />
          </linearGradient>
          <filter id="lightGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="journey__rest" d={path} />
        <path
          className="journey__done"
          d={path}
          pathLength={1}
          strokeDasharray={`${progress} 1`}
        />

        <circle className="journey__anchor" cx={START.x} cy={START.y} r="6" />
        <circle className="journey__anchor journey__anchor--home" cx={END.x} cy={END.y} r="7" />
        <circle className="journey__light" cx={light.x} cy={light.y} r="9" filter="url(#lightGlow)" />
      </svg>

      <span className="journey__city journey__city--home">{to}</span>
    </div>
  );
}
