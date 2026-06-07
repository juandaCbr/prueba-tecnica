import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../core/services/auth';
import { CursoService } from '../core/services/curso';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Bienvenido al panel de control</h2>
        <button class="btn btn-danger shadow-sm fw-bold" (click)="cerrarSesion()">
          Cerrar sesión
        </button>
      </div>
      
      <div *ngIf="esAdmin">
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="card p-4 shadow-sm border-0">
              <h4>Cursos totales</h4>
              <p class="h2 text-primary">{{ stats.total_cursos }}</p>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="card p-4 shadow-sm border-0">
              <h4>Inscripciones totales</h4>
              <p class="h2 text-success">{{ stats.total_inscripciones }}</p>
            </div>
          </div>
        </div>

        <div class="card p-4 shadow-sm border-0 mt-2">
          <h4>Gestión de plataforma</h4>
          <p class="text-muted">Administra el catálogo de cursos y la información disponible para los estudiantes.</p>
          <div class="d-flex gap-3 mt-2">
            <a routerLink="/cursos" class="btn btn-primary shadow-sm fw-bold">Gestionar cursos existentes</a>
            <a routerLink="/cursos/crear" class="btn btn-success shadow-sm fw-bold">Crear nuevo curso</a>
          </div>
        </div>
      </div>

      <div class="row" *ngIf="!esAdmin">
        <div class="col-md-12">
          
          <div class="card p-4 shadow-sm border-0" *ngIf="misCursos.length > 0">
            <h4>Tu progreso</h4>
            <p class="text-muted">Tienes {{ misCursos.length }} curso(s) en progreso.</p>
            <div class="d-flex gap-3 mt-2">
              <a routerLink="/mis-cursos" class="btn btn-primary shadow-sm fw-bold">Ver mis cursos</a>
              <a routerLink="/cursos" class="btn btn-outline-primary shadow-sm fw-bold">Explorar más cursos</a>
            </div>
          </div>

          <div class="card p-5 shadow-sm border-0 text-center" *ngIf="misCursos.length === 0">
            <h4 class="mb-3">Aún no tienes cursos inscritos</h4>
            <p class="text-muted">Explora nuestra biblioteca y empieza tu aprendizaje hoy mismo.</p>
            <div class="mt-3">
              <a routerLink="/cursos" class="btn btn-primary btn-lg px-5 shadow-sm fw-bold">Explorar cursos disponibles</a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  esAdmin = false;
  stats = { total_cursos: 0, total_inscripciones: 0 };
  misCursos: any[] = [];

  constructor(
    private auth: AuthService, 
    private cursoService: CursoService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.esAdmin = this.auth.esAdmin();
    
    if (this.esAdmin) {
      this.cursoService.obtenerStats().subscribe({
        next: (s) => {
          this.stats = s;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.cursoService.obtenerMisCursos().subscribe({
        next: (data) => {
          // validacion defensiva para extraer siempre un arreglo de cursos
          if (Array.isArray(data)) {
            this.misCursos = data;
          } else if (data && data.cursos) {
            this.misCursos = data.cursos;
          } else if (data && data.mis_cursos) {
            this.misCursos = data.mis_cursos;
          } else {
            this.misCursos = [];
          }
          
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('error al cargar mis cursos:', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  // metodo para limpiar los datos locales y salir del sistema
  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}