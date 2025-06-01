// src/app/components/moderator-panel/moderator-panel.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ModeratorService, Report } from '../../services/moderator.service';

@Component({
  selector: 'app-moderator-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './moderator-panel.component.html',
  styleUrls: ['./moderator-panel.component.scss']
})
export class ModeratorPanelComponent implements OnInit {
  reports: Report[] = [];
  errorMsg: string | null = null;

  constructor(private modSvc: ModeratorService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.modSvc.getPendingReports().subscribe({
      next: (data) => {
        this.reports = data;
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
        this.errorMsg = 'No se pudieron cargar los reportes.';
      }
    });
  }

  // action: 'resolve' | 'deleteContent' | 'suspendUser'
  onResolve(reportId: string, action: string) {
    let days: number | undefined;
    if (action === 'suspendUser') {
      days = 7; // por defecto suspendemos 7 días; podrías pedir el número al moderador
    }
    this.modSvc.resolveReport(reportId, action, days!).subscribe({
      next: () => {
        // recargar la lista de reportes
        this.loadReports();
      },
      error: (err) => {
        console.error('Error al resolver reporte:', err);
        this.errorMsg = 'Error al procesar el reporte.';
      }
    });
  }
}
