import React, { useState, useRef, useCallback, useEffect } from 'react';

export interface CarouselProps {
  children: React.ReactNode;
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 4000,
  className = '',
}) => {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const slides = React.Children.toArray(children).filter(Boolean);
  const total = slides.length;

  const goTo = useCallback((index: number) => {
    setCurrent(Math.max(0, Math.min(index, total - 1)));
  }, [total]);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (autoPlay && total > 1) {
      intervalRef.current = setInterval(next, autoPlayInterval);
      return () => clearInterval(intervalRef.current);
    }
  }, [autoPlay, autoPlayInterval, total, next]);

  if (total === 0) return null;

  return (
    <div className={`ctp-carousel ${className}`} role="region" aria-label="Carousel">
      <div className="ctp-carousel__viewport">
        <div
          ref={trackRef}
          className="ctp-carousel__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="ctp-carousel__slide" role="group" aria-roledescription="slide" aria-label={`Slide ${i + 1} of ${total}`}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      {showArrows && total > 1 && (
        <>
          <button className="ctp-carousel__btn ctp-carousel__btn--prev" onClick={prev} aria-label="Previous slide" disabled={current === 0}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="ctp-carousel__btn ctp-carousel__btn--next" onClick={next} aria-label="Next slide" disabled={current === total - 1}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
      {showDots && total > 1 && (
        <div className="ctp-carousel__dots" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`ctp-carousel__dot${i === current ? ' ctp-carousel__dot--active' : ''}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Carousel.displayName = 'Carousel';
