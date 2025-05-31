// src/app/app.routes.ts

import { Route }            from '@angular/router';
import { HomeComponent }    from './components/home/home.component';
import { LoginComponent }   from './components/login/login.component';
import { RegisterComponent }from './components/register/register.component';
import { AdminComponent }   from './components/admin/admin.component';
import { ModComponent }     from './components/mod/mod.component';

import { RoleGuard }        from './guards/role.guard';

export const routes: Route[] = [
  { path: '',           component: HomeComponent },

  // Rutas públicas
  { path: 'login',      component: LoginComponent },
  { path: 'register',   component: RegisterComponent },

  // Ruta PROTEGIDA solo admins
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },

  // Ruta PROTEGIDA para admin y moderator
  {
    path: 'moderator-dashboard',
    component: ModComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin','moderator'] }
  },

  // Cualquier otra → redirige a Home
  { path: '**', redirectTo: '' }
];
