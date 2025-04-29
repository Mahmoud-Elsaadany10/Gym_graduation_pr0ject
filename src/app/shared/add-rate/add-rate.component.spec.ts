import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRateComponent } from './add-rate.component';

describe('AddRateComponent', () => {
  let component: AddRateComponent;
  let fixture: ComponentFixture<AddRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
