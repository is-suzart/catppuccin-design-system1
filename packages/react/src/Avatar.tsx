import React, { useState } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;

  const initials = fallback && !showImage
    ? (fallback.length <= 2 ? fallback : getInitials(fallback))
    : null;

  return (
    <div className={`ctp-avatar ctp-avatar--${size} ${className}`} aria-label={alt || fallback || 'Avatar'}>
      {showImage ? (
        <img src={src} alt={alt} onError={() => setImgError(true)} />
      ) : (
        <span className="ctp-avatar__fallback">{initials || '?'}</span>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps {
  children: React.ReactNode;
  size?: AvatarSize;
  max?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  size = 'md',
  max,
  className = '',
}) => {
  const items = React.Children.toArray(children).filter(Boolean);
  const visible = max ? items.slice(0, max) : items;
  const remaining = max ? Math.max(0, items.length - max) : 0;

  return (
    <div className={`ctp-avatar-group ctp-avatar-group--${size} ${className}`}>
      {React.Children.map(visible, (child, i) =>
        React.cloneElement(child as React.ReactElement<{ size?: AvatarSize }>, { size, key: i })
      )}
      {remaining > 0 && (
        <span className="ctp-avatar-group__more" style={{ width: size === 'sm' ? 28 : size === 'lg' ? 48 : 36, height: size === 'sm' ? 28 : size === 'lg' ? 48 : 36 }}>
          +{remaining}
        </span>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';
