import React from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressBarColor =
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

export interface ProgressBarProps {
  value?: number;
  max?: number;
  size?: ProgressBarSize;
  color?: ProgressBarColor;
  striped?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
  showValue?: boolean;
  valuePosition?: 'inside' | 'outside';
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'mauve',
  striped = false,
  animated = false,
  indeterminate = false,
  showValue = false,
  valuePosition = 'outside',
  label,
  className = '',
}) => {
  const prefix = usePrefix();

  // Clamp value between 0 and max
  const normalizedValue = indeterminate ? 0 : Math.min(max, Math.max(0, value));
  const percent = max > 0 ? (normalizedValue / max) * 100 : 0;
  const progressPercent = Math.round(percent);

  // Wrapper CSS classes
  const classes = [
    cn(prefix, 'progressbar', [
      size,
      color,
      striped ? 'striped' : undefined,
      animated ? 'animated' : undefined,
      indeterminate ? 'indeterminate' : undefined,
    ]),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Render labels/values outside the progress track
  const renderLabelGroup = () => {
    if (!label && !(showValue && valuePosition === 'outside')) return null;

    return (
      <div className={cnEl(prefix, 'progressbar', 'label-group')}>
        {label && <span className={cnEl(prefix, 'progressbar', 'label')}>{label}</span>}
        {showValue && valuePosition === 'outside' && !indeterminate && (
          <span className={cnEl(prefix, 'progressbar', 'value-text')}>{progressPercent}%</span>
        )}
      </div>
    );
  };

  return (
    <div
      className={classes}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : normalizedValue}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : max}
      aria-label={label}
    >
      {renderLabelGroup()}
      <div className={cnEl(prefix, 'progressbar', 'track')}>
        <div
          className={cnEl(prefix, 'progressbar', 'fill')}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        >
          {showValue && valuePosition === 'inside' && size === 'lg' && !indeterminate && (
            <span className={cnEl(prefix, 'progressbar', 'value-inside')}>{progressPercent}%</span>
          )}
        </div>
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
