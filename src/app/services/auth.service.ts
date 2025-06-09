// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  expiresIn: number;
  userId: string;
  username: string;
  email: string;
  role: string;
}

export interface UserPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBase}/auth`;

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<UserPayload | null>(null);

  public isLoggedIn$ = this.loggedInSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('jwt_token');
    const expires = localStorage.getItem('jwt_expires');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (token && expires && Date.now() < +expires) {
      this.loggedInSubject.next(true);
      if (username && email && role && userId) {
        this.userSubject.next({ username, email, role, userId });
      } else {
        this.userSubject.next(null);
      }
    } else {
      this.clearStorage();
      this.loggedInSubject.next(false);
      this.userSubject.next(null);
    }
  }

  register(username: string, email: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      { username, email, password }
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('jwt_expires', (Date.now() + res.expiresIn * 1000).toString());
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email);
        localStorage.setItem('role', res.role);

        this.loggedInSubject.next(true);
        this.userSubject.next({
          userId: res.userId,
          username: res.username,
          email: res.email,
          role: res.role
        });
      })
    );
  }

  logout(): void {
    this.clearStorage();
    this.loggedInSubject.next(false);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  public get userValue(): UserPayload | null {
    return this.userSubject.getValue();
  }

  private clearStorage(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('jwt_expires');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt_token');
    const expires = localStorage.getItem('jwt_expires');
    return !!token && Date.now() < +expires!;
  }
}
