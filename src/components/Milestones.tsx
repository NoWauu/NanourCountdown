import { arrivesAt, config, movesInAt } from '../config';
import type { Stage } from '../useCountdown';

interface MilestonesProps {
  stage: Stage;
  format: Intl.DateTimeFormat;
}

/**
 * Two dates in the order they happen: landing, then keys. Numbered because the
 * order is the point — one has to come before the other.
 */
export function Milestones({ stage, format }: MilestonesProps) {
  const steps = [
    { at: arrivesAt, name: `${config.arrivalStep} in ${config.toCity}`, done: stage !== 'travelling' },
    { at: movesInAt, name: config.moveInStep, done: stage === 'home' },
  ];

  const currentIndex = stage === 'travelling' ? 0 : 1;

  return (
    <ol className="steps">
      {steps.map((step, index) => (
        <li
          key={step.name}
          className={`step${step.done ? ' step--done' : ''}${
            index === currentIndex && stage !== 'home' ? ' step--now' : ''
          }`}
        >
          <span className="step__index">{index + 1}</span>
          <span className="step__name">{step.name}</span>
          <span className="step__date">{format.format(step.at)}</span>
        </li>
      ))}
    </ol>
  );
}
