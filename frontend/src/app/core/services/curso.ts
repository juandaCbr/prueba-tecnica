import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://127.0.0.1:5000/api/cursos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerCursos(): Observable<any> { 
    return this.http.get(this.apiUrl, { headers: this.getHeaders() }); 
  }

  obtenerCursoPorId(id: number): Observable<any> { 
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }); 
  }

  // Nuevo método para las estadísticas del admin
  obtenerStats(): Observable<any> {
    return this.http.get('http://127.0.0.1:5000/api/admin/stats', { headers: this.getHeaders() });
  }

  crearCurso(curso: any): Observable<any> { 
    return this.http.post(this.apiUrl, curso, { headers: this.getHeaders() }); 
  }

  actualizarCurso(id: number, curso: any): Observable<any> { 
    return this.http.put(`${this.apiUrl}/${id}`, curso, { headers: this.getHeaders() }); 
  }

  eliminarCurso(id: number): Observable<any> { 
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }); 
  }

  inscribirse(cursoId: number): Observable<any> { 
    return this.http.post(`${this.apiUrl}/${cursoId}/inscribirse`, {}, { headers: this.getHeaders() }); 
  }

  obtenerMisCursos(): Observable<any> { 
    return this.http.get('http://127.0.0.1:5000/api/mis-cursos', { headers: this.getHeaders() }); 
  }
  // obtiene la lista de estudiantes inscritos en un curso (solo admin)
  obtenerEstudiantesPorCurso(cursoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${cursoId}/estudiantes`, { headers: this.getHeaders() });
  }
}