// src/app/guards/role.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const expectedRoles: string[] = route.data['roles'];
    const userRole = this.auth.getRole();

    if (!this.auth.isLoggedIn() || !userRole) {
      // No autenticado: redirigir a login
      return this.router.createUrlTree(['/login']);
    }

    // Si el rol del usuario NO está en la lista de roles permitidos
    if (!expectedRoles.includes(userRole)) {
      // Redirigir, por ejemplo, a Home (o a una página 403)
      return this.router.createUrlTree(['/']);
    }

    return true; // Usuario tiene rol permitido
  }
}
