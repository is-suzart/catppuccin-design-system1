import { Component, input, computed, output } from '@angular/core';

export type TableSize = 'sm' | 'md' | 'lg';
export type TableColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

export interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'ctp-table',
  standalone: true,
  template: `
    <div [class]="containerClass()">
      <table class="ctp-table">
        <thead>
          <tr class="ctp-table__header-row">
            @for (col of columns(); track col.key) {
              <th
                class="ctp-table__header-cell"
                [class.ctp-table__header-cell--sortable]="col.sortable"
                [style.textAlign]="col.align || 'left'"
                (click)="col.sortable && toggleSort(col.key)"
              >
                {{ col.header }}
                @if (col.sortable) {
                  <span class="ctp-table__sort-icon">
                    @if (sortField() === col.key) {
                      {{ sortOrder() === 'asc' ? '\\25B2' : '\\25BC' }}
                    } @else {
                      \\25B4\\25BE
                    }
                  </span>
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of sortedData(); track rowKey(row); let i = $index) {
            <tr class="ctp-table__row">
              @for (col of columns(); track col.key) {
                <td
                  class="ctp-table__cell"
                  [style.textAlign]="col.align || 'left'"
                >
                  {{ row[col.key] }}
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
      @if (data().length === 0) {
        <div class="ctp-table__empty">{{ emptyState() }}</div>
      }
    </div>
  `
})
export class TableComponent {
  data = input<any[]>([]);
  columns = input<Column[]>([]);
  rowKey = input<(row: any) => string | number>((row: any) => row.id);
  size = input<TableSize>('md');
  color = input<TableColor>('mauve');
  emptyState = input<string>('No records found.');
  sortField = input<string>('');
  sortOrder = input<'asc' | 'desc' | ''>('');

  sortFieldChange = output<string>();
  sortOrderChange = output<'asc' | 'desc' | ''>();

  protected containerClass = computed(() => {
    return [
      'ctp-table-container',
      `ctp-table--${this.size()}`,
      `ctp-table--${this.color()}`,
    ].filter(Boolean).join(' ');
  });

  protected sortedData = computed(() => {
    const rows = [...this.data()];
    const field = this.sortField();
    const order = this.sortOrder();

    if (field && order) {
      rows.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return rows;
  });

  toggleSort(field: string) {
    if (this.sortField() === field) {
      const nextOrder = this.sortOrder() === 'asc' ? 'desc' : this.sortOrder() === 'desc' ? '' : 'asc';
      this.sortOrderChange.emit(nextOrder);
    } else {
      this.sortFieldChange.emit(field);
      this.sortOrderChange.emit('asc');
    }
  }
}
