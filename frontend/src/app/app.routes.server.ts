import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '/login', renderMode: RenderMode.Prerender },
  { path: '/registro', renderMode: RenderMode.Prerender },
  { path: '/dashboard', renderMode: RenderMode.Prerender },
  { path: '/cursos', renderMode: RenderMode.Prerender },
  { path: '/cursos/crear', renderMode: RenderMode.Prerender },
  { path: '/mis-cursos', renderMode: RenderMode.Prerender },
  { path: '/cursos/editar/:id', renderMode: RenderMode.Server },
  { path: '/cursos/detalle/:id', renderMode: RenderMode.Server },
];
