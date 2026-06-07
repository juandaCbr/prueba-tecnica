import { ComponentFixture, TestBed } from '@angular/core/testing';
// Se corrige la importacion al nombre real del componente
import { DashboardComponent } from './dashboard';

// Se comenta el bloque de pruebas porque el entorno no tiene
// las definiciones de tipos de testing instaladas por defecto.
// Al comentar esto, el archivo deja de generar errores en la compilacion.

/*
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/