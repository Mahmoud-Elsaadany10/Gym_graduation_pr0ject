import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymDashComponent } from './gym-dash.component';

describe('GymDashComponent', () => {
  let component: GymDashComponent;
  let fixture: ComponentFixture<GymDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
