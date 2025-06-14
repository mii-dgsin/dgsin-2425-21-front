// src/app/components/admin-panel/admin-panel.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService, User, VisitorCountry } from '../../services/admin.service';
import { GoogleChartsModule } from 'angular-google-charts';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GoogleChartsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  visitorCountries: VisitorCountry[] = [];
  errorMsg: string | null = null;

  // Configuración del GeoChart
  chartType: ChartType = ChartType.GeoChart;
  chartData: (string | number)[][] = [];
  chartOptions = {
    colorAxis: { colors: ['#aec7e8', '#1f77b4'] },
    backgroundColor: '#f8f9fa'
  };
  chartWidth = 700;
  chartHeight = 400;

  constructor(private adminSvc: AdminService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadVisitorCountries();
  }

  loadUsers() {
    this.adminSvc.getAllUsers().subscribe({
      next: data => this.users = data,
      error: () => this.errorMsg = 'Error cargando usuarios.'
    });
  }

  loadVisitorCountries() {
    this.adminSvc.getVisitorCountries().subscribe({
      next: data => {
        this.visitorCountries = data;
        this.prepareChartData();
      },
      error: () => this.errorMsg = 'Error cargando países de visitantes.'
    });
  }

  prepareChartData() {
    this.chartData = [['Country', 'Visits']];
    this.visitorCountries.forEach(vc => {
      this.chartData.push([vc.country, vc.count]);
    });
  }

  onChangeRole(userId: string, newRole: string) {
    this.adminSvc.updateUserRole(userId, newRole).subscribe({
      next: () => this.loadUsers(),
      error: () => this.errorMsg = 'Error cambiando el rol del usuario.'
    });
  }
}
