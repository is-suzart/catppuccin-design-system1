import { Component, input } from '@angular/core';

@Component({
  selector: 'ctp-drag-drop-provider',
  standalone: true,
  template: `<ng-content />`
})
export class DragDropProviderComponent {
  apiKey = input<string>('');
}
