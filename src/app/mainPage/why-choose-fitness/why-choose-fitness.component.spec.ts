import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyChooseFitnessComponent } from './why-choose-fitness.component';

describe('WhyChooseFitnessComponent', () => {
  let component: WhyChooseFitnessComponent;
  let fixture: ComponentFixture<WhyChooseFitnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyChooseFitnessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyChooseFitnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
