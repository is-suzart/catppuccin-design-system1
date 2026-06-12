import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormControlColor, getFormThemeClass } from './FormControls';

export type TabsVariant = 'default' | 'underline' | 'pills' | 'segmented';
export type TabsOrientation = 'horizontal' | 'vertical';

interface TabsContextProps {
  value: string;
  onValueChange: (val: string) => void;
  variant: TabsVariant;
  size: 'sm' | 'md' | 'lg';
  color: FormControlColor;
  orientation: TabsOrientation;
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
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(defaultValue || '');
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : localValue;

    const handleValueChange = (val: string) => {
      if (!isControlled) {
        setLocalValue(val);
      }
      if (onValueChange) {
        onValueChange(val);
      }
    };

    // Auto-select first trigger's value if no default is provided
    useEffect(() => {
      if (!activeValue && children) {
        // Simple search inside children to locate the first TabsTrigger value
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
        
        // Select tab upon focus
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
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className = '', disabled, children, ...props }, ref) => {
    const { value: activeValue, onValueChange, variant, size } = useTabs();
    const isSelected = activeValue === value;

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
      onValueChange(value);
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
    const { value: activeValue } = useTabs();
    const isActive = activeValue === value;

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
