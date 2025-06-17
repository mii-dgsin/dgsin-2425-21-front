// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CommonModule }            from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dgsin-2425-21-front';

  /** Controla si mostramos header+footer */
  showLayout = true;

  private readonly fullScreenRoutes = [
    '/chart',
    '/geo-chart'
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logVisitor();

    // Cada vez que cambie la ruta, decidimos si mostramos header/footer
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.showLayout = !this.fullScreenRoutes.includes(urlAfterRedirects);
      });
  }

  private logVisitor() {
    this.http.post(`${environment.apiBase}/visitor/log-visit`, {}).subscribe({
      next: () => {},
      error: err => console.error('Error registrando visita:', err)
    });
  }
}
