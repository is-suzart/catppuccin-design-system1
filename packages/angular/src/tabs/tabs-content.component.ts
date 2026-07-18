import { Component, input, computed, inject } from '@angular/core';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'ctp-tabs-content',
  standalone: true,
  template: `
    <div
      role="tabpanel"
      [id]="'ctp-tabpanel-' + value()"
      [attr.aria-labelledby]="'ctp-tabtrigger-' + value()"
      tabindex="0"
      class="ctp-tabs-content"
      [attr.data-state]="isActive() ? 'active' : null"
      [style.display]="isActive() ? '' : 'none'"
    >
      @if (isActive()) {
        <ng-content></ng-content>
      }
    </div>
  `
})
export class TabsContentComponent {
  value = input.required<string>();

  parent = inject(TabsComponent);

  isActive = computed(() => this.parent.isSelected(this.value()));
}
