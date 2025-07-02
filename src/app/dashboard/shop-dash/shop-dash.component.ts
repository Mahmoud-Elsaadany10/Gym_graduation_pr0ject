import { Component, OnInit, ViewChild } from '@angular/core';
import { Shop } from '../../Model/Models';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../profile/service/profile.service';
import { SharedService } from '../../shared/services/shared.service';
import { DashboardService } from '../service/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private _profileServer: ProfileService
        , private _dashboardService: DashboardService ,
        private _router: Router ,
      private modalService: NgbModal,
      private _sharedService: SharedService) {
    // Initialization logic can go here
  }

  ngOnInit(): void {
    this.getShopDetails();

  }

    getShopDetails() {
    this._profileServer.getShopInfo().subscribe({
      next: (res) => {
        this.shopImage = res.data[0].pictureUrl ? res.data[0].pictureUrl + '?t=' + new Date().getTime() : null;
        console.log(res)
        this.shopImage = res.data[0].pictureUrl
        this.shopId = res.data[0].shopId
        this.shopInfo = res.data[0];
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



}
