import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api/auth';

  constructor(private http: HttpClient) {}

  // envia los datos para registrar un nuevo usuario
  registro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  // envia las credenciales y guarda el token y el rol en memoria
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res: any) => {
        const tokenRecibido = res.token || res.access_token;
        if (tokenRecibido) {
          localStorage.setItem('token', tokenRecibido);
          // guardamos el rol devuelto por el backend
          if (res.rol) {
            localStorage.setItem('rol', res.rol);
          }
        }
      })
    );
  }

  // borra el token y el rol de la memoria
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }

  // verifica si hay una sesion activa
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  // extrae el token para adjuntarlo a las peticiones protegidas
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // verifica si el usuario actual tiene rol de administrador
  esAdmin(): boolean {
    return localStorage.getItem('rol') === 'admin';
  }
}