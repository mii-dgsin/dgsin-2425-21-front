// src/app/app.routes.ts

import { Route }              from '@angular/router';
import { HomeComponent }      from './components/home/home.component';
import { LoginComponent }     from './components/login/login.component';
import { RegisterComponent }  from './components/register/register.component';

export const routes: Route[] = [
  { path: '',           component: HomeComponent },
  { path: 'login',      component: LoginComponent },
  { path: 'register',   component: RegisterComponent },
  // Si quieres proteger rutas, en un futuro puedes añadir canActivate: [AuthGuard]
  { path: '**', redirectTo: '' }
];
