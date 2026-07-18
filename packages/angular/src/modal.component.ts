import { Component, input, output } from '@angular/core';
import { OverlayComponent } from './overlay.component';

type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ctp-modal',
  standalone: true,
  imports: [OverlayComponent],
  template: `
    <ctp-overlay
      [isOpen]="isOpen()"
      [closeOnOverlayClick]="closeOnOverlayClick()"
      [closeOnEsc]="closeOnEsc()"
      (close)="onCloseModal()"
    >
      <div
        class="ctp-modal" [attr.data-size]="size()"
        role="dialog"
        aria-modal="true"
      >
        @if (showCloseButton() || title() || hasCustomHeader()) {
          <div class="ctp-modal__header">
            <ng-content select="[header]">
              @if (title()) {
                <h2 class="ctp-modal__title">{{ title() }}</h2>
              }
            </ng-content>
            @if (showCloseButton()) {
              <button
                class="ctp-modal__close-btn"
                (click)="onCloseModal()"
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
            }
          </div>
        }

        <div class="ctp-modal__body">
          <ng-content></ng-content>
        </div>

        @if (hasFooter()) {
          <div class="ctp-modal__footer">
            <ng-content select="[footer]"></ng-content>
          </div>
        }
      </div>
    </ctp-overlay>
  `
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  size = input<ModalSize>('md');
  title = input<string>('');
  closeOnOverlayClick = input<boolean>(true);
  closeOnEsc = input<boolean>(true);
  showCloseButton = input<boolean>(true);
  hasFooter = input<boolean>(true);
  hasCustomHeader = input<boolean>(false);

  close = output<void>();

  onCloseModal(): void {
    this.close.emit();
  }
}
