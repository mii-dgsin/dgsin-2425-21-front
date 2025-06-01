// src/app/app.routes.ts

import { Route }               from '@angular/router';
import { HomeComponent }       from './components/home/home.component';
import { LoginComponent }      from './components/login/login.component';
import { RegisterComponent }   from './components/register/register.component';
import { ModeratorPanelComponent } from './components/moderator-panel/moderator-panel.component';
import { AdminPanelComponent }     from './components/admin-panel/admin-panel.component';

import { RoleGuard }           from './guards/role.guard';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Panel Moderadores: solo admin o moderator
  {
    path: 'moderator-dashboard',
    component: ModeratorPanelComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'moderator'] }
  },

  // Panel Administradores: solo admin
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },

  { path: '**', redirectTo: '' }
];
