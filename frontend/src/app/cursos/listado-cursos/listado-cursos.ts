import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CursoService } from '../../core/services/curso';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-listado-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listado-cursos.html'
})
export class ListadoCursosComponent implements OnInit {
  cursos: any[] = [];
  allCursos: any[] = []; 
  mensaje: string = '';
  esAdmin: boolean = false;

  constructor(
    private cursoService: CursoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.esAdmin();
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.cursoService.obtenerCursos().subscribe({
      next: (data) => {
        
        const lista = Array.isArray(data) ? data : (data.cursos || []);
        this.allCursos = lista;
        this.cursos = [...this.allCursos]; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('error al cargar la lista', err);
      }
    });
  }

 
  filtrarCursos(event: any): void {
    const termino = event.target.value.toLowerCase();
    this.cursos = this.allCursos.filter(c => 
      c.titulo.toLowerCase().includes(termino) || 
      c.instructor.toLowerCase().includes(termino)
    );
  }

  inscribirse(cursoId: number): void {
    this.cursoService.inscribirse(cursoId).subscribe({
      next: (res) => {
        this.mensaje = 'inscripción exitosa. revisa tus cursos.';
        this.cdr.detectChanges();
        setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'error al procesar la inscripción';
        this.cdr.detectChanges();
        setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 3000);
      }
    });
  }
}