import { Component, input, computed } from '@angular/core';

export type ShellLayout = 'header-first' | 'sidebar-first' | 'simple' | 'custom';

@Component({
  selector: 'ctp-shell',
  standalone: true,
  template: '<div [class]="shellClass()"><ng-content></ng-content></div>'
})
export class ShellComponent {
  layout = input<ShellLayout>('header-first');
  fullScreen = input<boolean>(true);

  protected shellClass = computed(() => {
    return [
      'ctp-shell',
      `ctp-shell--${this.layout()}`,
      this.fullScreen() ? 'ctp-shell--full-screen' : '',
    ].filter(Boolean).join(' ');
  });
}

@Component({
  selector: 'ctp-shell-header',
  standalone: true,
  template: '<div class="ctp-shell-header"><ng-content></ng-content></div>'
})
export class ShellHeaderComponent {}

@Component({
  selector: 'ctp-shell-sidebar',
  standalone: true,
  template: '<div class="ctp-shell-sidebar"><ng-content></ng-content></div>'
})
export class ShellSidebarComponent {}

@Component({
  selector: 'ctp-shell-main',
  standalone: true,
  template: '<div class="ctp-shell-main"><ng-content></ng-content></div>'
})
export class ShellMainComponent {}

@Component({
  selector: 'ctp-shell-content',
  standalone: true,
  template: '<div [class]="contentClass()"><ng-content></ng-content></div>'
})
export class ShellContentComponent {
  scrollable = input<boolean>(false);

  protected contentClass = computed(() => {
    return [
      'ctp-shell-content',
      ,
    ].filter(Boolean).join(' ');
  });
}
