import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../core/services/curso';

@Component({
  selector: 'app-editar-curso',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>gestión de curso</h2>
        <a routerLink="/dashboard" class="btn btn-secondary">volver al inicio</a>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-warning py-3 d-flex justify-content-between align-items-center">
              <h4 class="mb-0 text-dark">editar información</h4>
              <button type="button" class="btn btn-danger btn-sm" (click)="eliminarCurso()">eliminar curso permanentemente</button>
            </div>
            
            <div class="card-body p-4">
              <div *ngIf="mensaje" class="alert alert-info">{{ mensaje }}</div>
              
              <div *ngIf="!cursoForm && !mensaje" class="text-center py-4">
                <p class="text-muted">cargando datos del curso...</p>
              </div>

              <form [formGroup]="cursoForm" (ngSubmit)="actualizarCurso()" *ngIf="cursoForm">
                <div class="mb-3">
                  <label class="form-label">título del curso</label>
                  <input type="text" class="form-control" formControlName="titulo">
                </div>
                
                <div class="mb-3">
                  <label class="form-label">nombre del instructor</label>
                  <input type="text" class="form-control" formControlName="instructor">
                </div>
                
                <div class="mb-4">
                  <label class="form-label">descripción detallada</label>
                  <textarea class="form-control" rows="4" formControlName="descripcion"></textarea>
                </div>
                
                <div class="d-flex justify-content-between">
                  <a routerLink="/cursos" class="btn btn-outline-secondary">cancelar y volver a la lista</a>
                  <button type="submit" class="btn btn-warning px-4" [disabled]="cursoForm.invalid">guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EditarCursoComponent implements OnInit {
  cursoForm!: FormGroup;
  cursoId!: number;
  mensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // inyectamos el detector de cambios
  ) {}

  ngOnInit(): void {
    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCurso();
  }

  cargarCurso(): void {
    this.cursoService.obtenerCursoPorId(this.cursoId).subscribe({
      next: (curso) => {
        this.cursoForm = this.fb.group({
          titulo: [curso.titulo, Validators.required],
          descripcion: [curso.descripcion, Validators.required],
          instructor: [curso.instructor, Validators.required]
        });
        // forzamos la actualizacion de la vista inmediatamente
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensaje = 'error al cargar la información del curso.';
        console.error(err);
        // forzamos la actualizacion en caso de error
        this.cdr.detectChanges();
      }
    });
  }

  actualizarCurso(): void {
    if (this.cursoForm.valid) {
      this.cursoService.actualizarCurso(this.cursoId, this.cursoForm.value).subscribe({
        next: () => {
          this.router.navigate(['/cursos']);
        },
        error: (err) => {
          this.mensaje = err.error?.mensaje || 'error al actualizar el curso.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminarCurso(): void {
    if (confirm('¿estás completamente seguro de eliminar este curso? esta acción no se puede deshacer.')) {
      this.cursoService.eliminarCurso(this.cursoId).subscribe({
        next: () => {
          this.router.navigate(['/cursos']);
        },
        error: (err) => {
          this.mensaje = err.error?.mensaje || 'error al intentar eliminar el curso.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}