// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ChartComponent } from './components/chart/chart.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ModeratorPanelComponent } from './components/moderator-panel/moderator-panel.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { ReportDetailComponent } from './components/report-detail/report-detail.component';
import { ReportFormComponent } from './components/report-form/report-form.component';
import { ReportListComponent } from './components/report-list/report-list.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { IntegrationsComponent } from './components/integrations/integrations.component';
import { GeoChartComponent } from './components/geo-chart/geo-chart.component';

export const routes: Routes = [
  // Página de inicio (home)
  { path: '', component: HomeComponent },

  // Página de about (about)
  { path: 'about', component: AboutComponent },
  
  { path: 'chart', component: ChartComponent },

  { path: 'geo-chart', component: GeoChartComponent },
    
  // Login (sin guard)
  { path: 'login', component: LoginComponent },

  // register (sin guard)
  { path: 'register', component: RegisterComponent },

  // Perfil (solo si está logueado)
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },

  // Settings (solo si está logueado)
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },

  // Panel de Admin (solo rol “admin”)
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'reports',
    component: ReportListComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'reports/create',
    component: ReportFormComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'reports/:id/edit',
    component: ReportFormComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path: 'reports/:id',
    component: ReportDetailComponent,
    canActivate: [AuthGuard]
  },

  { 
    path: 'analytics', 
    component: AnalyticsComponent 
  },

  { 
    path: 'integrations', 
    component: IntegrationsComponent 
  },

  // Panel de Moderator (rol “moderator” ó “admin”)
  {
    path: 'moderator-dashboard',
    component: ModeratorPanelComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin','moderator'] }
  },

  // Cualquier otra ruta → redirige a Home
  { path: '**', redirectTo: '' },
];
