import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  group?: string;
  onSelect?: () => void;
}

export interface CommandProps {
  items: CommandItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export const Command: React.FC<CommandProps> = ({
  items,
  open: controlledOpen,
  onOpenChange,
  placeholder = 'Search commands...',
  emptyMessage = 'No results found.',
  className = '',
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback((open: boolean) => {
    if (!isControlled) setUncontrolledOpen(open);
    onOpenChange?.(open);
    if (open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = items.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    const group = item.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatFiltered[selectedIndex]) {
      flatFiltered[selectedIndex].onSelect?.();
      setOpen(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`ctp-command-overlay ${className}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="ctp-command">
        <div className="ctp-command__input-wrapper">
          <svg className="ctp-command__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="ctp-command__input"
            placeholder={placeholder}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-activedescendant={flatFiltered[selectedIndex] ? `ctp-cmd-item-${flatFiltered[selectedIndex].id}` : undefined}
            aria-controls="ctp-command-list"
            aria-autocomplete="list"
          />
        </div>
        <div ref={listRef} className="ctp-command__list" id="ctp-command-list" role="listbox">
          {flatFiltered.length === 0 ? (
            <div className="ctp-command__empty">{emptyMessage}</div>
          ) : (
            Object.entries(grouped).map(([group, groupItems]) => (
              <div key={group}>
                <div className="ctp-command__group-label">{group}</div>
                {groupItems.map((item, i) => {
                  const flatIndex = flatFiltered.indexOf(item);
                  return (
                    <div
                      key={item.id}
                      id={`ctp-cmd-item-${item.id}`}
                      role="option"
                      aria-selected={flatIndex === selectedIndex}
                      className={`ctp-command__item${flatIndex === selectedIndex ? ' ctp-command__item--selected' : ''}`}
                      onClick={() => { item.onSelect?.(); setOpen(false); }}
                      onMouseEnter={() => setSelectedIndex(flatIndex)}
                    >
                      {item.icon && <span className="ctp-command__item-icon">{item.icon}</span>}
                      <span className="ctp-command__item-label">{item.label}</span>
                      {item.shortcut && <span className="ctp-command__item-shortcut">{item.shortcut}</span>}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

Command.displayName = 'Command';
