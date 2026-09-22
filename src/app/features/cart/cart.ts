import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe, MatButtonModule, MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent {
  protected readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);

  protected readonly items = this.cartService.items;
  protected readonly subtotal = this.cartService.subtotal;
  protected readonly shippingCost = computed(() => this.orderService.calculateShipping(this.subtotal()));
  protected readonly tax = computed(() => this.orderService.calculateTax(this.subtotal()));
  protected readonly total = computed(() => this.subtotal() + this.shippingCost() + this.tax());
  protected readonly freeShippingRemaining = computed(() =>
    Math.max(0, 75 - this.subtotal()),
  );

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  remove(productId: string): void {
    this.cartService.remove(productId);
  }
}
