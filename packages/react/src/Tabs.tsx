import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { FormControlColor, getFormThemeClass } from './FormControls';

export type TabsVariant = 'default' | 'underline' | 'pills' | 'segmented';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsMode = 'state' | 'router';

interface TabsContextProps {
  value: string;
  onValueChange: (val: string) => void;
  variant: TabsVariant;
  size: 'sm' | 'md' | 'lg';
  color: FormControlColor;
  orientation: TabsOrientation;
  mode: TabsMode;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound subcomponents must be rendered within a <Tabs /> provider.');
  }
  return context;
};

// 1. Root Tabs Component
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  variant?: TabsVariant;
  size?: 'sm' | 'md' | 'lg';
  color?: FormControlColor;
  orientation?: TabsOrientation;
  mode?: TabsMode;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue,
      value: controlledValue,
      onValueChange,
      variant = 'default',
      size = 'md',
      color = 'mauve',
      orientation = 'horizontal',
      mode = 'state',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(defaultValue || '');
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : localValue;

    const handleValueChange = useCallback((val: string) => {
      if (!isControlled) {
        setLocalValue(val);
      }
      if (onValueChange) {
        onValueChange(val);
      }
    }, [isControlled, onValueChange]);

    // Auto-select first trigger's value if no default is provided
    // (only in state mode; router mode determines active tab from URL)
    useEffect(() => {
      if (mode === 'state' && !activeValue && children) {
        const findFirstValue = (nodeList: React.ReactNode): string | null => {
          let found: string | null = null;
          React.Children.forEach(nodeList, (child) => {
            if (found) return;
            if (React.isValidElement(child)) {
              if (child.props.value) {
                found = child.props.value;
              } else if (child.props.children) {
                found = findFirstValue(child.props.children);
              }
            }
          });
          return found;
        };
        const firstVal = findFirstValue(children);
        if (firstVal) {
          handleValueChange(firstVal);
        }
      }
    }, [children]);

    const containerClass = [
      'ctp-tabs',
      `ctp-tabs--${orientation}`,
      getFormThemeClass(color),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <TabsContext.Provider
        value={{
          value: activeValue,
          onValueChange: handleValueChange,
          variant,
          size,
          color,
          orientation,
          mode,
        }}
      >
        <div ref={ref} className={containerClass} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

// 2. TabsList Component (Triggers Container)
export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className = '', children, ...props }, ref) => {
    const { variant, orientation } = useTabs();

    const listClass = [
      'ctp-tabs-list',
      `ctp-tabs-list--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const list = e.currentTarget;
      const triggers = Array.from(list.querySelectorAll('[role="tab"]:not([disabled])')) as HTMLElement[];
      const activeIndex = triggers.findIndex((el) => el.getAttribute('aria-selected') === 'true');
      
      if (activeIndex === -1) return;

      let nextIndex = activeIndex;
      const isHorizontal = orientation === 'horizontal';

      if (isHorizontal) {
        if (e.key === 'ArrowRight') {
          nextIndex = (activeIndex + 1) % triggers.length;
        } else if (e.key === 'ArrowLeft') {
          nextIndex = (activeIndex - 1 + triggers.length) % triggers.length;
        }
      } else {
        if (e.key === 'ArrowDown') {
          nextIndex = (activeIndex + 1) % triggers.length;
        } else if (e.key === 'ArrowUp') {
          nextIndex = (activeIndex - 1 + triggers.length) % triggers.length;
        }
      }

      if (nextIndex !== activeIndex) {
        e.preventDefault();
        const nextTrigger = triggers[nextIndex];
        nextTrigger.focus();
        
        const newValue = nextTrigger.getAttribute('data-value');
        const triggerBtn = nextTrigger as HTMLButtonElement;
        
        if (newValue && !triggerBtn.disabled) {
          triggerBtn.click();
        }
      }
    };

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        className={listClass}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'TabsList';

// 3. TabsTrigger Component
export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  to?: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, to, className = '', disabled, children, ...props }, ref) => {
    const { value: activeValue, onValueChange, variant, size, mode } = useTabs();
    const navigate = useNavigate();
    const location = useLocation();

    const isSelected = (mode === 'router' && to)
      ? matchPath({ path: to, end: true }, location.pathname) !== null
      : activeValue === value;

    const triggerClass = [
      'ctp-tabs-trigger',
      `ctp-tabs-trigger--${variant}`,
      `ctp-tabs-trigger--${size}`,
      isSelected ? 'ctp-tabs-trigger--active' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (mode === 'router' && to) {
        navigate(to);
      } else {
        onValueChange(value);
      }

      if (props.onClick) {
        props.onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        aria-controls={`ctp-tabpanel-${value}`}
        id={`ctp-tabtrigger-${value}`}
        data-value={value}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        className={triggerClass}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

// 4. TabsContent Component (Panel Container)
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className = '', children, ...props }, ref) => {
    const { value: activeValue, mode } = useTabs();
    const location = useLocation();

    const isActive = mode === 'router'
      ? matchPath({ path: value, end: true }, location.pathname) !== null
      : activeValue === value;

    const contentClass = [
      'ctp-tabs-content',
      isActive ? 'ctp-tabs-content--active' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`ctp-tabpanel-${value}`}
        aria-labelledby={`ctp-tabtrigger-${value}`}
        tabIndex={0}
        className={contentClass}
        style={!isActive ? { display: 'none' } : undefined}
        {...props}
      >
        {isActive && children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';
