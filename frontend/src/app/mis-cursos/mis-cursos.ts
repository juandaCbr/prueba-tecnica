import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CursoService } from '../core/services/curso';

@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis cursos inscritos</h2>
        <a routerLink="/dashboard" class="btn btn-secondary shadow-sm fw-bold">Volver al panel</a>
      </div>

      <div *ngIf="cargando" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="text-muted fw-bold">Cargando tu biblioteca...</p>
      </div>

      <div class="row" *ngIf="!cargando && misCursos.length > 0">
        <div class="col-md-4 mb-4" *ngFor="let curso of misCursos">
          <div class="card h-100 shadow-sm border-0 curso-card">
            
            <div class="bg-success bg-opacity-10 py-3 text-center border-bottom border-success border-opacity-10">
               <span class="badge bg-success text-uppercase px-3 py-2 rounded-pill shadow-sm">Inscripción activa</span>
            </div>
            
            <div class="card-body px-4 pt-4">
              <h5 class="card-title text-dark fw-bold mb-3">{{ curso.titulo }}</h5>
              
              <p class="text-muted small mb-2">
                <strong>Instructor: </strong> <span class="text-dark">{{ curso.instructor }}</span>
              </p>
              
              <p class="text-muted small mb-3 border-bottom pb-3">
                <strong>Fecha de inicio: </strong> 
                <span class="text-dark">{{ curso.fecha_inscripcion | date:'mediumDate' }}</span>
              </p>
            </div>
            
            <div class="card-footer bg-white border-0 px-4 pb-4">
              <a [routerLink]="['/cursos/detalle', curso.curso_id]" class="btn btn-primary w-100 fw-bold rounded-3 py-2 shadow-sm">
                Ir al curso
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="row" *ngIf="!cargando && misCursos.length === 0">
        <div class="col-12">
          <div class="card p-5 shadow-sm border-0 text-center rounded-4">
            <h4 class="mb-3 text-dark fw-bold">No tienes cursos en tu biblioteca</h4>
            <p class="text-muted mb-4">Aún no te has inscrito en ningún curso. Visita el catálogo para empezar tu aprendizaje.</p>
            <div>
              <a routerLink="/cursos" class="btn btn-primary btn-lg px-5 shadow-sm fw-bold">Explorar catálogo de cursos</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MisCursosComponent implements OnInit {
  misCursos: any[] = [];
  cargando: boolean = true;

  constructor(
    private cursoService: CursoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMisCursos();
  }

  cargarMisCursos(): void {
    this.cursoService.obtenerMisCursos().subscribe({
      next: (data) => {
        // extraccion segura de los datos
        if (Array.isArray(data)) {
          this.misCursos = data;
        } else if (data && data.cursos) {
          this.misCursos = data.cursos;
        } else if (data && data.mis_cursos) {
          this.misCursos = data.mis_cursos;
        } else {
          this.misCursos = [];
        }
        
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('error al cargar los cursos inscritos', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}