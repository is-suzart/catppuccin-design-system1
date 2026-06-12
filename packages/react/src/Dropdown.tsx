import React, { useState, useRef, useEffect, ReactNode, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import { usePortalPosition, Placement } from './usePortalPosition';
import { ButtonColor } from './Button';

interface DropdownContextType {
  isOpen: boolean;
  close: () => void;
  color: ButtonColor;
  closeOnItemClick: boolean;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export interface DropdownProps {
  trigger: React.ReactElement;
  children: ReactNode;
  placement?: Placement;
  offset?: number;
  color?: ButtonColor;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnItemClick?: boolean;
  autoFlip?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> & {
  Item: React.FC<DropdownItemProps>;
  Divider: React.FC<DropdownDividerProps>;
  Header: React.FC<DropdownHeaderProps>;
} = ({
  trigger,
  children,
  placement = 'bottom-start',
  offset = 4,
  color = 'mauve',
  isOpen: controlledIsOpen,
  onOpenChange,
  closeOnItemClick = true,
  autoFlip = true,
  className = '',
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const triggerRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const setOpen = (open: boolean) => {
    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setUncontrolledIsOpen(open);
    }
  };

  const close = () => setOpen(false);
  const toggle = () => setOpen(!isOpen);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close when clicking outside of trigger AND dropdown menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        (!floatingRef.current || !floatingRef.current.contains(target))
      ) {
        if (isOpen) close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const { top, left, actualPlacement } = usePortalPosition(triggerRef, floatingRef, {
    isOpen,
    placement,
    offset,
    autoFlip,
  });

  // Attach refs and event listeners to trigger child
  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        ref: triggerRef,
        onClick: (e: React.MouseEvent) => {
          if (trigger.props.onClick) trigger.props.onClick(e);
          toggle();
        },
        'aria-haspopup': 'true',
        'aria-expanded': isOpen,
      })
    : trigger;

  return (
    <DropdownContext.Provider value={{ isOpen, close, color, closeOnItemClick }}>
      {triggerEl}
      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={floatingRef}
            className={`ctp-dropdown-menu ctp-dropdown-menu--${actualPlacement} ${className}`}
            style={{
              position: 'fixed',
              top: `${top}px`,
              left: `${left}px`,
              zIndex: 1050,
            }}
            role="menu"
          >
            {children}
          </div>,
          document.body
        )}
    </DropdownContext.Provider>
  );
};

// ==========================================
// DROPDOWN ITEM COMPONENT
// ==========================================
export interface DropdownItemProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  danger?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  icon,
  danger = false,
}) => {
  const context = useContext(DropdownContext);
  const color = context?.color || 'mauve';

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    onClick?.(e);
    if (context?.closeOnItemClick) {
      context.close();
    }
  };

  const itemClass = [
    'ctp-dropdown-item',
    danger ? 'ctp-dropdown-item--danger' : `ctp-dropdown-item--${color}`,
    disabled ? 'ctp-dropdown-item--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={itemClass}
      onClick={handleClick}
      disabled={disabled}
      role="menuitem"
    >
      {icon && <span className="ctp-dropdown-item__icon">{icon}</span>}
      <span className="ctp-dropdown-item__content">{children}</span>
    </button>
  );
};

// ==========================================
// DROPDOWN DIVIDER COMPONENT
// ==========================================
export interface DropdownDividerProps {
  className?: string;
}

const DropdownDivider: React.FC<DropdownDividerProps> = ({ className = '' }) => {
  return <div className={`ctp-dropdown-divider ${className}`} role="separator" />;
};

// ==========================================
// DROPDOWN HEADER COMPONENT
// ==========================================
export interface DropdownHeaderProps {
  children: ReactNode;
  className?: string;
}

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ children, className = '' }) => {
  return <div className={`ctp-dropdown-header ${className}`}>{children}</div>;
};

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;
Dropdown.Header = DropdownHeader;
