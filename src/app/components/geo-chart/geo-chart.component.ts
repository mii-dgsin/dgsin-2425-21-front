// src/app/components/geo-chart/geo-chart.component.ts
import { Component, OnInit }       from '@angular/core';
import { CommonModule }             from '@angular/common';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { AdminService, VisitorCountry }   from '../../services/admin.service';

@Component({
  selector: 'app-geo-chart',
  standalone: true,
  imports: [ CommonModule, GoogleChartsModule ],
  templateUrl: './geo-chart.component.html',
  styleUrls: ['./geo-chart.component.scss']
})
export class GeoChartComponent implements OnInit {
  // En lugar de 'string', usamos el enum ChartType
  chartType: ChartType = ChartType.GeoChart;

  // Inicializamos la cabecera de datos según Google Charts
  chartData: (string|number)[][] = [['Country', 'Visits']];

  chartOptions = { colorAxis: { colors: ['#aec7e8', '#1f77b4'] } };
  chartWidth = 800;
  chartHeight = 400;

  constructor(private adminSvc: AdminService) {}

  ngOnInit() {
    this.adminSvc.getVisitorCountries().subscribe((data: VisitorCountry[]) => {
      this.chartData = [
        ['Country', 'Visits'],
        ...data.map(c => [c.country, c.count])
      ];
    });
  }
}
