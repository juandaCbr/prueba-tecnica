import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../core/services/curso';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-detalle-curso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5" *ngIf="curso">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalles del curso</h2>
        <a routerLink="/cursos" class="btn btn-secondary shadow-sm fw-bold">Volver a cursos</a>
      </div>
      
      <div class="card shadow-sm border-0 mb-4">
        <div class="bg-primary bg-opacity-10 py-4 px-4 border-bottom border-primary border-opacity-10">
          <h3 class="text-primary fw-bold mb-0">{{ curso.titulo }}</h3>
        </div>
        <div class="card-body p-4">
          <h5 class="fw-bold mb-3">Instructor: <span class="text-dark fw-normal">{{ curso.instructor }}</span></h5>
          <p class="lead text-secondary">{{ curso.descripcion }}</p>
          
          <div *ngIf="!esAdmin" class="mt-4 border-top pt-4">
            
            <button *ngIf="!yaInscrito" class="btn btn-primary btn-lg px-5 shadow-sm fw-bold" (click)="inscribirse()">
              Inscribirme ahora
            </button>

            <div *ngIf="yaInscrito" class="alert alert-success shadow-sm mb-0 d-flex align-items-center justify-content-between">
              <span class="fw-bold">Ya te encuentras inscrito en este curso.</span>
              <a routerLink="/mis-cursos" class="btn btn-sm btn-success fw-bold shadow-sm">Ir a mis cursos</a>
            </div>

            <div *ngIf="mensaje && !yaInscrito" class="alert alert-info mt-3 fw-bold shadow-sm">{{ mensaje }}</div>
          </div>
        </div>
      </div>

      <div *ngIf="esAdmin" class="card shadow-sm border-0">
        <div class="card-header bg-white py-3">
          <h4 class="mb-0 text-dark fw-bold">Estudiantes inscritos ({{ estudiantes.length }})</h4>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">Nombre</th>
                  <th>Correo electrónico</th>
                  <th>Fecha de inscripción</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let est of estudiantes">
                  <td class="ps-4 fw-bold text-dark">{{ est.nombre }}</td>
                  <td>{{ est.email }}</td>
                  <td>{{ est.fecha_inscripcion | date:'shortDate' }}</td>
                </tr>
                <tr *ngIf="estudiantes.length === 0">
                  <td colspan="3" class="text-center py-5 text-muted">No hay estudiantes inscritos en este curso aún.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!curso" class="text-center mt-5 py-5">
      <div class="spinner-border text-primary mb-3" role="status"></div>
      <p class="text-muted fw-bold">Cargando detalles del curso...</p>
    </div>
  `
})
export class DetalleCursoComponent implements OnInit {
  cursoId!: number;
  curso: any = null;
  estudiantes: any[] = [];
  esAdmin: boolean = false;
  yaInscrito: boolean = false; 
  mensaje: string = '';

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));
    this.esAdmin = this.authService.esAdmin();
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cursoService.obtenerCursoPorId(this.cursoId).subscribe({
      next: (data) => {
        this.curso = data.curso ? data.curso : data;
        this.cdr.detectChanges();
        
        if (this.esAdmin) {
          this.cargarEstudiantes();
        } else {
          this.verificarInscripcion();
        }
      },
      error: (err) => console.error('error al cargar curso', err)
    });
  }

  // funcion corregida con tipado explicito
  verificarInscripcion(): void {
    this.cursoService.obtenerMisCursos().subscribe({
      next: (data) => {
        // definimos explicitamente que es un arreglo de tipo any
        let misCursos: any[] = []; 
        
        if (Array.isArray(data)) {
          misCursos = data;
        } else if (data && data.cursos) {
          misCursos = data.cursos;
        } else if (data && data.mis_cursos) {
          misCursos = data.mis_cursos;
        }
        
        // asignamos el tipo any al parametro c de la funcion flecha
        this.yaInscrito = misCursos.some((c: any) => c.curso_id === this.cursoId);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('error al verificar inscripciones', err)
    });
  }

  cargarEstudiantes(): void {
    this.cursoService.obtenerEstudiantesPorCurso(this.cursoId).subscribe({
      next: (data) => {
        this.estudiantes = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('error al cargar estudiantes', err)
    });
  }

  inscribirse(): void {
    this.cursoService.inscribirse(this.cursoId).subscribe({
      next: () => {
        this.yaInscrito = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al procesar la inscripción';
        this.cdr.detectChanges();
      }
    });
  }
}