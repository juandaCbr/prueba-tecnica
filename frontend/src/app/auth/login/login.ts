import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  // se agrega RouterModule para que routerLink funcione
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow border-0">
            <div class="card-body p-4">
              <h3 class="text-center mb-4 text-primary">iniciar sesión</h3>
              
              <div *ngIf="mensajeError" class="alert alert-danger">{{ mensajeError }}</div>
              
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">correo electrónico</label>
                  <input type="email" class="form-control" formControlName="email">
                </div>
                <div class="mb-4">
                  <label class="form-label">contraseña</label>
                  <input type="password" class="form-control" formControlName="password">
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2" [disabled]="loginForm.invalid">ingresar</button>
                
                <div class="text-center mt-3">
                  <a routerLink="/registro" class="text-decoration-none">¿no tienes cuenta? regístrate aquí</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.mensajeError = 'credenciales inválidas. verifica tu correo y contraseña.';
        }
      });
    }
  }
}