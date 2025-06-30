import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, NgFor } from '@angular/common';
import { NavbarComponent } from '../../mainPage/navbar/navbar.component';
import { AddRateComponent } from '../../shared/add-rate/add-rate.component';
import { GymService } from '../service/gym.service';
import { UpdateRateComponent } from '../../shared/update-rate/update-rate.component';
import { SharedService } from '../../shared/services/shared.service';
import { RegistrationService } from '../../Registration/service/registration.service';
import { OnlineTrainingService } from '../../training/service/online-training.service';
import { CoachPostsResponse } from '../../Model/Models';



@Component({
  standalone: true,
  selector: 'app-gym-details',
  imports: [NavbarComponent, CommonModule,MatDialogModule ,RouterModule],
  templateUrl: './gym-details.component.html',
  styleUrl: './gym-details.component.css'
})
export class GymDetailsComponent implements OnInit {

  gymName: string = '...';
  coachName: string = 'user';
  Desctibtion:string='...';
  coachImage: string='';
  fortnightlyPrice:number=0;
  monthlyPrice:number=0;
  yearlyPrice:number=0;
  sessionPrice:number=0;
  gymId : number = 0

  averageRating: number = 0;
  filledStars: number = 0;
  stars = Array(5).fill(0);
  selectedTab: string = 'Description';
  isRated: boolean = false;
  followed :boolean =false;
  rating : number = 0;
  gymImage: string =""
  post: CoachPostsResponse['data'] | null = null;

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog ,
  private _gymService: GymService ,
  private _loadRate : SharedService ,
   private _getDetails: OnlineTrainingService,
private _Check: RegistrationService,
) {

  }
  openRateModal() {
    if (this._Check.userData.getValue() === null) {
        this._loadRate.show("Please Login First", "light");
    }else{
    const gymID = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Current Gym ID:', gymID);
    const dialogRef = this.dialog.open(AddRateComponent, {
      width: '600px',
      data: {
        type: 'gym',
        gymID: gymID
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result ="sendRate"){
        this.ngOnInit();
      }
    });
    }


  }

  loadRate() {
    this._loadRate.getRatingById(this.gymId).subscribe({
      next: (res) => {
        this.rating = res.ratingValue;
        this.filledStars = Math.round(this.rating);
      }
    });
  }

  isRatedGym() {
    this._gymService.chechIfRated(this.gymId).subscribe({
      next: (res) => {
        this.isRated = res;
      }
    });
  }
  openUpdateModal() {
    if (this._Check.userData.getValue() === null) {
      this._loadRate.show("Please Login First", "light");
  }else{
        const dialogRef = this.dialog.open(UpdateRateComponent, {
      width: '600px',
      data: {
        type: 'gym',
        gymID: this.route.snapshot.paramMap.get('id')
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'update' || result === 'delete') {
        this.ngOnInit();
      }
    });
  }

  }



  ngOnInit(): void {

    this.gymId =Number(this.route.snapshot.paramMap.get('id'))
    if (this.gymId) {
      this._gymService.getGymById(this.gymId).subscribe({
        next: (data) => {
          this.gymName = data.gymName;
          this.coachName = data.coachFullName;
          this.averageRating = data.averageRating;
          // this.filledStars = Math.round(this.rating);
          this.Desctibtion=data.description;
          this.fortnightlyPrice=data.fortnightlyPrice;
          this.monthlyPrice=data.monthlyPrice;
          this.sessionPrice=data.sessionPrice;
          this.yearlyPrice=data.yearlyPrice
          this.gymImage = data.pictureUrl
          this.coachImage =data.coachProfilePictureUrl
          console.log(data);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

    this.loadRate();
    this.isRatedGym();
    this.getStatus();
  }


  follow() {
    if (this._Check.userData.getValue() === null) {
        this._loadRate.show("Please Login First", "light");
    } else {
      this._gymService.followGym(this.gymId).subscribe({
        next: (res) => {
          if (res.message.includes('You Now Follow')) {
            this.followed = true;
            this._loadRate.show(res.message, "light");
          }
        },
        error: (err) => console.error('Follow error:', err)
      });
    }
  }

  unfollow() {
    this._gymService.unfollowGym(this.gymId).subscribe({
      next: () =>{
        this.followed = false
        this._loadRate.show("you unfollowed this gym", "light");
      }
    });
  }

  getStatus() {
    this._gymService.getStatus(this.gymId).subscribe({
      next: (res) => {
        this.followed = res.isFollowing;
        console.log(res)
      }
    });
  }


  async payment(id: number) {
    const model = { onlineTrainingId: id };
    this._gymService.payment(model).subscribe({
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

  scrollToSection(sectionId: string, tabName: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.selectedTab = tabName;
  }

  products = [
    {
      image: 'assets/images/sneaker1.jpg',
      category: 'Sneakers',
      price: '$50.00',
      name: 'Ultra Grip Gym Shoes'
    },
    {
      image: 'assets/images/sneaker2.jpg',
      category: 'Sneakers',
      price: '$50.00',
      name: 'Ultra Grip Gym Shoes'
    },
    {
      image: 'assets/images/sneaker3.jpg',
      category: 'Sneakers',
      price: '$50.00',
      name: 'Ultra Grip Gym Shoes'
    },
    {
      image: 'assets/images/sneaker4.jpg',
      category: 'Sneakers',
      price: '$50.00',
      name: 'Ultra Grip Gym Shoes'
    }

  ];

  getLastThreePost(){
    this._gymService.getGymPosts(this.gymId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.post = res.data;

        }
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      }
    });

  }



}
