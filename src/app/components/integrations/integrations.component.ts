// src/app/components/integrations/integrations.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { AdminService, VisitorCountry } from '../../services/admin.service';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {
  // Tipo de gráfico GeoChart
  chartType: ChartType = ChartType.GeoChart;

  // Datos iniciales: la primera fila es el encabezado
  chartData: (string | number)[][] = [
    ['Country', 'Visits']
  ];

  // Opciones de estilo
  chartOptions = {
    colorAxis: { colors: ['#aec7e8', '#1f77b4'] }
  };

  // Tamaño del gráfico
  chartWidth = 800;
  chartHeight = 400;

  constructor(private adminSvc: AdminService) {}

  ngOnInit(): void {
    this.loadVisitorCountries();
  }

  private loadVisitorCountries(): void {
    this.adminSvc.getVisitorCountries().subscribe({
      next: (countries: VisitorCountry[]) => {
        // Reconstruir datos para el GeoChart
        this.chartData = [
          ['Country', 'Visits'],
          ...countries.map(c => [c.country, c.count])
        ];
      },
      error: err => {
        console.error('Error al cargar países de visitantes:', err);
      }
    });
  }
}
