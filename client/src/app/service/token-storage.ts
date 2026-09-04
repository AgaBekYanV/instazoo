import {Injectable} from '@angular/core';
import {User} from '../models/User';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  constructor() {
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public grtToken(): string | null{
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const userJson = sessionStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  logOut(): void {
    window.sessionStorage.clear();
    window.location.reload();
  }
}


