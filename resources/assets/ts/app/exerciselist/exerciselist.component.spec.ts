import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciselistComponent } from './exerciselist.component';

describe('ExerciselistComponent', () => {
  let component: ExerciselistComponent;
  let fixture: ComponentFixture<ExerciselistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciselistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
