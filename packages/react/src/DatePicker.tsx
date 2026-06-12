import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import ReactDOM from 'react-dom';
import { usePortalPosition, Placement } from './usePortalPosition';
import { FormControlColor } from './FormControls';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type DatePickerMode = 'single' | 'range';

export interface DatePickerProps {
  /** Current selected date (single mode) */
  value?: Date | null;
  /** Current selected range (range mode) */
  rangeValue?: { start: Date | null; end: Date | null };
  /** Mode: 'single' or 'range' */
  mode?: DatePickerMode;
  /** Called when a date is selected in single mode */
  onChange?: (date: Date | null) => void;
  /** Called when range changes */
  onRangeChange?: (range: { start: Date | null; end: Date | null }) => void;
  /** Accent color from Catppuccin palette */
  color?: FormControlColor;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Display format function */
  formatDate?: (date: Date) => string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Whether to show the "Today" shortcut button */
  showToday?: boolean;
  /** Calendar popover placement */
  placement?: Placement;
  /** Extra class on the root wrapper */
  className?: string;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(date: Date, start: Date, end: Date) {
  const t = date.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return t > s && t < e;
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function defaultFormat(date: Date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

// ──────────────────────────────────────────────
// Calendar Grid
// ──────────────────────────────────────────────

interface CalendarGridProps {
  viewYear: number;
  viewMonth: number;
  selectedDate?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  hoverDate?: Date | null;
  mode: DatePickerMode;
  minDate?: Date;
  maxDate?: Date;
  color: FormControlColor;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | null) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  viewYear,
  viewMonth,
  selectedDate,
  rangeStart,
  rangeEnd,
  hoverDate,
  mode,
  minDate,
  maxDate,
  color,
  onDayClick,
  onDayHover,
}) => {
  const firstDay = startOfMonth(viewYear, viewMonth);
  const startWeekday = firstDay.getDay(); // 0=Sun
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewYear, viewMonth, d));
  }

  return (
    <div className="ctp-datepicker__grid">
      {DAYS.map((day) => (
        <div key={day} className="ctp-datepicker__weekday">
          {day}
        </div>
      ))}
      {cells.map((date, idx) => {
        if (!date) {
          return <div key={`empty-${idx}`} className="ctp-datepicker__cell ctp-datepicker__cell--empty" />;
        }

        const isDisabled =
          (minDate && date < minDate) || (maxDate && date > maxDate);
        const isToday = isSameDay(date, new Date());
        const isSelected =
          mode === 'single' && selectedDate && isSameDay(date, selectedDate);

        // Range highlighting
        let isRangeStart = false;
        let isRangeEnd = false;
        let isInRange = false;
        if (mode === 'range') {
          if (rangeStart && isSameDay(date, rangeStart)) isRangeStart = true;
          const effectiveEnd = rangeEnd || hoverDate;
          if (effectiveEnd && rangeStart) {
            if (isSameDay(date, effectiveEnd)) isRangeEnd = true;
            if (isBetween(date, rangeStart, effectiveEnd)) isInRange = true;
          }
        }

        const classes = [
          'ctp-datepicker__cell',
          isDisabled ? 'ctp-datepicker__cell--disabled' : '',
          isToday ? 'ctp-datepicker__cell--today' : '',
          isSelected ? `ctp-datepicker__cell--selected ctp-datepicker__cell--${color}` : '',
          isRangeStart ? `ctp-datepicker__cell--range-start ctp-datepicker__cell--${color}` : '',
          isRangeEnd ? `ctp-datepicker__cell--range-end ctp-datepicker__cell--${color}` : '',
          isInRange ? `ctp-datepicker__cell--in-range ctp-datepicker__cell--in-range-${color}` : '',
          !isDisabled && !isSelected && !isRangeStart && !isRangeEnd
            ? `ctp-datepicker__cell--hover-${color}`
            : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={date.toISOString()}
            type="button"
            className={classes}
            disabled={!!isDisabled}
            onClick={() => !isDisabled && onDayClick(date)}
            onMouseEnter={() => !isDisabled && onDayHover(date)}
            onMouseLeave={() => onDayHover(null)}
            tabIndex={isDisabled ? -1 : 0}
          >
            {date.getDate()}
          </button>
        );
      })}
    </div>
  );
};

// ──────────────────────────────────────────────
// Calendar Popover
// ──────────────────────────────────────────────

interface CalendarPopoverProps {
  floatingRef: React.RefObject<HTMLDivElement | null>;
  top: number;
  left: number;
  actualPlacement: Placement;
  viewYear: number;
  viewMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  showToday: boolean;
  onTodayClick: () => void;
  color: FormControlColor;
  children: ReactNode;
}

const CalendarPopover: React.FC<CalendarPopoverProps> = ({
  floatingRef,
  top,
  left,
  actualPlacement,
  viewYear,
  viewMonth,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
  showToday,
  onTodayClick,
  color,
  children,
}) => {
  return ReactDOM.createPortal(
    <div
      ref={floatingRef}
      className={`ctp-datepicker__popover ctp-datepicker__popover--${actualPlacement}`}
      style={{ position: 'fixed', top, left, zIndex: 1200 }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="ctp-datepicker__header">
        <button
          type="button"
          className="ctp-datepicker__nav-btn"
          onClick={onPrevYear}
          aria-label="Ano anterior"
        >
          ‹‹
        </button>
        <button
          type="button"
          className="ctp-datepicker__nav-btn"
          onClick={onPrevMonth}
          aria-label="Mês anterior"
        >
          ‹
        </button>

        <div className="ctp-datepicker__header-label">
          <span className="ctp-datepicker__month-label">{MONTHS[viewMonth]}</span>
          <span className="ctp-datepicker__year-label">{viewYear}</span>
        </div>

        <button
          type="button"
          className="ctp-datepicker__nav-btn"
          onClick={onNextMonth}
          aria-label="Próximo mês"
        >
          ›
        </button>
        <button
          type="button"
          className="ctp-datepicker__nav-btn"
          onClick={onNextYear}
          aria-label="Próximo ano"
        >
          ››
        </button>
      </div>

      {/* Grid */}
      {children}

      {/* Footer */}
      {showToday && (
        <div className="ctp-datepicker__footer">
          <button
            type="button"
            className={`ctp-datepicker__today-btn ctp-datepicker__today-btn--${color}`}
            onClick={onTodayClick}
          >
            Hoje
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};

// ──────────────────────────────────────────────
// Main DatePicker
// ──────────────────────────────────────────────

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  rangeValue,
  mode = 'single',
  onChange,
  onRangeChange,
  color = 'mauve',
  placeholder,
  minDate,
  maxDate,
  formatDate = defaultFormat,
  disabled = false,
  showToday = true,
  placement = 'bottom-start',
  className = '',
}) => {
  const today = new Date();
  const initialDate = value || (rangeValue?.start) || today;

  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // For range mode internal state when rangeValue is not fully controlled
  const [internalRangeStart, setInternalRangeStart] = useState<Date | null>(
    rangeValue?.start ?? null
  );
  const [rangeSelectingEnd, setRangeSelectingEnd] = useState(false);

  const triggerRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        floatingRef.current &&
        !floatingRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const { top, left, actualPlacement } = usePortalPosition(triggerRef, floatingRef, {
    isOpen,
    placement,
    offset: 6,
    autoFlip: true,
  });

  // Navigation
  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const goToPrevYear = () => setViewYear(y => y - 1);
  const goToNextYear = () => setViewYear(y => y + 1);

  // Day click handler
  const handleDayClick = useCallback((date: Date) => {
    if (mode === 'single') {
      onChange?.(date);
      setIsOpen(false);
    } else {
      // Range mode
      if (!rangeSelectingEnd || !internalRangeStart) {
        // First click: set start
        setInternalRangeStart(date);
        setRangeSelectingEnd(true);
        onRangeChange?.({ start: date, end: null });
      } else {
        // Second click: set end
        const start = internalRangeStart;
        const end = date;
        const normalized = start <= end
          ? { start, end }
          : { start: end, end: start };
        onRangeChange?.(normalized);
        setRangeSelectingEnd(false);
        setInternalRangeStart(null);
        setIsOpen(false);
      }
    }
  }, [mode, rangeSelectingEnd, internalRangeStart, onChange, onRangeChange]);

  // Today shortcut
  const handleTodayClick = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    if (mode === 'single') {
      onChange?.(now);
      setIsOpen(false);
    }
  };

  // Display text
  let displayValue = '';
  if (mode === 'single' && value) {
    displayValue = formatDate(value);
  } else if (mode === 'range') {
    const start = rangeValue?.start;
    const end = rangeValue?.end;
    if (start && end) displayValue = `${formatDate(start)} → ${formatDate(end)}`;
    else if (start) displayValue = `${formatDate(start)} → ...`;
  }

  const defaultPlaceholder =
    mode === 'single' ? 'Selecionar data...' : 'Selecionar intervalo...';

  return (
    <div className={`ctp-datepicker ${className}`}>
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        type="button"
        className={[
          'ctp-datepicker__trigger',
          `ctp-datepicker__trigger--${color}`,
          disabled ? 'ctp-datepicker__trigger--disabled' : '',
          isOpen ? 'ctp-datepicker__trigger--open' : '',
        ].filter(Boolean).join(' ')}
        onClick={() => !disabled && setIsOpen(o => !o)}
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg
          className="ctp-datepicker__icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className={displayValue ? 'ctp-datepicker__value' : 'ctp-datepicker__placeholder'}>
          {displayValue || (placeholder ?? defaultPlaceholder)}
        </span>
        <svg
          className={`ctp-datepicker__chevron ${isOpen ? 'ctp-datepicker__chevron--open' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <CalendarPopover
          floatingRef={floatingRef}
          top={top}
          left={left}
          actualPlacement={actualPlacement}
          viewYear={viewYear}
          viewMonth={viewMonth}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onPrevYear={goToPrevYear}
          onNextYear={goToNextYear}
          showToday={showToday}
          onTodayClick={handleTodayClick}
          color={color}
        >
          <CalendarGrid
            viewYear={viewYear}
            viewMonth={viewMonth}
            selectedDate={mode === 'single' ? value : null}
            rangeStart={mode === 'range' ? (internalRangeStart ?? rangeValue?.start ?? null) : null}
            rangeEnd={mode === 'range' ? rangeValue?.end ?? null : null}
            hoverDate={hoverDate}
            mode={mode}
            minDate={minDate}
            maxDate={maxDate}
            color={color}
            onDayClick={handleDayClick}
            onDayHover={setHoverDate}
          />
        </CalendarPopover>
      )}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';
