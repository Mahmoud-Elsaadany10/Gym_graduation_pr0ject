import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from '../../mainPage/navbar/navbar.component';
import { ProductService } from '../sevice/product.service';

@Component({
  selector: 'app-products',
  imports: [FormsModule, NgIf, NgFor, NavbarComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  filters = {
    name: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
    // this.getCategories(); // فعليها لو عندك API للفئات
  }

  getProducts(): void {
    const params: any = {
      PageNumber: 1,
      PageSize: 10,
    };

    if (this.filters.name) params.Name = this.filters.name;
    if (this.filters.categoryId) params.CategoryID = this.filters.categoryId;
    if (this.filters.minPrice) params.MinimumPrice = this.filters.minPrice;
    if (this.filters.maxPrice) params.MaximumPrice = this.filters.maxPrice;

    if (this.filters.sort === 'desc') params.SearchByPriceDescending = true;
    else if (this.filters.sort === 'asc') params.SearchByPriceAscending = true;
    else if (this.filters.sort === 'discount') params.SearchByBiggetDiscount = true;

    this.productService.getProducts(params).subscribe({
    next: (res) => {
      console.log('✅ API Response:', res); // هنا بتطبع كل الريسبونس
      if (res?.isSuccess) {
        this.products = res.data;
        console.log('✅ Products Loaded:', this.products); // هنا بتطبع المنتجات بس
      } else {
        console.warn('⚠️ API returned isSuccess = false');
      }
    },
    error: (err) => {
      console.error('❌ Error fetching products:', err);
    }
  });
  }

  clearName() {
    this.filters.name = '';
    this.getProducts();
  }
}
