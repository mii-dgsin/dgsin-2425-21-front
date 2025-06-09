// src/app/components/moderator-panel/moderator-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModeratorService, ModReport } from '../../services/moderator.service';
import { NavigationService } from '../../services/navigation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-moderator-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './moderator-panel.component.html',
  styleUrls: ['./moderator-panel.component.scss']
})
export class ModeratorPanelComponent implements OnInit {
  reports: ModReport[] = [];
  errorMsg: string | null = null;

  validStates: ModReport['status'][] = [
    'pending', 'investigating', 'resolved', 'wontfix', 'duplicate', 'invalid', 'needsReview'
  ];

  pageSize = 15;
  currentPage = 1;
  sortColumn: keyof ModReport | null = null;
  sortAsc = true;

  constructor(
    private modSvc: ModeratorService,
    private router: Router,
    private navSvc: NavigationService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.modSvc.getAllReports().subscribe({
      next: data => {
        this.reports = data;
        this.currentPage = 1;
      },
      error: () => this.errorMsg = 'No se pudieron cargar los reportes.'
    });
  }

  get sortedReports(): ModReport[] {
    if (this.sortColumn === null) return this.reports;
    const col = this.sortColumn;
    const sorted = [...this.reports].sort((a, b) => {
      const aVal = a[col];
      const bVal = b[col];
      if (col === 'createdAt' || col === 'updatedAt') {
        return new Date(aVal as string).getTime() - new Date(bVal as string).getTime();
      }
      return (aVal as string).localeCompare(bVal as string);
    });
    return this.sortAsc ? sorted : sorted.reverse();
  }

  get paginatedReports(): ModReport[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedReports.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.reports.length / this.pageSize));
  }

  changeSorting(column: keyof ModReport) {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }
    this.currentPage = 1;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(n: number) {
    if (n >= 1 && n <= this.totalPages) this.currentPage = n;
  }

  onStatusChange(reportId: string, newStatus: ModReport['status']) {
    this.modSvc.updateStatus(reportId, newStatus).subscribe({
      next: () => {
        const target = this.reports.find(r => r._id === reportId);
        if (target) {
          target.status = newStatus;
          target.updatedAt = new Date().toISOString();
        }
      },
      error: () => this.errorMsg = 'Error al cambiar estado.'
    });
  }

  deleteReport(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este reporte?')) return;
    this.modSvc.deleteReport(id).subscribe({
      next: () => {
        this.reports = this.reports.filter(r => r._id !== id);
      },
      error: () => this.errorMsg = 'Error al eliminar reporte.'
    });
  }

  goToDetail(reportId: string) {
    this.navSvc.setReturnUrl('/moderator-dashboard');
    this.router.navigate(['/reports', reportId]);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get emptyRows(): any[] {
    const faltan = this.pageSize - this.paginatedReports.length;
    return Array(faltan > 0 ? faltan : 0);
  }
}
