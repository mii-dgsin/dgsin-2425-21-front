// src/app/components/admin/admin.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2>Panel de Administrador</h2>
      <p>Aquí van las funcionalidades reservadas al rol <strong>admin</strong>.</p>
    </div>
  `
})
export class AdminComponent {}
