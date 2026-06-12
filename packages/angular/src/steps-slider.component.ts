import { Component, input, ContentChildren, QueryList, ElementRef, AfterContentInit, effect, Renderer2 } from '@angular/core';

@Component({
  selector: 'ctp-steps-slider',
  standalone: true,
  template: `
    <div class="ctp-steps-content-wrapper">
      <div
        class="ctp-steps-content-stage"
        [style.transform]="'translateX(-' + (currentStep() * 100) + '%)'"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class StepsSliderComponent implements AfterContentInit {
  currentStep = input<number>(0);

  @ContentChildren('*', { read: ElementRef }) children!: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {
    effect(() => {
      this.updateChildrenClasses();
    });
  }

  ngAfterContentInit(): void {
    this.updateChildrenClasses();
    this.children.changes.subscribe(() => {
      this.updateChildrenClasses();
    });
  }

  private updateChildrenClasses(): void {
    if (!this.children) return;

    this.children.forEach((child, index) => {
      const el = child.nativeElement;
      this.renderer.addClass(el, 'ctp-steps-content-slide');

      if (index === this.currentStep()) {
        this.renderer.addClass(el, 'ctp-steps-content-slide--active');
      } else {
        this.renderer.removeClass(el, 'ctp-steps-content-slide--active');
      }
    });
  }
}
