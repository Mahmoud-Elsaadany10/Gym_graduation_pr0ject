import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLoggingComponent } from './navbar-logging.component';

describe('NavbarLoggingComponent', () => {
  let component: NavbarLoggingComponent;
  let fixture: ComponentFixture<NavbarLoggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarLoggingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarLoggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
