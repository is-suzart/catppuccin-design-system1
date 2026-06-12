import React from 'react';
import { ButtonColor } from './Button';

export interface StepItem {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperVariant = 'default' | 'dots' | 'icon' | 'labeled-icon';

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  orientation?: StepperOrientation;
  variant?: StepperVariant;
  color?: ButtonColor;
  className?: string;
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  variant = 'default',
  color = 'mauve',
  className = '',
}) => {
  const totalSteps = steps.length;
  const segments = Math.max(1, totalSteps - 1);
  const progressPercent = Math.min(100, Math.max(0, (currentStep / segments) * 100));

  const wrapperClassNames = [
    'ctp-stepper-wrapper',
    `ctp-stepper--${orientation}`,
    `ctp-stepper--${variant}`,
    `ctp-stepper--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cssStyle = {
    '--ctp-total-steps': totalSteps,
    '--ctp-stepper-progress': `${progressPercent}%`,
  } as React.CSSProperties;

  return (
    <div className={wrapperClassNames} style={cssStyle}>
      {/* Background line track */}
      <div className="ctp-stepper__track">
        <div className="ctp-stepper__track-active" />
      </div>

      {/* Render Steps */}
      {steps.map((step, index) => {
        let status: 'completed' | 'active' | 'upcoming' = 'upcoming';
        if (index < currentStep) status = 'completed';
        else if (index === currentStep) status = 'active';

        const stepClassNames = [
          'ctp-stepper__step',
          `ctp-stepper__step--${status}`,
        ].join(' ');

        // Compute what to render inside the node circle
        let nodeContent: React.ReactNode = null;
        if (variant !== 'dots') {
          if (status === 'completed') {
            nodeContent = <CheckIcon />;
          } else if ((variant === 'icon' || variant === 'labeled-icon') && step.icon) {
            nodeContent = step.icon;
          } else {
            nodeContent = index + 1;
          }
        }

        return (
          <div key={index} className={stepClassNames}>
            {/* Step node icon / dot / number */}
            <div className="ctp-stepper__node">
              {nodeContent}
            </div>

            {/* Vertical track segment inside step item for vertical layout styling */}
            {orientation === 'vertical' && index < totalSteps - 1 && (
              <div className="ctp-stepper__track">
                <div 
                  className="ctp-stepper__track-active" 
                  style={{ 
                    height: index < currentStep ? '100%' : index === currentStep ? '50%' : '0%' 
                  }} 
                />
              </div>
            )}

            {/* Labels (skip rendering labels on horizontal if dot variant is active) */}
            {!(variant === 'dots' && orientation === 'horizontal') && (
              <div className="ctp-stepper__label-group">
                <h4 className="ctp-stepper__title">{step.label}</h4>
                {step.description && (
                  <p className="ctp-stepper__description">{step.description}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

Stepper.displayName = 'Stepper';
