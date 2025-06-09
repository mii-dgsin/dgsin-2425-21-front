import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportService, BugReport } from '../services/report.service';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {
  report?: BugReport;
  error: string | null = null;
  currentUserId: string | null = null;
  currentUserRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private reportSvc: ReportService,
    private router: Router,
    private authSvc: AuthService,
    private navSvc: NavigationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reportSvc.getById(id).subscribe({
        next: r => this.report = r,
        error: () => this.error = 'No se encontró el reporte.'
      });
    }

    this.currentUserId = this.authSvc.getUserId();
    this.currentUserRole = this.authSvc.getRole();
  }

  canEditOrDelete(): boolean {
    return !!this.report && (
      this.report.reporterId === this.currentUserId ||
      this.currentUserRole === 'admin' ||
      this.currentUserRole === 'moderator'
    );
  }

  goBack() {
    const returnUrl = this.navSvc.getReturnUrl();
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/reports']);
    }
  }

  editReport() {
    this.navSvc.setReturnUrl(this.router.url);
    this.router.navigate(['/reports', this.report!._id, 'edit']);
  }

  deleteReport() {
    if (!confirm('¿Estás seguro de que deseas eliminar este reporte?')) return;

    this.reportSvc.delete(this.report!._id).subscribe({
      next: () => this.router.navigate(['/reports']),
      error: () => alert('No se pudo eliminar el reporte.')
    });
  }
}
