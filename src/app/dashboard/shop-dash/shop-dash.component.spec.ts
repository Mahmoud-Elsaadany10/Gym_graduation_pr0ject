import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDashComponent } from './shop-dash.component';

describe('ShopDashComponent', () => {
  let component: ShopDashComponent;
  let fixture: ComponentFixture<ShopDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
