import { Component, input, computed } from '@angular/core';

type ProgressBarSize = 'sm' | 'md' | 'lg';
type ProgressBarColor =
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
  selector: 'ctp-progressbar',
  standalone: true,
  template: `
    <div
      [class]="wrapperClass()"
      role="progressbar"
      [attr.aria-valuenow]="indeterminate() ? null : normalizedValue()"
      [attr.aria-valuemin]="indeterminate() ? null : 0"
      [attr.aria-valuemax]="indeterminate() ? null : max()"
      [attr.aria-label]="label() || null"
    >
      <!-- Label group outside -->
      @if (label() || (showValue() && valuePosition() === 'outside')) {
        <div class="ctp-progressbar-label-group">
          @if (label()) {
            <span class="ctp-progressbar-label">{{ label() }}</span>
          }
          @if (showValue() && valuePosition() === 'outside' && !indeterminate()) {
            <span class="ctp-progressbar-value-text">
              {{ progressPercent() }}%
            </span>
          }
        </div>
      }

      <!-- Track & Fill -->
      <div class="ctp-progressbar-track">
        <div
          class="ctp-progressbar-fill"
          [style.width.%]="indeterminate() ? null : percent()"
        >
          <!-- Value inside -->
          @if (showValue() && valuePosition() === 'inside' && size() === 'lg' && !indeterminate()) {
            <span class="ctp-progressbar-value-inside">
              {{ progressPercent() }}%
            </span>
          }
        </div>
      </div>
    </div>
  `
})
export class ProgressBarComponent {
  value = input<number>(0);
  max = input<number>(100);
  size = input<ProgressBarSize>('md');
  color = input<ProgressBarColor>('mauve');
  striped = input<boolean>(false);
  animated = input<boolean>(false);
  indeterminate = input<boolean>(false);
  showValue = input<boolean>(false);
  valuePosition = input<'inside' | 'outside'>('outside');
  label = input<string | undefined>(undefined);

  normalizedValue = computed(() => {
    if (this.indeterminate()) return 0;
    return Math.min(this.max(), Math.max(0, this.value()));
  });

  percent = computed(() => {
    if (this.max() <= 0) return 0;
    return (this.normalizedValue() / this.max()) * 100;
  });

  progressPercent = computed(() => {
    return Math.round(this.percent());
  });

  wrapperClass = computed(() => {
    return [
      'ctp-progressbar',
      `ctp-progressbar--${this.size()}`,
      `ctp-progressbar--${this.color()}`,
      this.striped() ? 'ctp-progressbar--striped' : '',
      this.animated() ? 'ctp-progressbar--animated' : '',
      this.indeterminate() ? 'ctp-progressbar--indeterminate' : ''
    ]
      .filter(Boolean)
      .join(' ');
  });
}
