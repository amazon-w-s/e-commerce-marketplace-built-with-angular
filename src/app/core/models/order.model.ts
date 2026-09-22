import { CartItem } from './cart-item.model';

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  placedAt: string;
  shipping: ShippingInfo;
  status: 'processing' | 'shipped' | 'delivered';
}
