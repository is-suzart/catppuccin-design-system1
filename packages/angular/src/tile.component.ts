import { Component, input, computed } from '@angular/core';

export type TileVariant = 'flat' | 'elevated' | 'outline' | 'tonal' | 'colored';
export type TileSize = 'sm' | 'md' | 'lg';
export type TileShape = 'square' | 'rounded' | 'pill';
export type TileOrientation = 'horizontal' | 'vertical' | 'vertical-center';
export type TileIndicator = 'none' | 'top' | 'bottom' | 'left' | 'right';
export type TileColor =
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
  selector: 'ctp-tile',
  standalone: true,
  template: `
    <div [class]="tileClass()">
      <ng-content>
        @if (hasIcon()) {
          <div class="ctp-tile-icon">
            <ng-content select="[icon]"></ng-content>
          </div>
        }
        @if (title() || subtitle() || hasContent()) {
          <div class="ctp-tile-content">
            @if (title()) {
              <span class="ctp-tile-title">{{ title() }}</span>
            }
            @if (subtitle()) {
              <span class="ctp-tile-subtitle">{{ subtitle() }}</span>
            }
            <ng-content select="[content]"></ng-content>
          </div>
        }
        @if (hasMeta()) {
          <div class="ctp-tile-meta">
            <ng-content select="[meta]"></ng-content>
          </div>
        }
      </ng-content>
    </div>
  `
})
export class TileComponent {
  variant = input<TileVariant>('flat');
  size = input<TileSize>('md');
  shape = input<TileShape>('rounded');
  orientation = input<TileOrientation>('horizontal');
  color = input<TileColor>('mauve');
  indicator = input<TileIndicator>('none');
  isInteractive = input<boolean>(false);
  isSelected = input<boolean>(false);
  isDisabled = input<boolean>(false);

  title = input<string | undefined>(undefined);
  subtitle = input<string | undefined>(undefined);

  hasIcon = input<boolean>(false);
  hasContent = input<boolean>(false);
  hasMeta = input<boolean>(false);

  tileClass = computed(() => {
    return [
      'ctp-tile',
      `ctp-tile--${this.variant()}`,
      `ctp-tile--${this.size()}`,
      `ctp-tile--${this.shape()}`,
      `ctp-tile--${this.orientation()}`,
      this.color() ? `ctp-tile--${this.color()}` : '',
      this.indicator() !== 'none' ? `ctp-tile--indicator-${this.indicator()}` : '',
      this.isInteractive() ? 'ctp-tile--interactive' : '',
      this.isSelected() ? 'ctp-tile--selected' : '',
      this.isDisabled() ? 'ctp-tile--disabled' : ''
    ].filter(Boolean).join(' ');
  });
}
