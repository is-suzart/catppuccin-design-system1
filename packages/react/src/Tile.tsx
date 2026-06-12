import React from 'react';

export type TileVariant = 'flat' | 'elevated' | 'outline' | 'tonal' | 'colored';
export type TileSize = 'sm' | 'md' | 'lg';
export type TileShape = 'square' | 'rounded' | 'pill';
export type TileOrientation = 'horizontal' | 'vertical' | 'vertical-center';
export type TileIndicator = 'none' | 'top' | 'bottom' | 'left' | 'right';
export type TileColor =
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

export interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TileVariant;
  size?: TileSize;
  shape?: TileShape;
  orientation?: TileOrientation;
  color?: TileColor;
  indicator?: TileIndicator;
  isInteractive?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
}

export const Tile: React.FC<TileProps> = ({
  variant = 'flat',
  size = 'md',
  shape = 'rounded',
  orientation = 'horizontal',
  color = 'mauve',
  indicator = 'none',
  isInteractive = false,
  isSelected = false,
  isDisabled = false,
  icon,
  title,
  subtitle,
  meta,
  className = '',
  children,
  ...props
}) => {
  const classNames = [
    'ctp-tile',
    `ctp-tile--${variant}`,
    `ctp-tile--${size}`,
    `ctp-tile--${shape}`,
    `ctp-tile--${orientation}`,
    color ? `ctp-tile--${color}` : '',
    indicator !== 'none' ? `ctp-tile--indicator-${indicator}` : '',
    isInteractive ? 'ctp-tile--interactive' : '',
    isSelected ? 'ctp-tile--selected' : '',
    isDisabled ? 'ctp-tile--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children ? (
        children
      ) : (
        <>
          {icon && <div className="ctp-tile__icon">{icon}</div>}
          {(title || subtitle) && (
            <div className="ctp-tile__content">
              {title && <span className="ctp-tile__title">{title}</span>}
              {subtitle && <span className="ctp-tile__subtitle">{subtitle}</span>}
            </div>
          )}
          {meta && <div className="ctp-tile__meta">{meta}</div>}
        </>
      )}
    </div>
  );
};

Tile.displayName = 'Tile';
