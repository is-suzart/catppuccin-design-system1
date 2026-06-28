import { Component, input, computed, model, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlColor, getFormThemeClass } from './form-types';

@Component({
  selector: 'ctp-switch',
  standalone: true,
  template: `
    <label [class]="rowClass()">
      <input
        type="checkbox"
        [disabled]="disabled()"
        [checked]="checked()"
        (change)="onToggle()"
      />
      <span class="ctp-switch-track">
        <span class="ctp-switch-thumb"></span>
      </span>
      <span>{{ label() }}</span>
    </label>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true,
  }],
})
export class SwitchComponent implements ControlValueAccessor {
  checked = model<boolean>(false);
  label = input.required<string>();
  disabled = input<boolean>(false);
  color = input<FormControlColor>('mauve');

  private _onChange: (val: any) => void = () => {};
  private _onTouched: () => void = () => {};

  rowClass = computed(() => {
    return [
      'ctp-switch-row',
      this.disabled() ? 'ctp-switch-row--disabled' : '',
      getFormThemeClass(this.color()),
    ].filter(Boolean).join(' ');
  });

  writeValue(val: any): void { this.checked.set(!!val); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onToggle(): void {
    const next = !this.checked();
    this.checked.set(next);
    this._onChange(next);
    this._onTouched();
  }
}
