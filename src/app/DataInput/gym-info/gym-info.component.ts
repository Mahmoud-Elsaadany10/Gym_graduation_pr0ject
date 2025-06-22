import { Component } from '@angular/core';
import { RoutSignUpComponent } from "../../Registration/rout-sign-up/rout-sign-up.component";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SendDataService } from '../service/send-data.service';
import { FooterComponent } from "../../shared/footer/footer.component";
import { RegistrationService } from '../../Registration/service/registration.service';

@Component({
  selector: 'app-gym-info',
  imports: [RoutSignUpComponent, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './gym-info.component.html',
  styleUrl: './gym-info.component.css'
})
export class GymInfoComponent {
  GymInfo!: FormGroup;

  constructor(private router: Router, private fbulider: FormBuilder
    ,private _send : SendDataService ,
    private _check :RegistrationService) {
    this.GymInfo = this.fbulider.group({
      gymName: ['', Validators.required],
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      monthlyPrice: ['', Validators.required],
      yearlyPrice: ['', Validators.required],
      sessionPrice: ['', Validators.required],
      fortnightlyPrice: ['', Validators.required],
      phoneNumber: ['', [Validators.required , Validators.minLength(11) ,Validators.pattern('^[0-9]+$')]],
      description: ['', Validators.required]
    });
  }

  // Getters for form controls
  get gymName() {
    return this.GymInfo.get('gymName');
  }

  get governorate() {
    return this.GymInfo.get('governorate');
  }

  get city() {
    return this.GymInfo.get('city');
  }

  get address() {
    return this.GymInfo.get('address');
  }

  get monthlyPrice() {
    return this.GymInfo.get('monthlyPrice');
  }

  get yearlyPrice() {
    return this.GymInfo.get('yearlyPrice');
  }

  get sessionPrice() {
    return this.GymInfo.get('sessionPrice');
  }

  get fortnightlyPrice() {
    return this.GymInfo.get('fortnightlyPrice');
  }

  get phoneNumber() {
    return this.GymInfo.get('phoneNumber');
  }

  get description() {
    return this.GymInfo.get('description');
  }
  sendData(){
    const gymModel ={...this.GymInfo.value}
    this._send.sendGymData(gymModel).subscribe({
      next :(reponse)=>{
        this.router.navigate(["/logging/traningInfo"])
      }
    })
  }
    skipForNow(){
    this._check.getCoachBusiness().subscribe({
      next: (response) => {
        if(!response.data.hasOnlineTrainng && response.data.hasShop){
          this.router.navigate(["/logging/traningInfo"]);
        }else if(!response.data.hasShop && response.data.hasOnlineTrainng){
          this.router.navigate(["/logging/shopInfo"]);
        }
        else{
          this.router.navigate(["/layout/home"]);
        }
      },
      error: (err) => {
        console.error("Error checking coach business:", err);
      }
    });
  }
}
