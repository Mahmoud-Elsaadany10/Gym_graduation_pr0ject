import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { OnlineTrainingService } from '../service/online-training.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { coachDetails, TrainingSession } from '../../Model/Models';
import { RegistrationService } from '../../Registration/service/registration.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../shared/services/shared.service';
import { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-coach-details',
  standalone: true,
  imports: [NavbarComponent, CommonModule, NgbToastModule ,RouterModule],
  templateUrl: './coach-details.component.html',
  styleUrl: './coach-details.component.css'
})
export class CoachDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
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

  stars = Array(5).fill(0);

  constructor(
    private _getDetails: OnlineTrainingService,
    private activeRoute: ActivatedRoute,
    private _Check: RegistrationService,
    private stripeService: SharedService ,
    private _toast: SharedService
  ) {}

  ngOnInit(): void {
    this.getCoachById();
    this.getGroupTrainingById();
  }

  async ngAfterViewInit() {
    this.stripe = await this.stripeService.getStripe(); // ✅ consistent instance
    if (this.stripe) {
      this.elements = this.stripe.elements();
      const card = this.elements.create('card');
      card.mount('#card-element');
      this.cardElement = card;
    }
  }

  ngOnDestroy(): void {
    if (this.cardElement) {
      this.cardElement.unmount();
    }
  }

  getCoachById() {
    this.id = this.activeRoute.snapshot.paramMap.get("id")!;
    this._getDetails.getCoachById(this.id).subscribe({
      next: (coachDetail) => {
        this.coachDtd = coachDetail.data;
        console.log(this.coachDtd);
      },
      error: (err) => {
        console.error('Error fetching coach details:', err);

      }
    });
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
        this._toast.show("all Done", "light");
      }
    });
  }

  getGroupTrainingById() {
    this._getDetails.getGroupTrainingById(this.id).subscribe({
      next: (res) => this.trainingType = res
    });
  }

  getPrivateTrainingById() {
    this._getDetails.getPrivateTrainingById(this.id).subscribe({
      next: (res) => this.trainingType = res
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
