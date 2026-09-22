import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService, SortOption } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [
    CurrencyPipe,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    ProductCardComponent,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly notification = inject(NotificationService);

  protected readonly categories = this.productService.categories;
  protected readonly filteredProducts = this.productService.filteredProducts;
  protected readonly filter = this.productService.filter;
  protected readonly maxPrice = this.productService.maxPossiblePrice();

  constructor() {
    this.productService.updateFilter({ maxPrice: this.maxPrice });
    this.route.queryParamMap.subscribe((params) => {
      const category = params.get('category');
      const query = params.get('q');
      this.productService.updateFilter({
        categoryIds: category ? [category] : [],
        query: query ?? '',
      });
    });
  }

  toggleCategory(categoryId: string, checked: boolean): void {
    const current = this.filter().categoryIds;
    const next = checked ? [...current, categoryId] : current.filter((id) => id !== categoryId);
    this.productService.updateFilter({ categoryIds: next });
  }

  onPriceChange(value: number): void {
    this.productService.updateFilter({ maxPrice: value });
  }

  onSortChange(sort: SortOption): void {
    this.productService.updateFilter({ sort });
  }

  onSearchChange(query: string): void {
    this.productService.updateFilter({ query });
  }

  clearFilters(): void {
    this.productService.resetFilter();
  }

  onAddToCart(product: Product): void {
    this.cartService.add(product);
    this.notification.success(`${product.name} added to cart`);
  }
}
