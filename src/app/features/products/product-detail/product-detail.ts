import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [
    RouterLink,
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    StarRatingComponent,
    ProductCardComponent,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailComponent {
  readonly id = input.required<string>();

  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly quantity = signal(1);
  protected readonly activeImage = signal(0);

  protected readonly product = computed(() => this.productService.getById(this.id()));
  protected readonly category = computed(() => {
    const p = this.product();
    return p ? this.productService.getCategoryById(p.categoryId) : undefined;
  });
  protected readonly relatedProducts = computed(() => {
    const p = this.product();
    return p ? this.productService.getRelatedProducts(p) : [];
  });
  protected readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p?.originalPrice) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });

  incrementQuantity(): void {
    const stock = this.product()?.stock ?? 1;
    this.quantity.update((q) => Math.min(q + 1, stock));
  }

  decrementQuantity(): void {
    this.quantity.update((q) => Math.max(q - 1, 1));
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;
    this.cartService.add(product, this.quantity());
    this.notification.success(`${product.name} added to cart`);
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  onRelatedAddToCart(product: Product): void {
    this.cartService.add(product);
    this.notification.success(`${product.name} added to cart`);
  }
}
