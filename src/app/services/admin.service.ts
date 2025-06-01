// src/app/services/admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
  suspendedUntil?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiBase}/admin`;

  constructor(private http: HttpClient) {}

  // Esto disparará GET /api/v1/admin/users con el interceptor
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUserRole(userId: string, newRole: string) {
    return this.http.patch(`${this.apiUrl}/users/${userId}/role`, { role: newRole });
  }
}
