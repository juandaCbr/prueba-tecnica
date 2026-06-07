import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// importamos el servicio asumiendo que tu archivo se llama auth.ts
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // verifica si el usuario tiene una sesion activa
  if (authService.estaAutenticado()) {
    return true;
  }

  // si no esta autenticado, lo redirige a la vista de login
  router.navigate(['/login']);
  return false;
};