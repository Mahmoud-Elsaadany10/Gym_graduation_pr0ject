import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from '../../mainPage/navbar/navbar.component';
import { CoachPostsResponse, ShopDetailes } from '../../Model/Models';
import { ShopService } from '../service/shop.service';
import { SharedService } from '../../shared/services/shared.service';
import { RegistrationService } from '../../Registration/service/registration.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-shop-detailes',
  standalone: true,
  imports: [ NgIf, NavbarComponent, NgFor, CommonModule , FormsModule ,RouterModule],
  templateUrl: './shop-detailes.component.html',
  styleUrls: ['./shop-detailes.component.css']
})
export class ShopDetailsComponent implements OnInit {
  shopId!: string;
  shop!: ShopDetailes;
  followed: boolean = false;
  defaultImage: string = 'assets/Rectangle 27.png';
  products: any[] = [];
  post: CoachPostsResponse['data'] | null = null;
  shopImage: string = '';
  hasShop :boolean =false
  selectedImages: File[] =[];
  newPostContent :string = '';
  isModalOpen: boolean =false;

  constructor(private route: ActivatedRoute,
              private shopService: ShopService ,
              private _toast : SharedService ,
              private _Check : RegistrationService) {}

ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('id')!;
    console.log('📌 shopId:', this.shopId);

    this.checkIfFollowing();
    this.getShopDetails();
    this.getProductsByShopId();
    this.getPosts();
    this.checkIfHasShop();
  }


  getShopDetails() {
    this.shopService.getShopById(this.shopId).subscribe({
      next: (res) => {
        console.log('✅ Shop details response:', res);   // هنا اللوج
        if (res.isSuccess) {
          this.shop = res.data;
          this.shopImage = res.data.pictureUrl ;
        }
      },
      error: (err) => console.error('❌ Error fetching shop:', err)
    });
  }

  getProductsByShopId() {
    this.shopService.getProducts({
      PageNumber: 1,
      PageSize: 10,
      ShopID: +this.shopId
    }).subscribe({
      next: (res) => {
        console.log('✅ Products response:', res);
        if (res.isSuccess) this.products = res.data;
      },
      error: (err) => console.error('❌ Error fetching products:', err)
    });
  }


  getPosts() {
    this.shopService.getPostsOfShop(this.shopId).subscribe({
      next: (res) => {
        console.log('✅ Posts response:', res);
        if (res.isSuccess) this.post = res.data;
      },
      error: (err) => console.error('❌ Error fetching posts:', err)
    });
  }


  checkIfFollowing() {
    this.shopService.isFollowingShop(this.shopId).subscribe({
      next: (res) => {
        console.log('✅ IsFollowing response:', res);    // هنا اللوج
        if (res.isFollowing !== undefined) this.followed = res.isFollowing;
      },
      error: (err) => console.error('❌ Error checking follow status:', err)
    });
  }


  toggleFollow() {
    if (this._Check.userData.getValue() === null) {
      this._toast.show("Please Login First", "light");

    }else{
          if (!this.followed) {
      this.shopService.followShop(this.shopId).subscribe({
        next: (res) => {
          this.followed = true;
        },
        error: (err) => console.error('❌ Follow failed:', err)
      });
    } else {
      this.shopService.unfollowShop(this.shopId).subscribe({
        next: (res) => {

          this.followed = false;
        },
        error: (err) => console.error('❌ Unfollow failed:', err)
      });
    }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages = Array.from(input.files);
    }
  }

  submitPost() {

  this.shopService.addPost(this.newPostContent, this.selectedImages , +this.shopId).subscribe({
    next: () => {
      this.closeModal();
      this._toast.show("Post added successfully", "light");
    },
    error: (err) => {
      console.error('❌ Error adding post:', err);
    }
  });
}
onCreatePost() {
  // console.log('📝 Create post modal opened');
  this.isModalOpen = true;
}

closeModal() {
  this.isModalOpen = false;
  this.newPostContent = '';
}

checkIfHasShop() {
  this._Check.getCoachBusiness().subscribe({
    next: (response) => {
      if (response.isSuccess) {
        this.hasShop = response.data.hasShop;
      } else {
        this.hasShop = false;
      }
    },
    error: (err) => {
      console.error('❌ Error checking shop status:', err);
      this.hasShop = false;
    }
  });
 }
}
