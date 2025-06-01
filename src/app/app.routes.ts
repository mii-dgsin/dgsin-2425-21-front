// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ModeratorPanelComponent } from './components/moderator-panel/moderator-panel.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Página de inicio (home)
  { path: '', component: HomeComponent },

  // Login (sin guard)
  { path: 'auth/login', component: LoginComponent },

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
