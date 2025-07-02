import { Component, OnInit, ViewChild } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ProfileService } from '../../profile/service/profile.service';
import { GymInfo } from '../../Model/Models';
import { DashboardService } from '../service/dashboard.service';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../shared/services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gym-dash',
  imports: [CommonModule, RouterModule ,FormsModule],
  templateUrl: './gym-dash.component.html',
  styleUrl: './gym-dash.component.css'
})
export class GymDashComponent implements OnInit{
    gymInfo : GymInfo | null = null;
    gymId :number = 0
    @ViewChild('deleteModal') deleteModal: any;
    gymImage : string | null = null;
    isModalOpen: boolean =false;
    newPostContent: string = '';
    selectedImages: File[] = [];
    constructor(private _profileServer: ProfileService
      , private _dashboardService: DashboardService ,
      private _router: Router ,
    private modalService: NgbModal,
    private _sharedService: SharedService) { }

  ngOnInit(): void {
    this.getGymInfo();
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  getCoachId(){
    const token = this.getToken()
    if(token){
      const decodedToken: any = jwtDecode(token);
      const coachId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return coachId
    }
  }
  getGymInfo() {
    this._profileServer.getGymInfo(this.getCoachId()).subscribe({
      next: (gym) => {
        this.gymImage=gym.pictureUrl ? gym.pictureUrl + '?t=' + new Date().getTime() : null;
        console.log('Gym Info:', gym);
        this.gymId = gym.gymID
        this.gymInfo = gym;
      },
      error: (err) => {
        console.error('Failed to load gym info:', err);
      }
    });
  }

  editGym() {
    this._router.navigate(['/layout/profile']);
  }

  openDeleteModal() {
    this.modalService.open(this.deleteModal);
  }


  confirmDelete(modal: any) {
    this._dashboardService.deleteGym(this.gymId).subscribe({
      next: () => {
        this._sharedService.show("Gym deleted successfully", "light");
        this._router.navigate(['/layout/dashboard/profile']);
        this.getGymInfo();
        modal.close();
      },
      error: (err) => {
        console.error('Failed to delete gym:', err);
      }
    });
  }

    onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages = Array.from(input.files);
    }
  }

  submitPost() {
  this._dashboardService.addGymPost(this.newPostContent, this.selectedImages , this.gymId).subscribe({
    next: () => {
      this.closeModal();
      this._sharedService.show("Post added successfully", "light");
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
}
