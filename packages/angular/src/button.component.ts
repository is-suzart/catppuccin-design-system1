import {
  Component,
  input,
  computed,
  Optional,
  HostListener,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ButtonGroupComponent } from './button-group.component';

type ButtonVariant = 'filled' | 'tonal' | 'outline' | 'ghost';
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
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonShape = 'square' | 'rounded' | 'pill';

@Component({
  selector: 'ctp-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClass()"
      [disabled]="disabled() || isGroupDisabled() || isLoading()"
      [attr.role]="isGroupSingle() ? 'radio' : null"
      [attr.aria-checked]="isGroupSingle() ? isActive() : null"
      [attr.tabindex]="isGroupSingle() ? (isActive() ? 0 : -1) : 0"
    >
      <span class="ctp-btn__content">
        @if (isLoading()) {
          <span class="ctp-btn__spinner" aria-hidden="true"></span>
        }
        <span class="ctp-btn__icon-left" style="display: inline-flex; align-items: center">
          <ng-content select="[leftIcon]"></ng-content>
        </span>
        <ng-content></ng-content>
        <span class="ctp-btn__icon-right" style="display: inline-flex; align-items: center">
          <ng-content select="[rightIcon]"></ng-content>
        </span>
      </span>
    </button>
  `
})
export class ButtonComponent implements AfterViewInit, OnDestroy, OnChanges {
  variant = input<ButtonVariant>('filled');
  color = input<ButtonColor>('mauve');
  size = input<ButtonSize>('md');
  shape = input<ButtonShape>('rounded');
  isLoading = input<boolean>(false);
  disabled = input<boolean>(false);
  value = input<any>(null);

  constructor(
    @Optional() public buttonGroup: ButtonGroupComponent,
    private el: ElementRef
  ) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.buttonGroup && this.value() !== null) {
      this.buttonGroup.selectButton(this.value());
    }
  }

  isGroupSingle = computed(() => {
    return this.buttonGroup ? this.buttonGroup.selectionMode() === 'single' : false;
  });

  isGroupDisabled = computed(() => {
    return this.buttonGroup ? this.buttonGroup.disabled() : false;
  });

  isActive = computed(() => {
    if (this.buttonGroup && this.value() !== null) {
      return this.buttonGroup.isButtonActive(this.value());
    }
    return false;
  });

  buttonClass = computed(() => {
    return [
      'ctp-btn',
      `ctp-btn--${this.variant()}`,
      `ctp-btn--${this.color()}`,
      `ctp-btn--${this.size()}`,
      `ctp-btn--${this.shape()}`,
      this.isLoading() ? 'ctp-btn--loading' : '',
      this.isActive() ? 'ctp-btn--active' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  ngAfterViewInit() {
    if (this.buttonGroup && this.value() !== null) {
      this.buttonGroup.registerButton(this.value(), this.el.nativeElement.querySelector('button'));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.buttonGroup) {
      const prev = changes['value'].previousValue;
      const curr = changes['value'].currentValue;
      if (prev !== null && prev !== undefined) {
        this.buttonGroup.unregisterButton(prev);
      }
      if (curr !== null && curr !== undefined) {
        this.buttonGroup.registerButton(curr, this.el.nativeElement.querySelector('button'));
      }
    }
  }

  ngOnDestroy() {
    if (this.buttonGroup && this.value() !== null) {
      this.buttonGroup.unregisterButton(this.value());
    }
  }
}
