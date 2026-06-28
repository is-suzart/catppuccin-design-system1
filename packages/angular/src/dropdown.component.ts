import { Component, input, output, computed, inject } from '@angular/core';

export type DropdownColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

@Component({
  selector: 'ctp-dropdown',
  standalone: true,
  template: `
    <div class="ctp-dropdown-wrapper" style="position:relative;display:inline-block">
      <ng-content select="[trigger]"></ng-content>
      @if (isOpen()) {
        <div
          class="ctp-dropdown-menu"
          [style.position]="'absolute'"
          [style.zIndex]="'1050'"
          role="menu"
        >
          <ng-content></ng-content>
        </div>
      }
    </div>
  `
})
export class DropdownComponent {
  isOpen = input<boolean>(false);
  color = input<DropdownColor>('mauve');

  isOpenChange = output<boolean>();

  toggle() {
    this.isOpenChange.emit(!this.isOpen());
  }

  close() {
    this.isOpenChange.emit(false);
  }
}

@Component({
  selector: 'ctp-dropdown-item',
  standalone: true,
  template: `
    <button
      type="button"
      [class]="itemClass()"
      [disabled]="disabled()"
      role="menuitem"
      (click)="handleClick()"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class DropdownItemComponent {
  disabled = input<boolean>(false);
  danger = input<boolean>(false);
  color = input<DropdownColor>('mauve');

  parent = inject(DropdownComponent, { optional: true });

  protected itemClass = computed(() => {
    return [
      'ctp-dropdown-item',
      this.danger() ? 'ctp-dropdown-item--danger' : `ctp-dropdown-item--${this.color()}`,
      this.disabled() ? 'ctp-dropdown-item--disabled' : '',
    ].filter(Boolean).join(' ');
  });

  handleClick() {
    if (this.disabled()) return;
    if (this.parent) this.parent.close();
  }
}

@Component({
  selector: 'ctp-dropdown-divider',
  standalone: true,
  template: '<div class="ctp-dropdown-divider" role="separator"></div>'
})
export class DropdownDividerComponent {}

@Component({
  selector: 'ctp-dropdown-header',
  standalone: true,
  template: '<div class="ctp-dropdown-header"><ng-content></ng-content></div>'
})
export class DropdownHeaderComponent {}
