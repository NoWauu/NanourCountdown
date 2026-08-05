/**
 * The two people in the story, drawn in the train's own coordinate system:
 * feet on y = 0, head around y = -72, facing right unless mirrored.
 *
 * Every figure comes in two poses — one for moving about, one for the hug —
 * and the scene cross-fades between them, which is far simpler than trying to
 * stop a walk cycle mid-stride.
 */

const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

/**
 * Heart drawn at its own scale, centred on (x, y). The placement lives on a
 * wrapping group because a CSS animation on the path would override a
 * `transform` attribute set on the same element.
 */
export function Heart({ x, y, size, className, style }: {
  x: number;
  y: number;
  size: number;
  className: string;
  style?: React.CSSProperties;
}) {
  const scale = size / 24;
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}>
      <path className={className} style={style} d={HEART_PATH} />
    </g>
  );
}

/* ------------------------------------------------------------ him, walking */

export function Walking({ suitcase = false }: { suitcase?: boolean }) {
  return (
    <g className="figure figure--walk">
      <line className="figure__limb figure__limb--far" x1={0} y1={-28} x2={0} y2={0} />
      <line className="figure__limb figure__limb--far" x1={0} y1={-52} x2={0} y2={-35} />

      <path className="figure__torso" d="M-7 -57 L7 -57 L5.5 -27 L-5.5 -27 Z" />
      <circle className="figure__head" cx={0} cy={-66} r={9} />

      <line className="figure__limb figure__limb--near figure__limb--leg" x1={0} y1={-28} x2={0} y2={0} />

      <g className="figure__limb figure__limb--near">
        <line x1={0} y1={-52} x2={0} y2={-35} />
        {suitcase && <rect className="figure__case" x={-6} y={-35} width={12} height={9} rx={2} />}
      </g>
    </g>
  );
}

/* --------------------------------------------------- him, the night before */

/**
 * The same build as the walking figure, stood still with his sleeves up: the
 * legs are planted, everything else hangs off a torso that leans over the bed
 * and straightens again. Only the arms have a job to do, so only the arms and
 * the lean are animated — the scene around him supplies the shirt.
 */
export function Folding() {
  return (
    <g className="figure figure--fold">
      <line className="figure__limb figure__limb--far" x1={-3} y1={-27} x2={-5} y2={0} />
      <line className="figure__limb figure__limb--near figure__limb--leg" x1={3} y1={-27} x2={5} y2={0} />

      <g className="figure__stoop">
        <path className="figure__torso" d="M-7 -57 L7 -57 L5.5 -27 L-5.5 -27 Z" />
        <circle className="figure__head" cx={0} cy={-66} r={9} />

        <line className="figure__limb figure__arm figure__arm--far" x1={0} y1={-52} x2={0} y2={-31} />
        <line className="figure__limb figure__arm figure__arm--near" x1={0} y1={-52} x2={0} y2={-31} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------- her, on the platform */

/**
 * Her hair, as one shape behind the head and the body: a crown a little wider
 * than the skull, and two lengths falling past the shoulders. The inner edge
 * sits below the neckline on purpose — the torso is drawn over it, so the hair
 * frames her instead of lying on top of her like a hood.
 */
const HAIR = 'M-12.5 -63 Q-13.5 -84 0 -84 Q13.5 -84 12.5 -63 Q13.5 -52 12.5 -37 Q11 -33.5 9 -36 Q6.5 -44 6 -52 L-6 -52 Q-6.5 -44 -9 -36 Q-11 -33.5 -12.5 -37 Q-13.5 -52 -12.5 -63 Z';

export function Waiting() {
  return (
    <g className="figure figure--wait">
      <path className="figure__hair" d={HAIR} />
      <circle className="figure__head" cx={0} cy={-66} r={9} />
      <path className="figure__torso" d="M-7 -57 L7 -57 L11 -26 L-11 -26 Z" />

      <line className="figure__limb figure__limb--far" x1={-2} y1={-26} x2={-4} y2={0} />
      <line className="figure__limb figure__limb--near figure__limb--leg" x1={2} y1={-26} x2={4} y2={0} />

      <line className="figure__limb figure__limb--far" x1={0} y1={-52} x2={-6} y2={-34} />
      <g className="figure__wave">
        <line x1={0} y1={-52} x2={0} y2={-34} />
      </g>
    </g>
  );
}

/* ----------------------------------------------------------------- the hug */

/**
 * One half of the hug: legs planted, everything above the hips leaning into
 * the other person, arms round their back. Mirrored for her by the caller.
 */
export function Hugging({ hair = false }: { hair?: boolean }) {
  return (
    <g className="figure figure--hug">
      <line className="figure__limb figure__limb--far" x1={-1} y1={-27} x2={-5} y2={0} />
      <line className="figure__limb figure__limb--near figure__limb--leg" x1={1} y1={-27} x2={5} y2={0} />

      <g className="figure__lean">
        {/* hair first: the body and the head both sit in front of it */}
        {hair && <path className="figure__hair" d={HAIR} />}
        <path className="figure__torso" d={hair ? 'M-7 -57 L7 -57 L10 -26 L-10 -26 Z' : 'M-7 -57 L7 -57 L5.5 -26 L-5.5 -26 Z'} />
        <circle className="figure__head" cx={0} cy={-66} r={9} />

        {/* both arms round the other one's back */}
        <line className="figure__limb figure__limb--far" x1={0} y1={-52} x2={24} y2={-47} />
        <line className="figure__limb figure__limb--near" x1={0} y1={-46} x2={24} y2={-40} />
      </g>
    </g>
  );
}

/* ------------------------------------------------- him, seen through a window */

const TORSO = 'M-14 0 L14 0 L10 -15 L-10 -15 Z';

/** How long each way of passing the time lasts, and how many there are. */
const POSE_SLOT = 7;

/**
 * Head and shoulders in a lit window, cycling through the ways he passes four
 * hours: watching the country go by, on his phone, asleep on the glass,
 * reading, a coffee, and a photo of her.
 */
export function Passenger() {
  const poses = [
    <>
      <path className="passenger__torso" d={TORSO} />
      <g className="passenger__head passenger__head--gazing">
        <circle className="passenger__face" cx={0} cy={-24} r={9} />
        <circle className="passenger__eye" cx={4} cy={-25} r={1.4} />
      </g>
    </>,

    <>
      <path className="passenger__torso" d={TORSO} />
      <g className="passenger__head passenger__head--down">
        <circle className="passenger__face" cx={0} cy={-24} r={9} />
        <circle className="passenger__eye" cx={5} cy={-21} r={1.4} />
      </g>
      <rect className="passenger__phone" x={2} y={-14} width={6} height={9} rx={1.5} />
    </>,

    <>
      <path className="passenger__torso" d={TORSO} />
      <g className="passenger__head passenger__head--tilted">
        <circle className="passenger__face" cx={0} cy={-24} r={9} />
        <path className="passenger__lid" d="M2 -25 q 3 2 6 0" />
      </g>
      {[0, 1].map((i) => (
        <Heart
          key={i}
          className="passenger__dream"
          x={9}
          y={-34}
          size={7}
          style={{ animationDelay: `${i * 1.6}s` }}
        />
      ))}
    </>,

    <>
      <path className="passenger__torso" d={TORSO} />
      <g className="passenger__head passenger__head--down">
        <circle className="passenger__face" cx={0} cy={-24} r={9} />
        <circle className="passenger__eye" cx={5} cy={-21} r={1.4} />
      </g>
      <path className="passenger__book" d="M-9 -9 L0 -12 L9 -9 L9 -3 L0 -6 L-9 -3 Z" />
      <line className="passenger__spine" x1={0} y1={-12} x2={0} y2={-6} />
    </>,

    <>
      <path className="passenger__torso" d={TORSO} />
      <g className="passenger__head passenger__head--gazing">
        <circle className="passenger__face" cx={0} cy={-24} r={9} />
        <circle className="passenger__eye" cx={4} cy={-25} r={1.4} />
      </g>
      <rect className="passenger__cup" x={4} y={-13} width={7} height={8} rx={1.5} />
      <path className="passenger__handle" d="M11 -11 q 3 2 0 4" />
      <path className="passenger__wisp" d="M7 -15 q 3 -4 0 -8" />
    </>,

    <>
      <path className="passenger__torso" d={TORSO} />
      <g className="passenger__head passenger__head--fond">
        <circle className="passenger__face" cx={0} cy={-24} r={9} />
        <circle className="passenger__eye" cx={5} cy={-22} r={1.4} />
      </g>
      <rect className="passenger__photo" x={2} y={-14} width={10} height={8} rx={1} />
      <Heart className="passenger__portrait" x={7} y={-10} size={5} />
      {[0, 1].map((i) => (
        <Heart
          key={i}
          className="passenger__dream"
          x={11}
          y={-20}
          size={6}
          style={{ animationDelay: `${i * 1.4}s` }}
        />
      ))}
    </>,
  ];

  const cycle = poses.length * POSE_SLOT;

  return (
    <g className="passenger">
      {poses.map((pose, i) => (
        <g
          key={i}
          className="passenger__pose"
          style={{
            animationDuration: `${cycle}s`,
            animationDelay: `${i === 0 ? 0 : -(cycle - i * POSE_SLOT)}s`,
          }}
        >
          {pose}
        </g>
      ))}
    </g>
  );
}
