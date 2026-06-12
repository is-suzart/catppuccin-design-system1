import React from 'react';

export type ButtonVariant = 'filled' | 'tonal' | 'outline' | 'ghost';
export type ButtonColor =
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
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'square' | 'rounded' | 'pill';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'filled',
      color = 'mauve',
      size = 'md',
      shape = 'rounded',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'ctp-btn',
      `ctp-btn--${variant}`,
      `ctp-btn--${color}`,
      `ctp-btn--${size}`,
      `ctp-btn--${shape}`,
      isLoading ? 'ctp-btn--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled || isLoading}
        {...props}
      >
        <span className="ctp-btn__content">
          {isLoading && <span className="ctp-btn__spinner" aria-hidden="true" />}
          {!isLoading && leftIcon && <span className="ctp-btn__icon-left" style={{ display: 'inline-flex', alignItems: 'center' }}>{leftIcon}</span>}
          {children}
          {!isLoading && rightIcon && <span className="ctp-btn__icon-right" style={{ display: 'inline-flex', alignItems: 'center' }}>{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
