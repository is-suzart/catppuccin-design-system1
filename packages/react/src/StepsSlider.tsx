import React from 'react';

export interface StepsSliderProps {
  currentStep: number;
  children: React.ReactNode;
}

export const StepsSlider: React.FC<StepsSliderProps> = ({ currentStep, children }) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="ctp-steps-content-wrapper">
      <div
        className="ctp-steps-content-stage"
        style={{ transform: `translateX(-${currentStep * 100}%)` }}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className={`ctp-steps-content-slide ${
              index === currentStep ? 'ctp-steps-content-slide--active' : ''
            }`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
