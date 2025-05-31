// src/app/components/register/register.component.ts

import { Component } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService }   from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { username, email, password } = this.registerForm.value;
    this.auth.register(username, email, password).subscribe({
      next: res => {
        this.successMsg = res.message + ' Ahora inicia sesión.';
        // Opcional: redirigir a login tras unos segundos:
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        this.errorMsg = err.error?.error || 'Error al registrarte.';
      }
    });
  }
}
