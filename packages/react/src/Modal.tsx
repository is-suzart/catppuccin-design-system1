import React from 'react';
import { Overlay } from './Overlay';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
}) => {
  const hasHeader = title || showCloseButton;

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEsc={closeOnEsc}
    >
      <div
        className={`ctp-modal ctp-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title && typeof title === 'string' ? 'ctp-modal-title' : undefined}
      >
        {hasHeader && (
          <div className="ctp-modal__header">
            <div className="ctp-modal__title" id="ctp-modal-title">
              {title}
            </div>
            {showCloseButton && (
              <button
                className="ctp-modal__close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="ctp-modal__body">{children}</div>
        {footer && <div className="ctp-modal__footer">{footer}</div>}
      </div>
    </Overlay>
  );
};
