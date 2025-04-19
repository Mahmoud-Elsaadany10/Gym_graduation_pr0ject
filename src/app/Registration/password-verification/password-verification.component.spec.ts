import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordVerificationComponent } from './password-verification.component';

describe('PasswordVerificationComponent', () => {
  let component: PasswordVerificationComponent;
  let fixture: ComponentFixture<PasswordVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
