import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
    title: 'Marketplace — Shop electronics, fashion, home & more',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list').then((m) => m.ProductListComponent),
    title: 'Shop All Products — Marketplace',
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail').then(
        (m) => m.ProductDetailComponent,
      ),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then((m) => m.CartComponent),
    title: 'Your Cart — Marketplace',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then((m) => m.CheckoutComponent),
    title: 'Checkout — Marketplace',
  },
  {
    path: 'checkout/confirmation/:orderId',
    loadComponent: () =>
      import('./features/checkout/order-confirmation/order-confirmation').then(
        (m) => m.OrderConfirmationComponent,
      ),
    title: 'Order Confirmed — Marketplace',
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
    title: 'Sign In — Marketplace',
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.RegisterComponent),
    title: 'Create Account — Marketplace',
  },
  {
    path: 'account/orders',
    loadComponent: () =>
      import('./features/account/orders/orders').then((m) => m.OrdersComponent),
    title: 'My Orders — Marketplace',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found').then((m) => m.NotFoundComponent),
    title: 'Page Not Found — Marketplace',
  },
];
