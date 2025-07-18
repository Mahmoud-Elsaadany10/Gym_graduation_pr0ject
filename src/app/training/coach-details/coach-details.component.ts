import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { OnlineTrainingService } from '../service/online-training.service';

import { CommonModule } from '@angular/common';
import { coachDetails, CoachPostsResponse, TrainingSession } from '../../Model/Models';
import { RegistrationService } from '../../Registration/service/registration.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../shared/services/shared.service';
import { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { AddRateComponent } from '../../shared/add-rate/add-rate.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateRateComponent } from '../../shared/update-rate/update-rate.component';
import { DialogRef } from '@angular/cdk/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-coach-details',
  standalone: true,
  imports: [NavbarComponent, CommonModule, NgbToastModule ,RouterModule],
  templateUrl: './coach-details.component.html',
  styleUrl: './coach-details.component.css'
})
export class CoachDetailsComponent implements OnInit {
  id: string = '';
  followed: boolean = false;
  coachDtd: coachDetails | null = null;
  list: any = 4;
  isTrue: boolean = false;
  toastMessage: string = "";
  showToast: boolean = false;
  trainingType: TrainingSession[] = [];

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement!: StripeCardElement;
  filledStars: number = 0;

  rating = 0
  ifRate :boolean = false
  post: CoachPostsResponse['data'] | null = null;


  stars = Array(5).fill(0);
  noTrainingMessage: string=""

  constructor(
    private _getDetails: OnlineTrainingService,
    private activeRoute: ActivatedRoute,
    private _Check: RegistrationService,
    private _Rate: SharedService ,
    private _toast: SharedService ,
    private dialog: MatDialog ,

  ) {}

  ngOnInit(): void {
    this.getCoachById();
    this.getGroupTrainingById();
    this.checkRate()
    this.getStatus()
    this.getLastPosts()
    this.loadRate();
  }

  loadRate() {
    this._Rate.getTrainingRatingById(this.id).subscribe({
      next: (res) => {
        this.rating = res.ratingValue;
        this.filledStars = Math.round(this.rating);
      }
    });
  }

  checkRate(){
    this._Rate.checkIfRateTraine(this.id).subscribe({
      next : (res)=>{
        this.ifRate = res
      }
    })
  }

  getLastPosts() {
    this._getDetails.getlastThreePosts(this.id).subscribe({
      next: (res) => {
        this.post = res.data;
      },
      error: (err) => {
        console.error('Error fetching last posts:', err);
      }
    });
  }






  getCoachById() {
    this.id = this.activeRoute.snapshot.paramMap.get("id")!;
    this._getDetails.getCoachById(this.id).subscribe({
      next: (coachDetail) => {
        this.coachDtd = coachDetail.data;

      },
      error: (err) => {
        console.error('Error fetching coach details:', err);

      }
    });
  }

  openRateModal() {
    if (this._Check.userData.getValue() === null) {
      this._toast.show("Please Login First", "light");
  }else{
       const coachId = (this.activeRoute.snapshot.paramMap.get('id'));
    const dialogRef =this.dialog.open(AddRateComponent, {
      width: '600px',
      data: {
        type: 'training',
        coachId: coachId
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result ="sended"){
        this.loadRate();
        this.getCoachById();
        this.checkRate()
      }
    });
  }
  }

  openUpdateModal() {
    if (this._Check.userData.getValue() === null) {
      this._toast.show("Please Login First", "light");
  }else{
        const dialogRef = this.dialog.open(UpdateRateComponent, {
      width: '600px',
      data: {
        type: 'training',
        coachId: this.activeRoute.snapshot.paramMap.get('id')
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated' || result === 'deleted') {
        this.loadRate();
        this.checkRate()
        this.getCoachById();
      }
    });
  }

  }





  follow() {
    if (this._Check.userData.getValue() === null) {
        this._toast.show("Please Login First", "light");
    } else {
      this._getDetails.followCoach(this.id).subscribe({
        next: (res) => {
          if (res.message.includes('You Now Follow')) {
            this.followed = true;
            this._toast.show(res.message, "light");
          }
        },
        error: (err) => console.error('Follow error:', err)
      });
    }
  }

  unfollow() {
    this._getDetails.unfollowCoach(this.id).subscribe({
      next: () =>{
        this.followed = false
        this._toast.show("you unfollowed this coach", "light");
      }
    });
  }

  getStatus() {
    this._getDetails.getStatus(this.id).subscribe({
      next: (res) => {
        this.followed = res.isFollowing;
        console.log(res)
      }
    });
  }

  getGroupTrainingById() {
    this._getDetails.getGroupTrainingById(this.id).subscribe({
      next: (res) =>{
        this.trainingType = res;
        if (!res || res.length === 0) {
          this.noTrainingMessage = "No group training sessions available.";
        } else {
          this.noTrainingMessage = "";
        }
      }
    });
  }

  getPrivateTrainingById() {
    this._getDetails.getPrivateTrainingById(this.id).subscribe({
      next: (res) =>{
        this.trainingType = res
        if (!res || res.length === 0) {
          this.noTrainingMessage = "No private training sessions available.";
        } else {
          this.noTrainingMessage = "";
        }
      }
    });
  }

  onTrainingTypeChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue === 'Group') {
      this.getGroupTrainingById();
    } else if (selectedValue === 'Private') {
      this.getPrivateTrainingById();
    }
  }

  async payment(id: number) {
    const model = { onlineTrainingId: id };
    this._getDetails.payment(model).subscribe({
      next: async (res) => {
        if (res.url) {
          window.location.href = res.url;
        } else {
          console.error('Stripe Checkout URL not found in response');
        }
      },
      error: (err) => {
        console.error('Error creating payment session:', err);
      }
    });
  }

}
