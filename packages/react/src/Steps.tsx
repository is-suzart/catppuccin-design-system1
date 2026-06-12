import React from 'react';

export type StepsVariant = 'timeline' | 'carousel';
export type StepsColor =
  | 'rosewater'
  | 'flamingo'
  | 'pink'
  | 'mauve'
  | 'red'
  | 'maroon'
  | 'peach'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'sky'
  | 'sapphire'
  | 'blue'
  | 'lavender';

export interface StepsProps {
  currentStep: number;
  stepsCount: number;
  labels?: string[];
  variant?: StepsVariant;
  color?: StepsColor;
  onChangeStep?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Steps: React.FC<StepsProps> = ({
  currentStep,
  stepsCount,
  labels = [],
  variant = 'timeline',
  color = 'mauve',
  onChangeStep,
  orientation = 'horizontal',
}) => {
  const handleStepClick = (index: number) => {
    if (onChangeStep) {
      onChangeStep(index);
    }
  };

  const stepsClass = `ctp-steps--${color}`;

  if (variant === 'carousel') {
    return (
      <div className={`ctp-steps-carousel ${stepsClass}`}>
        {Array.from({ length: stepsCount }).map((_, index) => (
          <button
            key={index}
            className={`ctp-steps-carousel-dot ${index === currentStep ? 'ctp-steps-carousel-dot--active' : ''}`}
            onClick={() => handleStepClick(index)}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    );
  }

  // timeline variant
  const isVertical = orientation === 'vertical';
  const progressWidth = stepsCount > 1 ? (currentStep / (stepsCount - 1)) * 100 : 0;
  const progressStyle = isVertical
    ? { height: `${progressWidth}%` }
    : { width: `${progressWidth}%` };

  const timelineClasses = [
    'ctp-steps-timeline',
    isVertical ? 'ctp-steps-timeline--vertical' : 'ctp-steps-timeline--horizontal',
    stepsClass,
  ].join(' ');

  return (
    <div className={timelineClasses}>
      <div className="ctp-steps-track">
        <div
          className="ctp-steps-progress"
          style={progressStyle}
        />
      </div>

      {Array.from({ length: stepsCount }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const itemClass = [
          'ctp-steps-item',
          isActive ? 'ctp-steps-item--active' : '',
          isCompleted ? 'ctp-steps-item--completed' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={index}
            className={itemClass}
            onClick={() => handleStepClick(index)}
            aria-label={`Step ${index + 1}`}
          >
            <div className="ctp-steps-dot" />
            {labels[index] && <span className="ctp-steps-label">{labels[index]}</span>}
          </button>
        );
      })}
    </div>
  );
};
