import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ajusta la ruta según tu estructura

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent {
  constructor(private router: Router, private auth: AuthService) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
