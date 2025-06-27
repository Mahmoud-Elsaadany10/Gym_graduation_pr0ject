import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopDetailes, ShopdetailesResponse } from '../../../../Model/Models';
import { ShopService } from '../../../service/shop.service';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { NavbarComponent } from "../../../../mainPage/navbar/navbar.component";

@Component({
  selector: 'app-shop-detailes',
  imports: [NgStyle, NgIf, NavbarComponent,NgFor],
  templateUrl: './shop-detailes.component.html',
  styleUrls: ['./shop-detailes.component.css'] // صححت الاسم
})
export class ShopDetailsComponent implements OnInit {
  shopId!: string;
  shop!: ShopDetailes;
  followed: boolean = false;
  defaultImage: string = 'assets/Rectangle 27.png';

  constructor(private route: ActivatedRoute, private shopService: ShopService) {}

ngOnInit(): void {
  this.shopId = this.route.snapshot.paramMap.get('id')!;
  this.getShopDetails();
  this.getProductsByShopId(); // 👈 هنا
}


  getShopDetails() {
    this.shopService.getShopById(this.shopId).subscribe({
     next: (res: ShopdetailesResponse) => {
  if (res.isSuccess) {
    this.shop = res.data;
    console.log(this.shop); // <-- تحقق من وجود pictureUrl
  }
}
,
      error: (err) => {
        console.error('Error fetching shop:', err);
      }
    });
  }

  follow() {
    this.followed = true;
    console.log('Followed!');
  }

  unfollow() {
    this.followed = false;
    console.log('Unfollowed!');
  }

  products: any[] = [];

getProductsByShopId() {
  this.shopService.getProducts({
    PageNumber: 1,
    PageSize: 10,
    ShopID: +this.shopId
  }).subscribe({
    next: (res: any) => {
      if (res.isSuccess) {
        this.products = res.data;
      }
    },
    error: (err) => console.error('Error fetching products:', err)
  });
}

}
