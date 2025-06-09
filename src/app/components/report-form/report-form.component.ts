import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportService, BugReport } from '../../services/report.service';
import { switchMap } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit {
  form!: FormGroup;
  id?: string;
  suggestions: BugReport[] = [];

  constructor(
    private fb: FormBuilder,
    private reportSvc: ReportService,
    private route: ActivatedRoute,
    public router: Router,
    private navSvc: NavigationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      type: ['bug', Validators.required]
    });

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.id = id;
          return this.reportSvc.getById(id);
        }
        return [];
      })
    ).subscribe((report: any) => {
      if (report && this.id) {
        this.form.patchValue({
          title: report.title,
          description: report.description,
          type: report.type
        });
      }
    });

    this.form.get('title')!.valueChanges.subscribe(q => {
      if (q && q.length >= 3) {
        this.reportSvc.search(q).subscribe(res => this.suggestions = res.results);
      } else {
        this.suggestions = [];
      }
    });
  }

  submit() {
    if (this.form.invalid) return;
    const payload = this.form.value;
    const call = this.id
      ? this.reportSvc.update(this.id, payload)
      : this.reportSvc.create(payload);

    call.subscribe({
      next: () => {
        const returnUrl = this.navSvc.getReturnUrl();
        this.navSvc.clear();

        if (this.id && returnUrl) {
          this.router.navigateByUrl(returnUrl); // volver a detalle o donde sea
        } else {
          this.router.navigate(['/reports']);
        }
      },
      error: () => alert('Error al guardar el reporte')
    });
  }

  selectSuggestion(rep: BugReport) {
    this.router.navigate([`/reports/${rep._id}`]);
  }

  cancel() {
    const returnUrl = this.navSvc.getReturnUrl();
    this.navSvc.clear();

    if (this.id && returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/reports']);
    }
  }
}
