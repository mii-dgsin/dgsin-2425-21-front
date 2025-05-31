// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  expiresIn: number;
  username: string;
  email: string;
  role: string;   // <--- el backend ahora devuelve el role
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBase}/auth`;

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, {
      username, email, password
    });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('jwt_expires', (Date.now() + res.expiresIn * 1000).toString());
        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email);
        localStorage.setItem('role', res.role);  // <--- guardamos el rol
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('jwt_expires');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt_token');
    const expires = localStorage.getItem('jwt_expires');
    return !!token && Date.now() < +expires!;
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Nuevo: obtener el rol del usuario
  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
