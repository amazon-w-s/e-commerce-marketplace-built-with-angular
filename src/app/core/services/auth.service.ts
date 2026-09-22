import { Injectable, signal } from '@angular/core';
import { StoredUser, User } from '../models/user.model';

const USERS_KEY = 'marketplace.users';
const SESSION_KEY = 'marketplace.session';

function loadUsers(): StoredUser[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function loadSession(): User | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(loadSession());
  readonly currentUser = this._currentUser.asReadonly();

  register(name: string, email: string, password: string): { success: boolean; message?: string } {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: StoredUser = { id: crypto.randomUUID(), name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    this.setSession({ id: newUser.id, name: newUser.name, email: newUser.email });
    return { success: true };
  }

  login(email: string, password: string): { success: boolean; message?: string } {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }
    this.setSession({ id: found.id, name: found.name, email: found.email });
    return { success: true };
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this._currentUser.set(null);
  }

  private setSession(user: User): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }
}
