import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggingLayoutComponent } from './logging-layout.component';

describe('LoggingLayoutComponent', () => {
  let component: LoggingLayoutComponent;
  let fixture: ComponentFixture<LoggingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggingLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
