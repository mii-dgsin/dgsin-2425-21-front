// src/app/services/moderator.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Report {
  _id: string;
  reporterId: string;
  reportedId: string;
  type: 'post' | 'comment';
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved';
  // … otros campos que definas
}

@Injectable({ providedIn: 'root' })
export class ModeratorService {
  private apiUrl = `${environment.apiBase}/mod`;

  constructor(private http: HttpClient) {}

  // 1) Obtener lista de reportes pendientes
  getPendingReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/reports`);
  }

  // 2) Tomar acción en un reporte
  // action: 'resolve' | 'deleteContent' | 'suspendUser'
  resolveReport(reportId: string, action: string, suspendDays?: number) {
    const body: any = { action };
    if (action === 'suspendUser') {
      body.suspendDays = suspendDays;
    }
    return this.http.patch(`${this.apiUrl}/reports/${reportId}`, body);
  }
}
