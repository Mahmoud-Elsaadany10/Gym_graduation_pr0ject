import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupCoachComponent } from './signup-coach.component';

describe('SignupCoachComponent', () => {
  let component: SignupCoachComponent;
  let fixture: ComponentFixture<SignupCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupCoachComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
