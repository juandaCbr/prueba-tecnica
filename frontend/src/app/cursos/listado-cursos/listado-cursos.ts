import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object // Inyeccion para identificar la plataforma
  ) {}

  ngOnInit(): void {
    // Solo verificamos el rol si estamos ejecutando en el navegador (cliente)
    // Esto previene errores de 'localStorage is not defined' en el servidor Node.js
    if (isPlatformBrowser(this.platformId)) {
      this.esAdmin = this.authService.esAdmin();
    }
    
    // La carga de cursos se puede hacer en el servidor sin problemas
    // para que el HTML ya baje con los datos renderizados (SEO)
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
        this.mensaje = 'inscripcion exitosa. revisa tus cursos.';
        this.cdr.detectChanges();
        setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'error al procesar la inscripcion';
        this.cdr.detectChanges();
        setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 3000);
      }
    });
  }
}