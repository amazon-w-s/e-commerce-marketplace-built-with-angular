import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Order, ShippingInfo } from '../models/order.model';

const ORDERS_KEY = 'marketplace.orders';

function loadOrders(): Order[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 75;
const FLAT_SHIPPING_COST = 6.99;

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(loadOrders());
  readonly orders = this._orders.asReadonly();

  calculateShipping(subtotal: number): number {
    return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_COST;
  }

  calculateTax(subtotal: number): number {
    return Math.round(subtotal * TAX_RATE * 100) / 100;
  }

  placeOrder(items: CartItem[], shipping: ShippingInfo): Order {
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shippingCost = this.calculateShipping(subtotal);
    const tax = this.calculateTax(subtotal);
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items,
      subtotal,
      shippingCost,
      tax,
      total: Math.round((subtotal + shippingCost + tax) * 100) / 100,
      placedAt: new Date().toISOString(),
      shipping,
      status: 'processing',
    };
    this._orders.update((orders) => {
      const updated = [order, ...orders];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });
    return order;
  }

  getById(id: string): Order | undefined {
    return this._orders().find((o) => o.id === id);
  }
}
