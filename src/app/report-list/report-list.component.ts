import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReportService, BugReport } from '../services/report.service';
import { AuthService }       from '../services/auth.service';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
  reports: BugReport[] = [];
  error: string | null = null;

  currentUserId: string | null = null;
  isAdminOrMod = false;

  // Pagination & sorting
  pageSize    = 15;
  currentPage = 1;
  sortColumn: keyof BugReport | null = null;
  sortAsc     = true;

  constructor(
    private reportSvc: ReportService,
    private auth:       AuthService,
    private router:     Router
  ) {}

  ngOnInit() {
    this.currentUserId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    this.isAdminOrMod  = role === 'admin' || role === 'moderator';
    this.load();
  }

  load() {
    this.reportSvc.getAll().subscribe({
      next: data => {
        this.reports = data;
        this.currentPage = 1;
      },
      error: () => this.error = 'No se pudieron cargar los reportes.'
    });
  }

  /** Ordena según columna y dirección */
  get sortedReports(): BugReport[] {
    if (this.sortColumn === null) return this.reports;
    const col = this.sortColumn;
    const sorted = [...this.reports].sort((a, b) => {
      const aVal = a[col], bVal = b[col];
      if (col === 'createdAt' || col === 'updatedAt') {
        return new Date(aVal).getTime() - new Date(bVal).getTime();
      }
      return (aVal as string).localeCompare(bVal as string);
    });
    return this.sortAsc ? sorted : sorted.reverse();
  }

  /** Solo la página actual */
  get paginatedReports(): BugReport[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedReports.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.reports.length / this.pageSize));
  }

  /** Array [1,2,...,totalPages] para el *ngFor */
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changeSorting(column: keyof BugReport) {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }
    this.currentPage = 1;
  }

  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(n: number) { this.currentPage = Math.min(Math.max(1, n), this.totalPages); }

  goToCreate() { this.router.navigate(['/reports/create']); }
  goToEdit(id: string) { this.router.navigate([`/reports/${id}/edit`]); }
  goToDetail(id: string) { this.router.navigate([`/reports/${id}`]); }

  delete(id: string) {
    if (!confirm('¿Eliminar este reporte?')) return;
    this.reportSvc.delete(id).subscribe({
      next: () => this.load(),
      error: () => this.error = 'Error al eliminar.'
    });
  }

    /** Número de filas vacías para completar la página */
  get emptyRows(): any[] {
    const faltan = this.pageSize - this.paginatedReports.length;
    return Array(faltan > 0 ? faltan : 0);
  }
}
