import { useEffect, useMemo } from 'react';
import { Sky } from './components/Sky';
import { JourneyArc } from './components/JourneyArc';
import { Milestones } from './components/Milestones';
import { Train } from './components/Train';
import { config, journeyDates } from './config';
import { useJourney } from './useCountdown';
import { Analytics } from '@vercel/analytics/react';

const pad = (value: number) => String(value).padStart(2, '0');

const COPY = {
  travelling: { eyebrow: config.eyebrow, note: config.message },
  settling: { eyebrow: config.settlingEyebrow, note: config.settlingMessage },
  home: { eyebrow: 'no more counting', note: config.arrivedMessage },
} as const;

export function App() {
  const journey = useJourney(journeyDates);
  const home = journey.stage === 'home';
  const copy = COPY[journey.stage];

  const format = useMemo(
    () =>
      new Intl.DateTimeFormat(config.locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: config.timeZone,
      }),
    [],
  );

  useEffect(() => {
    document.title = home ? `Home · ${config.toCity}` : `${journey.label} · ${config.toCity}`;
  }, [journey.label, home]);

  const spoken = home
    ? config.arrivedMessage
    : `${journey.days} days, ${journey.hours} hours and ${journey.minutes} minutes until ${
        journey.stage === 'travelling' ? config.toCity : config.homeLabel
      }`;

  return (
    <>
      <Analytics />
      <Sky />
      {journey.onboard && <Train destination={config.toCity} rideProgress={journey.rideProgress} />}

      <main className={`page${home ? ' page--home' : ''}${journey.onboard ? ' page--riding' : ''}`}>
        <JourneyArc
          from={journey.stage === 'travelling' ? config.fromCity : config.toCity}
          to={journey.stage === 'travelling' ? config.toCity : config.homeLabel}
          progress={journey.progress}
        />

        <section className="counter">
          <p className="counter__eyebrow">{copy.eyebrow}</p>

          <p className="counter__value" role="timer" aria-label={spoken}>
            {journey.label}
          </p>

          {!home && (
            <p className="counter__breakdown">
              <span>{journey.days}<i>d</i></span>
              <span>{pad(journey.hours)}<i>h</i></span>
              <span>{pad(journey.minutes)}<i>m</i></span>
              <span>{pad(journey.seconds)}<i>s</i></span>
            </p>
          )}
        </section>

        <p className="note">{copy.note}</p>

        <Milestones stage={journey.stage} format={format} />
      </main>
    </>
  );
}
