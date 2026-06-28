import { Component, input, computed, model, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlSize, FormControlShape, FormControlColor, getFormThemeClass } from './form-types';

@Component({
  selector: 'input[ctp-input]',
  standalone: true,
  template: '',
  host: {
    '[class]': 'hostClass()',
    '(input)': 'onInputChange($event)',
    '(blur)': 'onTouchedCallback()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true,
  }],
})
export class InputComponent implements ControlValueAccessor {
  value = model<string>('');
  size = input<FormControlSize>('md');
  shape = input<FormControlShape>('rounded');
  color = input<FormControlColor>('mauve');
  error = input<boolean>(false);

  private _onChange: (val: any) => void = () => {};
  private _onTouched: () => void = () => {};

  hostClass = computed(() => {
    return [
      'ctp-form-control',
      `ctp-form-control--${this.size()}`,
      `ctp-form-control--${this.shape()}`,
      this.error() ? 'ctp-form-control--error' : '',
      getFormThemeClass(this.color()),
    ].filter(Boolean).join(' ');
  });

  writeValue(val: any): void { this.value.set(val ?? ''); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { /* handled via native disabled */ }

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this._onChange(val);
  }

  onTouchedCallback(): void { this._onTouched(); }
}
