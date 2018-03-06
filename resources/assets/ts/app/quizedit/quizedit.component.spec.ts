import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizeditComponent } from './quizedit.component';

describe('QuizeditComponent', () => {
  let component: QuizeditComponent;
  let fixture: ComponentFixture<QuizeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
