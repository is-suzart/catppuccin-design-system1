import React from 'react';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

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
  const prefix = usePrefix();
  const classes = [
    cn(prefix, 'skeleton', [variant, size, animated ? '' : 'no-animation', width ? '' : 'full']),
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
