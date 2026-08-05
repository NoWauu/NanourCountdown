/**
 * Two days out, in his flat. The case is open on the floor, there is a heap of
 * clothes on the bed, and he is working through it one shirt at a time: lift it
 * off the pile, lay it flat, fold the sleeves in, fold it in half, turn round,
 * put it in the case. Three shirts fill the case, the lid comes down, and it
 * starts again — there is always more to pack.
 *
 * Same room as the ride uses: a 1400 x 320 box with the floor on 300. Nothing
 * here is anchored to the clock, so the whole scene is one CSS loop of
 * `--pack-cycle`, and the case runs on three of them.
 */

import { Heart, Folding } from './Figures';

/** Top of the mattress, and the floor everything stands on. */
const MATTRESS_Y = 232;
const FLOOR_Y = 300;

/** Where he stands: at the near corner of the bed, in front of it. */
const HIM_X = 845;

/**
 * The case, open on the floor in front of him — nearer us than he is, which is
 * why it is drawn last and crosses his shins, and why it sits low in the frame.
 * Being in front is what puts it inside his reach: he can drop a shirt straight
 * down into it without stepping away from the bed.
 */
const CASE = { left: 700, right: 850, top: 272, bottom: 310 };

/** The wall behind him, the window over the bed, and the light hanging above. */
function Room() {
  return (
    <g className="room">
      {/* wall, floor and skirting run past the drawing so the room fills the
          band on any width; the band itself does the clipping */}
      <rect className="room__wall" x={-1300} y={-160} width={4000} height={FLOOR_Y + 160} />

      {/* the window over the bed, with the same dusk outside as the sky above */}
      <g className="room__window">
        <rect className="room__sky" x={960} y={36} width={250} height={120} rx={6} />
        <circle className="room__moon" cx={1160} cy={70} r={15} />
        {[[1000, 62], [1042, 96], [1078, 58], [1110, 118], [990, 128]].map(([x, y], i) => (
          <circle
            key={x}
            className="room__star"
            cx={x}
            cy={y}
            r={2.6}
            style={{ animationDelay: `${i * 1.3}s` }}
          />
        ))}
        <rect className="room__frame" x={960} y={36} width={250} height={120} rx={6} />
        <line className="room__mullion" x1={1085} y1={36} x2={1085} y2={156} />
        <line className="room__mullion" x1={960} y1={96} x2={1210} y2={96} />
        <rect className="room__sill" x={944} y={156} width={282} height={11} rx={4} />
      </g>

      {/* her, on the wall, in a frame — hung low enough to stay clear of the
          band's own fade, so it reads as on a wall and not up in the sky */}
      <g className="room__art">
        <rect className="room__mount" x={170} y={78} width={100} height={78} rx={4} />
        <Heart className="room__portrait" x={220} y={117} size={34} />
      </g>

      {/* the light he is packing by */}
      <g className="room__lamp">
        <line className="room__cord" x1={700} y1={0} x2={700} y2={52} />
        <path className="room__shade" d="M676 84 L724 84 L710 52 L690 52 Z" />
        <circle className="room__bulb" cx={700} cy={86} r={7} />
        <circle className="room__lamplight" cx={700} cy={92} r={78} />
      </g>

      <ellipse className="room__pool" cx={700} cy={FLOOR_Y} rx={320} ry={28} />

      <rect className="room__floor" x={-1300} y={FLOOR_Y} width={4000} height={40} />
      <rect className="room__skirting" x={-1300} y={FLOOR_Y - 9} width={4000} height={9} />
      <ellipse className="room__rug" cx={600} cy={FLOOR_Y + 2} rx={266} ry={16} />

      {/* a couple of hearts drifting through the lamplight */}
      {[0, 1].map((i) => (
        <Heart
          key={i}
          className="room__wish"
          x={318 + i * 74}
          y={258}
          size={14 + i * 5}
          style={{ animationDelay: `${i * 4.5}s` }}
        />
      ))}
    </g>
  );
}

/** The bed, made, with what is left to pack heaped on the far end. */
function Bed() {
  return (
    <g className="bed">
      <rect className="bed__head" x={1340} y={156} width={32} height={130} rx={8} />
      <rect className="bed__leg" x={872} y={276} width={16} height={24} />
      <rect className="bed__leg" x={1300} y={276} width={16} height={24} />
      <rect className="bed__frame" x={860} y={258} width={480} height={22} rx={6} />
      <rect className="bed__mattress" x={860} y={MATTRESS_Y} width={480} height={30} rx={10} />
      <rect className="bed__pillow" x={1216} y={204} width={116} height={30} rx={14} />
      <path
        className="bed__blanket"
        d="M860 246 L1180 246 L1180 274 Q 1120 282 1020 274 Q 940 268 860 276 Z"
      />

      {/* the pile still to go through */}
      <g className="pile">
        <path className="pile__item" d="M1058 232 q 14 -18 42 -15 q 32 3 46 15 z" />
        <path className="pile__item pile__item--warm" d="M1072 220 q 12 -16 34 -13 q 26 3 34 13 z" />
        <path className="pile__item" d="M1086 209 q 10 -11 26 -9 q 18 2 24 9 z" />
      </g>
    </g>
  );
}

/**
 * The shirt, drawn twice: open and flat on the bed, and folded. The sleeves come
 * in one at a time on the open one, and then the two cross-fade — squashing the
 * open shirt down into a bundle would drag its sleeves and collar down with it,
 * and a folded shirt is a different shape, not a shorter one.
 *
 * The folded bundle sits in the bottom half of the open shirt's box, which is
 * where the last fold would leave it, so the swap does not move anything.
 *
 * The placing group is separate from the one carrying the travel animation,
 * because a CSS transform would override a transform attribute on that element.
 */
function Garment() {
  return (
    <g transform="translate(935 216)">
      <g className="garment">
        <g className="garment__open">
          <rect className="garment__body" x={-24} y={-16} width={48} height={32} rx={5} />
          {/* sleeves over the body, so they still read as they come in */}
          <path className="garment__sleeve garment__sleeve--left" d="M-24 -12 L-44 -5 L-39 5 L-23 1 Z" />
          <path className="garment__sleeve garment__sleeve--right" d="M24 -12 L44 -5 L39 5 L23 1 Z" />
          <path className="garment__collar" d="M-7 -16 Q0 -10 7 -16" />
        </g>

        <g className="garment__folded">
          <rect className="garment__body" x={-24} y={0} width={48} height={16} rx={3} />
          <line className="garment__crease" x1={-19} y1={5} x2={19} y2={5} />
          <line className="garment__crease" x1={-24} y1={10.5} x2={24} y2={10.5} />
        </g>
      </g>
    </g>
  );
}

/** The case: lid on a hinge, and a stack that grows a layer per shirt. */
function Case() {
  const { left, right, top, bottom } = CASE;
  const width = right - left;

  return (
    <g className="case">
      <g transform={`translate(${left} ${top})`}>
        <g className="case__lid">
          <rect className="case__shell" x={0} y={-18} width={width} height={18} rx={6} />
          <rect className="case__lining" x={10} y={-15} width={width - 20} height={12} rx={3} />
          <Heart className="case__keepsake" x={width / 2} y={-9} size={13} />
        </g>
      </g>

      <rect className="case__shell" x={left} y={top} width={width} height={bottom - top} rx={8} />
      <rect className="case__lining" x={left + 12} y={top + 8} width={width - 24} height={bottom - top - 8} rx={4} />

      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          className={`case__layer case__layer--${i + 1}`}
          x={left + 45}
          y={top + 26 - i * 10}
          width={width - 90}
          height={9}
          rx={3}
        />
      ))}

      <line className="case__rim" x1={left} y1={top} x2={right} y2={top} />
    </g>
  );
}

export function House() {
  return (
    <div className="band house" aria-hidden="true">
      <div className="stage house__room">
        <svg viewBox="0 0 1400 320" fill="none" style={{ overflow: 'visible' }}>
          <defs>
            {/* solid all the way up — the band does the fading, in CSS, where
                it can be measured against the band's own top edge */}
            <linearGradient id="houseWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#291645" />
              <stop offset="55%" stopColor="#2c1748" />
              <stop offset="100%" stopColor="#33184c" />
            </linearGradient>
            <linearGradient id="houseNight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0e0722" />
              <stop offset="100%" stopColor="#6b2f55" />
            </linearGradient>
            <linearGradient id="houseEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--cream)" />
              <stop offset="55%" stopColor="var(--peach)" />
              <stop offset="100%" stopColor="var(--rose)" />
            </linearGradient>
            <radialGradient id="houseGlow">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <Room />
          <Bed />
          <Garment />

          {/* him, on the near side of the bed, so he stands in front of it */}
          <g transform={`translate(${HIM_X} ${FLOOR_Y}) scale(1.9)`}>
            <Folding />
          </g>

          {/* the case last of all: it is the nearest thing in the room */}
          <Case />
        </svg>
      </div>
    </div>
  );
}
