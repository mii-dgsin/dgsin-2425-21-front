// src/app/components/header/header.component.ts

import { Component }           from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService }         from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
