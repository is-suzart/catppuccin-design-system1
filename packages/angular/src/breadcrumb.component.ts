import { Component, input } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

@Component({
  selector: 'ctp-breadcrumb',
  standalone: true,
  template: `
    <nav class="ctp-breadcrumb" aria-label="Breadcrumb">
      @for (item of items(); track $index) {
        @if (!$first) {
          <span class="ctp-breadcrumb__separator" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        }
        @if (item.href && !$last) {
          <a [href]="item.href" class="ctp-breadcrumb__item">{{ item.label }}</a>
        } @else {
          <span
            class="ctp-breadcrumb__item{{ $last ? ' ctp-breadcrumb__item--active' : '' }}"
            [attr.aria-current]="$last ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        }
      }
    </nav>
  `
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}
