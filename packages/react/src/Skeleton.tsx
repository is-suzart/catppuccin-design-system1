import React from 'react';

export type SkeletonVariant = 'text' | 'circle' | 'rect';
export type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
  count?: number;
  gap?: string | number;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  size = 'md',
  width,
  height,
  className = '',
  animated = true,
  count = 1,
  gap = '8px',
  children,
}) => {
  const classes = [
    'ctp-skeleton',
    `ctp-skeleton--${variant}`,
    `ctp-skeleton--${size}`,
    !animated ? 'ctp-skeleton--no-animation' : '',
    width ? '' : 'ctp-skeleton--full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  if (children) {
    return (
      <span className={classes} style={style} aria-hidden="true">
        {children}
      </span>
    );
  }

  if (count > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={classes} style={style} aria-hidden="true" />
        ))}
      </div>
    );
  }

  return <div className={classes} style={style} aria-hidden="true" />;
};

Skeleton.displayName = 'Skeleton';
