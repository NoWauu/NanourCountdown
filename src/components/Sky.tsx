import { useMemo } from 'react';

/** Seeded so the sky looks the same on every load instead of reshuffling. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const HEART =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

export function Sky() {
  const stars = useMemo(() => {
    const random = seeded(20260912);
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: random() * 100,
      y: random() * 78,
      r: 0.4 + random() * 1.1,
      delay: random() * 6,
      duration: 3.5 + random() * 4.5,
    }));
  }, []);

  const hearts = useMemo(() => {
    const random = seeded(1404);
    return Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: 4 + random() * 92,
      size: 26 + random() * 58,
      delay: random() * 26,
      duration: 30 + random() * 22,
      drift: `${(random() * 60 - 30).toFixed(1)}px`,
    }));
  }, []);

  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__horizon" />
      <div className="sky__glow sky__glow--left" />
      <div className="sky__glow sky__glow--right" />

      <div className="sky__stars">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.r * 2}px`,
              height: `${star.r * 2}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="sky__hearts">
        {hearts.map((heart) => (
          <svg
            key={heart.id}
            className="heart"
            viewBox="0 0 24 24"
            style={{
              left: `${heart.x}%`,
              width: `${heart.size}px`,
              animationDelay: `-${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              ['--drift' as string]: heart.drift,
            }}
          >
            <path d={HEART} />
          </svg>
        ))}
      </div>

      <div className="sky__grain" />
    </div>
  );
}
