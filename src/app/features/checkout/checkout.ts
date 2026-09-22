import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-checkout',
  imports: [
    RouterLink,
    CurrencyPipe,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly items = this.cartService.items;
  protected readonly subtotal = this.cartService.subtotal;
  protected readonly shippingCost = computed(() => this.orderService.calculateShipping(this.subtotal()));
  protected readonly tax = computed(() => this.orderService.calculateTax(this.subtotal()));
  protected readonly total = computed(() => this.subtotal() + this.shippingCost() + this.tax());

  protected readonly shippingForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['United States', Validators.required],
  });

  protected readonly paymentForm = this.fb.nonNullable.group({
    cardName: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  placeOrder(): void {
    if (this.shippingForm.invalid || this.paymentForm.invalid || this.cartService.isEmpty()) {
      this.shippingForm.markAllAsTouched();
      this.paymentForm.markAllAsTouched();
      return;
    }
    const order = this.orderService.placeOrder(this.items(), this.shippingForm.getRawValue());
    this.cartService.clear();
    this.notification.success('Order placed successfully!');
    this.router.navigate(['/checkout/confirmation', order.id]);
  }
}
