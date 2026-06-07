import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegistroComponent } from './auth/registro/registro';
import { DashboardComponent } from './dashboard/dashboard';
import { ListadoCursosComponent } from './cursos/listado-cursos/listado-cursos';
import { CrearCursoComponent } from './cursos/crear-curso/crear-curso';
import { EditarCursoComponent } from './cursos/editar-curso/editar-curso';
import { DetalleCursoComponent } from './cursos/detalle-curso/detalle-curso'; 
import { MisCursosComponent } from './mis-cursos/mis-cursos';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cursos', component: ListadoCursosComponent },
  { path: 'cursos/crear', component: CrearCursoComponent },
  { path: 'cursos/editar/:id', component: EditarCursoComponent },
  { path: 'cursos/detalle/:id', component: DetalleCursoComponent },
  { path: 'mis-cursos', component: MisCursosComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];