import { Component, input, computed, output } from '@angular/core';

export type BadgeVariant = 'filled' | 'tonal' | 'outline' | 'flat';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'square' | 'rounded' | 'pill';
export type BadgeColor =
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

@Component({
  selector: 'ctp-badge',
  standalone: true,
  template: `
    <span [class]="badgeClass()">
      @if (hasIcon()) {
        <span class="ctp-badge__icon" style="display: inline-flex; align-items: center">
          <ng-content select="[icon]"></ng-content>
        </span>
      }
      <span class="ctp-badge__content">
        <ng-content></ng-content>
      </span>
      @if (isDismissible()) {
        <button
          class="ctp-badge__close-btn"
          (click)="onDismiss($event)"
          aria-label="Dismiss badge"
          style="display: inline-flex; align-items: center; margin-left: 4px;"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      }
    </span>
  `
})
export class BadgeComponent {
  variant = input<BadgeVariant>('filled');
  size = input<BadgeSize>('md');
  shape = input<BadgeShape>('pill');
  color = input<BadgeColor>('mauve');
  hasIcon = input<boolean>(false);
  isDismissible = input<boolean>(false);

  dismiss = output<MouseEvent>();

  onDismiss(event: MouseEvent) {
    this.dismiss.emit(event);
  }

  badgeClass = computed(() => {
    return [
      'ctp-badge',
      `ctp-badge--${this.variant()}`,
      `ctp-badge--${this.size()}`,
      `ctp-badge--${this.shape()}`,
      `ctp-badge--${this.color()}`
    ].filter(Boolean).join(' ');
  });
}
