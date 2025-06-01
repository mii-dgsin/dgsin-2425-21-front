// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  expiresIn: number;
  username: string;
  email: string;
  role: string;
}

export interface UserPayload {
  username: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBase}/auth`;

  // BehaviorSubjects internos
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<UserPayload | null>(null);

  // Observables públicos
  public isLoggedIn$ = this.loggedInSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  // 1) Al inicializar, intentar cargar los datos de localStorage
  private loadFromStorage(): void {
    const token = localStorage.getItem('jwt_token');
    const expires = localStorage.getItem('jwt_expires');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (token && expires && Date.now() < +expires) {
      // El token es válido en tiempo
      this.loggedInSubject.next(true);
      if (username && email && role) {
        this.userSubject.next({ username, email, role });
      } else {
        this.userSubject.next(null);
      }
    } else {
      // Token expirado o no existe → forzar logout
      this.clearStorage();
      this.loggedInSubject.next(false);
      this.userSubject.next(null);
    }
  }

  // 2) Registro de usuario
  register(username: string, email: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      { username, email, password }
    );
  }

  // 3) Login: al hacer tap guardamos datos en localStorage y actualizamos subjects
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(res => {
        // 3.a) Guardar en localStorage
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('jwt_expires', (Date.now() + res.expiresIn * 1000).toString());
        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email);
        localStorage.setItem('role', res.role);

        // 3.b) Actualizar BehaviorSubjects
        this.loggedInSubject.next(true);
        this.userSubject.next({ 
          username: res.username, 
          email: res.email, 
          role: res.role 
        });
      })
    );
  }

  // 4) Logout: limpiar storage y notificar a los observers
  logout(): void {
    this.clearStorage();
    this.loggedInSubject.next(false);
    this.userSubject.next(null);
  }

  // 5) Obtener token (si lo necesitas para interceptores)
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // 6) Obtener rol sincrónicamente (útil en guards)
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // 7) Obtener username sincrónicamente (opcional)
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  // Método privado para centralizar la limpieza de localStorage
  private clearStorage(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('jwt_expires');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }

    // Este método ya existía en tu servicio original
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt_token');
    const expires = localStorage.getItem('jwt_expires');
    return !!token && Date.now() < +expires!;
  }
}
