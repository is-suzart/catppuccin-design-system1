import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'ctp-sidebar',
  standalone: true,
  template: '<aside [class]="sidebarClass()"><ng-content></ng-content></aside>'
})
export class SidebarComponent {
  collapsed = input<boolean>(false);
  collapsible = input<boolean>(false);

  protected sidebarClass = computed(() => {
    return [
      'ctp-sidebar',
      this.collapsed() ? 'ctp-sidebar--collapsed' : '',
      this.collapsible() ? 'ctp-sidebar--collapsible' : '',
    ].filter(Boolean).join(' ');
  });
}

@Component({
  selector: 'ctp-sidebar-header',
  standalone: true,
  template: '<div class="ctp-sidebar__header"><ng-content></ng-content></div>'
})
export class SidebarHeaderComponent {}

@Component({
  selector: 'ctp-sidebar-section',
  standalone: true,
  template: '<div class="ctp-sidebar__section"><ng-content></ng-content></div>'
})
export class SidebarSectionComponent {}

@Component({
  selector: 'ctp-sidebar-item',
  standalone: true,
  template: `
    <a class="ctp-sidebar__item" [class.ctp-sidebar__item--active]="active()">
      @if (icon()) {
        <span class="ctp-sidebar__item-icon">{{ icon() }}</span>
      }
      <span class="ctp-sidebar__item-label"><ng-content></ng-content></span>
    </a>
  `
})
export class SidebarItemComponent {
  active = input<boolean>(false);
  icon = input<string>('');
}
