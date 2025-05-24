// src/app/services/trello-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TrelloStats {
  list: string;
  cards: number;
}

export interface TrelloResponse {
  stats: TrelloStats[];
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class TrelloDataService {
  private apiUrl = `${environment.apiBase}/trello-stats`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<TrelloResponse> {
    return this.http.get<TrelloResponse>(this.apiUrl);
  }
}
