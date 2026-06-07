import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCurso } from './crear-curso';

describe('CrearCurso', () => {
  let component: CrearCurso;
  let fixture: ComponentFixture<CrearCurso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCurso],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearCurso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
