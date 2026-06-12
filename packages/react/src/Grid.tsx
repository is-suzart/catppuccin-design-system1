import React, { ReactNode } from 'react';

export type GridGap = 0 | 1 | 2 | 3 | 4 | 5;
export type GridAlign = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type GridValign = 'start' | 'center' | 'end';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  mobile?: boolean;
  multiline?: boolean;
  gap?: GridGap;
  align?: GridAlign;
  valign?: GridValign;
  children: ReactNode;
  className?: string;
}

export interface GridColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  offset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  smOffset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  mdOffset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  lgOffset?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  children?: ReactNode;
  className?: string;
}

export const Grid: React.FC<GridProps> & {
  Col: React.FC<GridColProps>;
} = ({
  mobile = false,
  multiline = true,
  gap = 3,
  align,
  valign,
  children,
  className = '',
  ...props
}) => {
  const classes = [
    'grid',
    mobile ? 'grid--mobile' : '',
    multiline ? 'grid--multiline' : '',
    `grid--gap-${gap}`,
    align ? `grid--align-${align}` : '',
    valign ? `grid--valign-${valign}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const GridCol: React.FC<GridColProps> = ({
  span,
  sm,
  md,
  lg,
  offset,
  smOffset,
  mdOffset,
  lgOffset,
  children,
  className = '',
  ...props
}) => {
  const classes = [
    'grid__col',
    span ? `grid__col--${span}` : '',
    sm ? `grid__col--sm-${sm}` : '',
    md ? `grid__col--md-${md}` : '',
    lg ? `grid__col--lg-${lg}` : '',
    offset ? `grid__col--offset-${offset}` : '',
    smOffset ? `grid__col--sm-offset-${smOffset}` : '',
    mdOffset ? `grid__col--md-offset-${mdOffset}` : '',
    lgOffset ? `grid__col--lg-offset-${lgOffset}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Grid.Col = GridCol;
