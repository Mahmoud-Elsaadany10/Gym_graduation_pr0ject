import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTrainigComponent } from './online-trainig.component';

describe('OnlineTrainigComponent', () => {
  let component: OnlineTrainigComponent;
  let fixture: ComponentFixture<OnlineTrainigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineTrainigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineTrainigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
