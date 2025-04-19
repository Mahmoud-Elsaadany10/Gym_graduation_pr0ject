import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymInfoComponent } from './gym-info.component';

describe('GymInfoComponent', () => {
  let component: GymInfoComponent;
  let fixture: ComponentFixture<GymInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
