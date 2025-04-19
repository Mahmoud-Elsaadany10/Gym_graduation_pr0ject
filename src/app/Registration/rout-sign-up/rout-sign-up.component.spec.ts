import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutSignUpComponent } from './rout-sign-up.component';

describe('RoutSignUpComponent', () => {
  let component: RoutSignUpComponent;
  let fixture: ComponentFixture<RoutSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutSignUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
