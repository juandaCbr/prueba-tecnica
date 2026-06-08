import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // envia los datos para registrar un nuevo usuario
  registro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  // envia las credenciales y guarda el token y el rol en memoria si esta en el navegador
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res: any) => {
        if (isPlatformBrowser(this.platformId)) {
          const tokenRecibido = res.token || res.access_token;
          if (tokenRecibido) {
            localStorage.setItem('token', tokenRecibido);
            // guardamos el rol devuelto por el backend
            if (res.rol) {
              localStorage.setItem('rol', res.rol);
            }
          }
        }
      })
    );
  }

  // borra el token y el rol de la memoria (solo en el navegador)
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
    }
  }

  // verifica si hay una sesion activa de manera segura para SSR
  estaAutenticado(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false; // por defecto no autenticado en el servidor
  }

  // extrae el token para adjuntarlo a las peticiones protegidas
  obtenerToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // verifica si el usuario actual tiene rol de administrador de manera segura
  esAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('rol') === 'admin';
    }
    return false;
  }
}