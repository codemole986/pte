import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalexamComponent } from './evalexam.component';

describe('EvalexamComponent', () => {
  let component: EvalexamComponent;
  let fixture: ComponentFixture<EvalexamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalexamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalexamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
