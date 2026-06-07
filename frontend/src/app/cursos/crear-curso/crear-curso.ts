import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../core/services/curso';

@Component({
  selector: 'app-crear-curso',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './crear-curso.html'
})
export class CrearCursoComponent {
  cursoForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private router: Router
  ) {
    // inicializamos el formulario con los campos requeridos por el backend
    this.cursoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      instructor: ['', Validators.required]
    });
  }

  guardarCurso(): void {
    if (this.cursoForm.valid) {
      this.cursoService.crearCurso(this.cursoForm.value).subscribe({
        next: (res) => {
          // si el curso se crea exitosamente, volvemos a la lista para verlo
          this.router.navigate(['/cursos']);
        },
        error: (err) => {
          // capturamos cualquier error en la peticion http
          this.mensajeError = 'hubo un error al guardar el curso. verifica tu conexión.';
          console.error(err);
        }
      });
    }
  }
}