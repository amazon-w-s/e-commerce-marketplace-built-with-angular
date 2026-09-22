import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <span class="star-rating" [attr.aria-label]="rating() + ' out of 5 stars'">
      @for (i of stars(); track i) {
        <span class="material-symbols-outlined star" [class.filled]="i <= Math.round(rating())">
          star
        </span>
      }
      @if (showValue()) {
        <span class="rating-value">{{ rating().toFixed(1) }}</span>
      }
      @if (reviewCount() !== undefined) {
        <span class="review-count">({{ reviewCount() }})</span>
      }
    </span>
  `,
  styles: `
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    .star {
      font-size: 16px;
      color: var(--mat-sys-outline-variant);
      &.filled {
        color: #f5a623;
        font-variation-settings: 'FILL' 1;
      }
    }
    .rating-value {
      margin-left: 4px;
      font-weight: 600;
      font-size: 13px;
    }
    .review-count {
      margin-left: 2px;
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class StarRatingComponent {
  readonly rating = input(0);
  readonly reviewCount = input<number>();
  readonly showValue = input(false);
  protected readonly Math = Math;
  protected readonly stars = computed(() => [1, 2, 3, 4, 5]);
}
