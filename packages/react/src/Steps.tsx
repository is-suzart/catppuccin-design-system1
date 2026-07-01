import React from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

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
  const prefix = usePrefix();
  const handleStepClick = (index: number) => {
    if (onChangeStep) {
      onChangeStep(index);
    }
  };

  const stepsClass = `${prefix}-steps--${color}`;

  if (variant === 'carousel') {
    return (
      <div className={`${cn(prefix, 'steps-carousel')} ${stepsClass}`}>
        {Array.from({ length: stepsCount }).map((_, index) => (
          <button
            key={index}
            className={cn(prefix, 'steps-carousel-dot', [index === currentStep ? 'active' : ''].filter(Boolean))}
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
    cn(prefix, 'steps-timeline', [isVertical ? 'vertical' : 'horizontal']),
    stepsClass,
  ].join(' ');

  return (
    <div className={timelineClasses}>
      <div className={cnEl(prefix, 'steps', 'track')}>
        <div
          className={cnEl(prefix, 'steps', 'progress')}
          style={progressStyle}
        />
      </div>

      {Array.from({ length: stepsCount }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const itemClass = cn(prefix, 'steps__item', [
          isActive ? 'active' : '',
          isCompleted ? 'completed' : '',
        ].filter(Boolean));

        return (
          <button
            key={index}
            className={itemClass}
            onClick={() => handleStepClick(index)}
            aria-label={`Step ${index + 1}`}
          >
            <div className={cnEl(prefix, 'steps', 'dot')} />
            {labels[index] && <span className={cnEl(prefix, 'steps', 'label')}>{labels[index]}</span>}
          </button>
        );
      })}
    </div>
  );
};
