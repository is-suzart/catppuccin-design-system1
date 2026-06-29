import { Component, input } from '@angular/core';

type SkeletonVariant = 'text' | 'circle' | 'rect';
type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ctp-skeleton',
  standalone: true,
  template: `
    @if (count() > 1) {
      <div class="ctp-skeleton-group" [style.gap]="gap()">
        @for (item of items; track item) {
          <div [class]="classes" [style]="customStyle"></div>
        }
      </div>
    } @else {
      <div [class]="classes" [style]="customStyle"></div>
    }
    <ng-content />
  `,
  styles: [`
    .ctp-skeleton-group {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('text');
  size = input<SkeletonSize>('md');
  width = input<string>('');
  height = input<string>('');
  animated = input<boolean>(true);
  count = input<number>(1);
  gap = input<string>('8px');

  get items(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }

  get classes(): string {
    const c = [
      'ctp-skeleton',
      `ctp-skeleton--${this.variant()}`,
      `ctp-skeleton--${this.size()}`,
      !this.animated() ? 'ctp-skeleton--no-animation' : '',
      this.width() ? '' : 'ctp-skeleton--full',
    ];
    return c.filter(Boolean).join(' ');
  }

  get customStyle(): Record<string, string> {
    const style: Record<string, string> = {};
    if (this.width()) style['width'] = this.width();
    if (this.height()) style['height'] = this.height();
    return style;
  }
}
