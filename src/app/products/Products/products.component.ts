import { Component, OnInit, TemplateRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from '../../mainPage/navbar/navbar.component';
import { ProductService } from '../sevice/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  selectedFilter: any = null;
  product : any ={}


  filterOptions = [
    { label: 'All Products', value: 'all' },
    { label: 'Biggest Discount', value: { SearchByBiggetDiscount: true } },
    { label: 'Price Descending', value: { SearchByPriceDescending: true } },
    { label: 'Price Ascending', value: { SearchByPriceAscending: true } }
  ];

  constructor(private productService: ProductService ,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }



    getProducts(filters: any = {}) {
    this.productService.getProducts(filters).subscribe((res: any) => {
      this.products = res.data || res;

    });
}
  onFilterChange() {
    this.getProducts(this.selectedFilter);
  }

  clearName() {
  this.filters.name = '';
  this.getProducts();
  }

  getProductBy(id :number){
    this.productService.getProductById(id).subscribe((res: any) => {
      this.product = res.data
      console.log(res)
    })
  }

  openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
	}
}
