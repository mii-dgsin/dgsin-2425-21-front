// src/app/services/moderator.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ModReport {
  _id: string;
  reporterId: string;
  title: string;
  description: string;
  type: string;
  status: 'pending' | 'investigating' | 'resolved' | 'wontfix' | 'duplicate' | 'invalid' | 'needsReview';
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ModeratorService {
  private apiUrl = `${environment.apiBase}/mod`;

  constructor(private http: HttpClient) {}

  /** ✅ Ahora trae todos los reportes, no solo los pendientes */
  getAllReports(): Observable<ModReport[]> {
    return this.http.get<ModReport[]>(`${this.apiUrl}/reports`);
  }

  /** ✅ Actualiza el estado directamente */
  updateStatus(reportId: string, newStatus: ModReport['status']): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reports/${reportId}`, {
      action: newStatus
    });
  }

  /** ✅ Borra un reporte */
  deleteReport(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reports/${id}`);
  }
}
