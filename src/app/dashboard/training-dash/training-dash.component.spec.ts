import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDashComponent } from './training-dash.component';

describe('TrainingDashComponent', () => {
  let component: TrainingDashComponent;
  let fixture: ComponentFixture<TrainingDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
