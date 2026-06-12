import React from 'react';

export type FormControlSize = 'sm' | 'md' | 'lg';
export type FormControlShape = 'square' | 'rounded' | 'pill';
export type FormControlColor =
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

// Helper to determine the theme modifier class on parent container
export const getFormThemeClass = (color?: FormControlColor) => {
  return color ? `ctp-form--${color}` : '';
};

// 1. Form Group Component (Wrapper)
export interface FormGroupProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  required?: boolean;
  width?: 33 | 50 | 100;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  description,
  error,
  required,
  width = 100,
  children,
  className = '',
  htmlFor,
}) => {
  // Grid mapping classes
  let gridColClass = 'ctp-form-col-12';
  if (width === 50) gridColClass = 'ctp-form-col-6';
  else if (width === 33) gridColClass = 'ctp-form-col-4';

  return (
    <div className={`ctp-form-group ${gridColClass} ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="ctp-form-group__label">
          {label}
          {required && (
            <span className="ctp-form-group__required-indicator" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error && (
        <span className="ctp-form-group__error" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </span>
      )}
      {description && !error && (
        <span className="ctp-form-group__description">{description}</span>
      )}
    </div>
  );
};

// 2. Input Component
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: FormControlSize;
  shape?: FormControlShape;
  color?: FormControlColor;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', shape = 'rounded', color = 'mauve', error = false, className = '', ...props }, ref) => {
    const classNames = [
      'ctp-form-control',
      `ctp-form-control--${size}`,
      `ctp-form-control--${shape}`,
      error ? 'ctp-form-control--error' : '',
      getFormThemeClass(color),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <input ref={ref} className={classNames} {...props} />;
  }
);
Input.displayName = 'Input';

// 3. TextArea Component
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: FormControlSize;
  shape?: 'square' | 'rounded';
  color?: FormControlColor;
  error?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ size = 'md', shape = 'rounded', color = 'mauve', error = false, className = '', ...props }, ref) => {
    const classNames = [
      'ctp-form-control',
      `ctp-form-control--${size}`,
      `ctp-form-control--${shape}`,
      error ? 'ctp-form-control--error' : '',
      getFormThemeClass(color),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <textarea ref={ref} className={classNames} {...props} />;
  }
);
TextArea.displayName = 'TextArea';

// 4. Select Component
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: FormControlSize;
  shape?: FormControlShape;
  color?: FormControlColor;
  error?: boolean;
  options?: { label: string; value: any }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'md', shape = 'rounded', color = 'mauve', error = false, options = [], children, className = '', ...props }, ref) => {
    const classNames = [
      'ctp-form-control',
      `ctp-form-control--${size}`,
      `ctp-form-control--${shape}`,
      error ? 'ctp-form-control--error' : '',
      getFormThemeClass(color),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <select ref={ref} className={classNames} {...props}>
        {children}
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = 'Select';

// 5. Checkbox Component
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  color?: FormControlColor;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, color = 'mauve', disabled, className = '', ...props }, ref) => {
    const rowClass = [
      'ctp-checkbox-row',
      disabled ? 'ctp-checkbox-row--disabled' : '',
      getFormThemeClass(color),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={rowClass}>
        <input ref={ref} type="checkbox" disabled={disabled} {...props} />
        <span className="ctp-checkbox-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span>{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// 6. Switch / Toggle Component
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  color?: FormControlColor;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, color = 'mauve', disabled, className = '', ...props }, ref) => {
    const rowClass = [
      'ctp-switch-row',
      disabled ? 'ctp-switch-row--disabled' : '',
      getFormThemeClass(color),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={rowClass}>
        <input ref={ref} type="checkbox" disabled={disabled} {...props} />
        <span className="ctp-switch-track">
          <span className="ctp-switch-thumb"></span>
        </span>
        <span>{label}</span>
      </label>
    );
  }
);
Switch.displayName = 'Switch';

// 7. Radio Group Component
export interface RadioGroupProps {
  name: string;
  options: { label: string; value: any }[];
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color?: FormControlColor;
  vertical?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, options, value, onChange, color = 'mauve', vertical = false, disabled = false, className = '' }, ref) => {
    const groupClass = [
      'ctp-radio-group',
      vertical ? 'ctp-radio-group--vertical' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={groupClass}>
        {options.map((opt, idx) => {
          const itemClass = [
            'ctp-radio-item',
            disabled ? 'ctp-radio-item--disabled' : '',
            getFormThemeClass(color),
          ]
            .filter(Boolean)
            .join(' ');

          const isChecked = value !== undefined && String(value) === String(opt.value);

          return (
            <label key={idx} className={itemClass}>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isChecked}
                onChange={onChange}
                disabled={disabled}
              />
              <span className="ctp-radio-circle">
                <span className="ctp-radio-dot"></span>
              </span>
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

// 8. Range Slider Component
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  color?: FormControlColor;
  min?: number;
  max?: number;
  showValue?: boolean;
  value?: number;
  onChange?: (val: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ color = 'mauve', min = 0, max = 100, showValue = true, value = 50, onChange, className = '', disabled, ...props }, ref) => {
    const containerClass = [
      'ctp-slider-container',
      getFormThemeClass(color),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(Number(e.target.value));
      }
    };

    return (
      <div className={containerClass}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="ctp-slider"
          {...props}
        />
        {showValue && <span className="ctp-slider-value">{value}</span>}
      </div>
    );
  }
);
Slider.displayName = 'Slider';
