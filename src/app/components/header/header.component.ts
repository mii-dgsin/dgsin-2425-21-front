// src/app/components/header/header.component.ts

import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { AuthService, UserPayload } from '../../services/auth.service';

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,    // Para *ngIf / *ngFor / etc.
    RouterModule     // Para poder usar routerLink en la plantilla
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
    constructor(public auth: AuthService, private router: Router) {
      
    }
    isLoggedIn = false;
    user: UserPayload | null = null;

    ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
    });
    this.auth.user$.subscribe(u => {
      this.user = u;
    });
  }
  
  // Devuelve el nombre de usuario almacenado en localStorage
  getUsername(): string {
    return this.auth.isLoggedIn() ? localStorage.getItem("username")! : "";
  }

  // Al hacer logout, limpiamos localStorage y navegamos a “/”
  logout() {
    this.auth.logout();
    this.router.navigate(["/"]);
  }
}
