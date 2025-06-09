// Servicio CRUD de reportes de bugs
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BugReport {
  _id: string;
  reporterId: string;
  title: string;
  description: string;
  type: string;
  status: 'pending'|'investigating'|'resolved'|'wontfix'|'duplicate'|'invalid'|'needsReview';
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private api = `${environment.apiBase}/reports`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BugReport[]> {
    return this.http.get<BugReport[]>(this.api);
  }

  getById(id: string): Observable<BugReport> {
    return this.http.get<BugReport>(`${this.api}/${id}`);
  }

  create(report: Partial<BugReport>): Observable<any> {
    return this.http.post<any>(this.api, report);
  }

  update(id: string, data: Partial<BugReport>): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  search(q: string): Observable<{ results: BugReport[] }> {
    return this.http.get<{ results: BugReport[] }>(
      `${this.api}/search?q=${encodeURIComponent(q)}`
    );
  }
}