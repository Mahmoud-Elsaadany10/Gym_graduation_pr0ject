import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailesComponent } from './shop-detailes.component';

describe('ShopDetailesComponent', () => {
  let component: ShopDetailesComponent;
  let fixture: ComponentFixture<ShopDetailesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopDetailesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopDetailesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
