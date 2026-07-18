import { Component, input, computed } from '@angular/core';

type ButtonColor =
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

export interface StepItem {
  label: string;
  description?: string;
  icon?: string;
}

@Component({
  selector: 'ctp-stepper',
  standalone: true,
  template: `
    <div [class]="wrapperClass()" [style]="cssStyle()">
      <!-- Background line track -->
      <div class="ctp-stepper__track">
        <div class="ctp-stepper__track-active"></div>
      </div>

      <!-- Steps -->
      @for (step of steps(); track $index) {
        <div [class]="getStepClass($index)">
          <!-- Step node icon / dot / number -->
          <div class="ctp-stepper__node">
            @if (variant() !== 'dots') {
              @if ($index < currentStep()) {
                <!-- Completed check icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 1.1em; height: 1.1em">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              } @else if ((variant() === 'icon' || variant() === 'labeled-icon') && step.icon) {
                <span>{{ step.icon }}</span>
              } @else {
                <span>{{ $index + 1 }}</span>
              }
            }
          </div>

          <!-- Vertical track segment inside step item for vertical layout styling -->
          @if (orientation() === 'vertical' && $index < steps().length - 1) {
            <div class="ctp-stepper__track">
              <div 
                class="ctp-stepper__track-active"
                [style.height]="$index < currentStep() ? '100%' : $index === currentStep() ? '50%' : '0%'"
              ></div>
            </div>
          }

          <!-- Labels -->
          @if (!(variant() === 'dots' && orientation() === 'horizontal')) {
            <div class="ctp-stepper__label-group">
              <h4 class="ctp-stepper__title">{{ step.label }}</h4>
              @if (step.description) {
                <p class="ctp-stepper__description">{{ step.description }}</p>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class StepperComponent {
  steps = input<StepItem[]>([]);
  currentStep = input<number>(0);
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  variant = input<'default' | 'dots' | 'icon' | 'labeled-icon'>('default');
  color = input<ButtonColor>('mauve');

  segments = computed(() => Math.max(1, this.steps().length - 1));

  progressPercent = computed(() => {
    return Math.min(100, Math.max(0, (this.currentStep() / this.segments()) * 100));
  });

  wrapperClass = computed(() => {
    return [
      'ctp-stepper-wrapper',
      `ctp-stepper--${this.orientation()}`,
      `ctp-stepper--${this.variant()}`,
      `ctp-stepper--${this.color()}`,
    ].join(' ');
  });

  cssStyle = computed(() => {
    return {
      '--ds-total-steps': String(this.steps().length),
      '--ds-stepper-progress': `${this.progressPercent()}%`,
    };
  });

  getStepClass(index: number): string {
    let status = 'upcoming';
    if (index < this.currentStep()) {
      status = 'completed';
    } else if (index === this.currentStep()) {
      status = 'active';
    }
    return `ctp-stepper__step ctp-stepper__step--${status}`;
  }
}
