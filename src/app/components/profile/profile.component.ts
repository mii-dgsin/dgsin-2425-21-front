// src/app/components/profile/profile.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService, UserPayload } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  // 1) Declaramos la propiedad sin inicializarla
  user$!: Observable<UserPayload | null>;

  // 2) Inyectamos AuthService en el constructor
  constructor(private auth: AuthService) {
    // 3) Asignamos aquí, ya que en el constructor auth sí existe
    this.user$ = this.auth.user$;
  }
}
