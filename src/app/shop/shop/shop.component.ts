import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ShopService } from '../service/shop.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [FormsModule, NgFor, NgbPaginationModule, NavbarComponent, NgIf, CommonModule,RouterModule ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  shopName: string = '';
  hide: boolean = true;
  shops: any[] = [];
  filteredShops: any[] = [];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getShops();
  }

getShops() {
  this.shopService.getAllProducts().subscribe({
    next: (res) => {
      console.log('Shops response:', res.data);
      this.shops = res.data;
      this.filteredShops = this.shops;
    },
      error: (err) => {
        console.error('Error fetching shops:', err);
      }
    });
  }

  onSearchInput(): void {
    this.hide = this.shopName.trim() === '';
    this.filterShops();
  }

  filterShops(): void {
    if (this.shopName.trim()) {
      const query = this.shopName.toLowerCase();
      this.filteredShops = this.shops.filter(shop =>
        shop.shopName.toLowerCase().includes(query) ||
        shop.city.toLowerCase().includes(query) ||
        shop.address.toLowerCase().includes(query)
      );
    } else {
      this.filteredShops = this.shops;
    }
  }

  onClickButton(): void {
    this.shopName = '';
    this.hide = true;
    this.filteredShops = this.shops;
  }
}
