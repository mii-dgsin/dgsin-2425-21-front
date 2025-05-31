// src/app/components/mod/mod.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mod',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2>Panel de Moderador</h2>
      <p>Aquí van las funcionalidades para <strong>moderadores</strong>.</p>
    </div>
  `
})
export class ModComponent {}
