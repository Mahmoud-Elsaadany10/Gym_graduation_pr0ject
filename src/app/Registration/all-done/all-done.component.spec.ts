import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDoneComponent } from './all-done.component';

describe('AllDoneComponent', () => {
  let component: AllDoneComponent;
  let fixture: ComponentFixture<AllDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
