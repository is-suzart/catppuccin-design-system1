import React from 'react';

export type BadgeVariant = 'filled' | 'tonal' | 'outline' | 'flat';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'square' | 'rounded' | 'pill';
export type BadgeColor =
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

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  color?: BadgeColor;
  icon?: React.ReactNode;
  isDismissible?: boolean;
  onDismiss?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'filled',
  size = 'md',
  shape = 'pill',
  color = 'mauve',
  icon,
  isDismissible = false,
  onDismiss,
  className = '',
  children,
  ...props
}) => {
  const classNames = [
    'ctp-badge',
    `ctp-badge--${variant}`,
    `ctp-badge--${size}`,
    `ctp-badge--${shape}`,
    `ctp-badge--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...props}>
      {icon && <span className="ctp-badge__icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span className="ctp-badge__content">{children}</span>
      {isDismissible && (
        <button
          className="ctp-badge__close-btn"
          onClick={onDismiss}
          aria-label="Dismiss badge"
          style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '4px' }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
};

Badge.displayName = 'Badge';
