import { Component, input, computed } from '@angular/core';

export type GridGap = 0 | 1 | 2 | 3 | 4 | 5;
export type GridAlign = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type GridValign = 'start' | 'center' | 'end';
export type GridColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridOffset = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

@Component({
  selector: 'ctp-grid',
  standalone: true,
  template: '<div [class]="gridClass()"><ng-content></ng-content></div>'
})
export class GridComponent {
  mobile = input<boolean>(false);
  multiline = input<boolean>(true);
  gap = input<GridGap>(3);
  align = input<GridAlign | undefined>(undefined);
  valign = input<GridValign | undefined>(undefined);

  protected gridClass = computed(() => {
    return [
      'ctp-grid',
      this.mobile() ? 'ctp-grid-mobile' : '',
      this.multiline() ? 'ctp-grid-multiline' : '',
      `ctp-grid-gap-${this.gap()}`,
      this.align() ? `ctp-grid-align-${this.align()}` : '',
      this.valign() ? `ctp-grid-valign-${this.valign()}` : '',
    ].filter(Boolean).join(' ');
  });
}

@Component({
  selector: 'ctp-grid-col',
  standalone: true,
  template: '<div [class]="colClass()"><ng-content></ng-content></div>'
})
export class GridColComponent {
  span = input<GridColSpan>(12);
  offset = input<GridOffset | undefined>(undefined);

  protected colClass = computed(() => {
    return [
      'ctp-grid-col',
      `ctp-grid-col-${this.span()}`,
      this.offset() ? `ctp-grid-col-offset-${this.offset()}` : '',
    ].filter(Boolean).join(' ');
  });
}
