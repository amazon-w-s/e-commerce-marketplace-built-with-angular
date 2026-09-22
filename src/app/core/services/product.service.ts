import { Injectable, computed, signal } from '@angular/core';
import { PRODUCTS } from '../data/products.data';
import { CATEGORIES } from '../data/categories.data';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface ProductFilter {
  query: string;
  categoryIds: string[];
  maxPrice: number;
  minRating: number;
  sort: SortOption;
}

const DEFAULT_FILTER: ProductFilter = {
  query: '',
  categoryIds: [],
  maxPrice: 500,
  minRating: 0,
  sort: 'relevance',
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>(PRODUCTS);
  private readonly _categories = signal<Category[]>(CATEGORIES);
  readonly filter = signal<ProductFilter>({ ...DEFAULT_FILTER });

  readonly products = this._products.asReadonly();
  readonly categories = this._categories.asReadonly();

  readonly maxPossiblePrice = computed(() =>
    Math.ceil(Math.max(...this._products().map((p) => p.price))),
  );

  readonly featuredProducts = computed(() => this._products().filter((p) => p.isFeatured));

  readonly filteredProducts = computed(() => {
    const { query, categoryIds, maxPrice, minRating, sort } = this.filter();
    const q = query.trim().toLowerCase();

    let results = this._products().filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = categoryIds.length === 0 || categoryIds.includes(p.categoryId);
      const matchesPrice = p.price <= maxPrice;
      const matchesRating = p.rating >= minRating;
      return matchesQuery && matchesCategory && matchesPrice && matchesRating;
    });

    switch (sort) {
      case 'price-asc':
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results = [...results].sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
    }

    return results;
  });

  getById(id: string): Product | undefined {
    return this._products().find((p) => p.id === id);
  }

  getCategoryById(id: string): Category | undefined {
    return this._categories().find((c) => c.id === id);
  }

  getRelatedProducts(product: Product, limit = 4): Product[] {
    return this._products()
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, limit);
  }

  updateFilter(partial: Partial<ProductFilter>): void {
    this.filter.update((current) => ({ ...current, ...partial }));
  }

  resetFilter(): void {
    this.filter.set({ ...DEFAULT_FILTER, maxPrice: this.maxPossiblePrice() });
  }
}
