import React from 'react';

export type CardVariant = 'filled' | 'elevated' | 'outline' | 'flat' | 'colored';
export type CardShape = 'square' | 'rounded' | 'pill';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardAccentColor =
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
export type CardAccentPosition = 'top' | 'left' | 'none';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  shape?: CardShape;
  padding?: CardPadding;
  accentColor?: CardAccentColor;
  accentPosition?: CardAccentPosition;
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
  Media: React.FC<CardMediaProps>;
} = ({
  variant = 'filled',
  shape = 'rounded',
  padding = 'md',
  accentColor,
  accentPosition = 'none',
  isInteractive = false,
  className = '',
  children,
  ...props
}) => {
  const classNames = [
    'ctp-card',
    `ctp-card--${variant}`,
    `ctp-card--${shape}`,
    `ctp-card--padding-${padding}`,
    accentColor ? `ctp-card--${accentColor}` : '',
    accentColor && accentPosition !== 'none' ? `ctp-card--accent-${accentPosition}` : '',
    isInteractive ? 'ctp-card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  avatar?: React.ReactNode;
  actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  avatar,
  actions,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`ctp-card__header ${className}`} {...props}>
      {avatar && <div className="ctp-card__avatar">{avatar}</div>}
      {(title || subtitle) && (
        <div className="ctp-card__header-content">
          {title && <h3 className="ctp-card__title">{title}</h3>}
          {subtitle && <p className="ctp-card__subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
      {actions && <div className="ctp-card__actions">{actions}</div>}
    </div>
  );
};

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody: React.FC<CardBodyProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`ctp-card__body ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`ctp-card__footer ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

export const CardMedia: React.FC<CardMediaProps> = ({ src, alt = '', className = '', children, ...props }) => {
  return (
    <div className={`ctp-card__media ${className}`} {...props}>
      {src ? <img src={src} alt={alt} /> : children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Media = CardMedia;

Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';
CardMedia.displayName = 'Card.Media';
