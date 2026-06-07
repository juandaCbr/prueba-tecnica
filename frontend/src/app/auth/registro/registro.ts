import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow border-0">
            <div class="card-body p-4">
              <h3 class="text-center mb-4 text-primary">registro</h3>
              
              <div *ngIf="mensajeError" class="alert alert-danger">{{ mensajeError }}</div>
              
              <form [formGroup]="registroForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">nombre completo</label>
                  <input type="text" class="form-control" formControlName="nombre">
                </div>
                <div class="mb-3">
                  <label class="form-label">correo electrónico</label>
                  <input type="email" class="form-control" formControlName="email">
                  <small class="text-muted">usa la palabra 'admin' en el correo para ser administrador.</small>
                </div>
                <div class="mb-4">
                  <label class="form-label">contraseña</label>
                  <input type="password" class="form-control" formControlName="password">
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2" [disabled]="registroForm.invalid">crear cuenta</button>
                <div class="text-center mt-3">
                  <a routerLink="/login" class="text-decoration-none">¿ya tienes cuenta? inicia sesión</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensajeError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.authService.registro(this.registroForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.mensajeError = err.error?.mensaje || 'error al registrar el usuario';
        }
      });
    }
  }
}