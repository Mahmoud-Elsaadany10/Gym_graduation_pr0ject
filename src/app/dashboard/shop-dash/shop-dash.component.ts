import { Component, OnInit, ViewChild } from '@angular/core';
import { Product, Shop } from '../../Model/Models';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../profile/service/profile.service';
import { SharedService } from '../../shared/services/shared.service';
import { DashboardService } from '../service/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-shop-dash',
  imports: [CommonModule , FormsModule],
  templateUrl: './shop-dash.component.html',
  styleUrl: './shop-dash.component.css'
})
export class ShopDashComponent implements OnInit {
  shopInfo : Shop | null =null
  @ViewChild('deleteModal') deleteModal: any;
  shopImage : string | null = null;
  isModalOpen: boolean =false;
  shopId: number = 0
  newPostContent: string = '';
  selectedImages: File[] = [];
  isOpen = false;

  ProductImage: File | null = null;
  product: any = null;
  products : Product[]=[]


  constructor(private _profileServer: ProfileService
        , private _dashboardService: DashboardService ,
        private _router: Router ,
      private modalService: NgbModal,
      private _sharedService: SharedService) {

  }

  ngOnInit(): void {
    this.getShopDetails();
    this.getProductDetails()


  }

  getProductDetails(){
this._dashboardService.getShopOwner().pipe(
  switchMap((res: any) => {
    const shopId = res?.data[0]?.shopId;
    return this._dashboardService.getProductForOwner(shopId);
  })
).subscribe({
  next: (productsResponse: any) => {
    console.log(">>>>>>", productsResponse);
    this.products = productsResponse.data; // ✅ استخدام data هنا
  },
  error: (err) => {
    console.error(err);
  }
});

  }

  deleteProduct(id:number){
    this._dashboardService.deleteProduct(id).subscribe({
      next: (res: any) => {
        this._sharedService.show("Product deleted successfully","light")
        this.getShopDetails()
        this.getProductDetails()
      }
    })
  }

    getShopDetails() {
    this._profileServer.getShopInfo().subscribe({
      next: (res) => {
        this.shopImage = res.data[0].pictureUrl ? res.data[0].pictureUrl + '?t=' + new Date().getTime() : null;
        console.log(res)
        this.shopImage = res.data[0].pictureUrl
        this.shopId = res.data[0].shopId
        this.shopInfo = res.data[0];

          this.product = {
          name: '',
          description: '',
          price: "",
          offerPrice: "",
          quantity: "",
          categoriesName: '',
          shopId: this.shopId
          };
      },
      error: (err) => {
        console.error('Failed to load shop details:', err);
      }
    });
  }

  editShop() {
    this._router.navigate(['/layout/profile']);
  }

  openDeleteModal() {
    this.modalService.open(this.deleteModal);
  }

  onCreatePost() {
  this.isModalOpen = true;
}

closeModal() {
  this.isModalOpen = false;
  this.newPostContent = '';
}
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages = Array.from(input.files);
    }
  }

  submitPost() {

  this._dashboardService.addShopPost(this.newPostContent, this.selectedImages , this.shopId).subscribe({
    next: () => {
      this.closeModal();
      this._sharedService.show("Post added successfully", "light");
      this.getShopDetails()
      this.getProductDetails()
    },
    error: (err) => {
      console.error('❌ Error adding post:', err);
    }
  });
}

    confirmDelete(modal: any) {
    this._dashboardService.deleteShop(this.shopId).subscribe({
      next: () => {
        this._sharedService.show("Shop deleted successfully", "light");
        this._router.navigate(['/layout/dashboard/profile']);

        modal.close();
      },
      error: (err) => {
        console.error('Failed to delete gym:', err);
      }
    });
  }


  openModal() {
    this.isOpen = true;
    console.log(this.shopId)
  }

  close() {
    this.isOpen = false;
    this.resetForm();
  }

  onFile(event: any) {
    this.ProductImage = event.target.files[0];
  }

    submitProduct() {
    if (!this.ProductImage) {
      alert("Please select an image.");
      return;
    }
    console.log(this.product)

    this._dashboardService.addProduct(this.product, this.ProductImage).subscribe({
      next: (res) => {
        this._sharedService.show("Product Added successfully" ,"light")

        this.close();
      },
      error: (err) => {
        console.error("❌ Error adding product:", err);
      }
    });
  }

  resetForm() {
    this.product = {
      name: '',
      description: '',
      price: 0,
      offerPrice: 0,
      quantity: 0,
      categoriesName: '',
      shopId: 0
    };
    this.ProductImage = null;
  }



}
