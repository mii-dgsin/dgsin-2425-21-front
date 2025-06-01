// src/app/components/admin-panel/admin-panel.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { RouterModule }      from '@angular/router';
import { AdminService, User } from '../../services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  errorMsg: string | null = null;

  constructor(private adminSvc: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminSvc.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.errorMsg = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  onChangeRole(userId: string, newRole: string) {
    this.adminSvc.updateUserRole(userId, newRole).subscribe({
      next: () => {
        // mostrar feedback breve y actualizar lista
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al cambiar rol:', err);
        this.errorMsg = 'No se pudo cambiar el rol del usuario.';
      }
    });
  }
}
