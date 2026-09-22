import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormsModule, MatButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  private readonly notification = inject(NotificationService);
  protected readonly year = new Date().getFullYear();
  protected readonly email = signal('');

  subscribe(): void {
    if (!this.email().trim()) return;
    this.notification.success('Thanks for subscribing to our newsletter!');
    this.email.set('');
  }
}
