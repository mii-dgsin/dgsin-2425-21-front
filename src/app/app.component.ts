// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dgsin-2425-21-front';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.logVisitor();
  }

  logVisitor() {
    this.http.post(`${environment.apiBase}/visitor/log-visit`, {}).subscribe({
      next: () => {},
      error: err => console.error('Error registrando visita:', err)
    });
  }
}
