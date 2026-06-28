import { Component, input, computed, inject } from '@angular/core';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'ctp-tabs-trigger',
  standalone: true,
  template: `
    <button
      type="button"
      role="tab"
      [attr.aria-selected]="isSelected()"
      [attr.aria-controls]="'ctp-tabpanel-' + value()"
      [id]="'ctp-tabtrigger-' + value()"
      [attr.data-value]="value()"
      [attr.tabindex]="isSelected() ? 0 : -1"
      [disabled]="disabled()"
      [class]="triggerClass()"
      (click)="handleClick()"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class TabsTriggerComponent {
  value = input.required<string>();
  disabled = input<boolean>(false);
  routerLink = input<string>('');

  parent = inject(TabsComponent);

  isSelected = computed(() => this.parent.isSelected(this.value()));

  triggerClass = computed(() => {
    return [
      'ctp-tabs-trigger',
      `ctp-tabs-trigger--${this.parent.variant()}`,
      `ctp-tabs-trigger--${this.parent.size()}`,
      this.isSelected() ? 'ctp-tabs-trigger--active' : '',
    ].filter(Boolean).join(' ');
  });

  handleClick() {
    if (this.disabled()) return;
    this.parent.selectTab(this.value());
  }
}
