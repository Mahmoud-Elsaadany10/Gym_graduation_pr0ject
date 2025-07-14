import { Component, OnInit } from '@angular/core';
import { RoutSignUpComponent } from "../../Registration/rout-sign-up/rout-sign-up.component";
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SendDataService } from '../service/send-data.service';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../Registration/service/registration.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-training-info',
  imports: [RouterModule, RouterModule, ReactiveFormsModule, CommonModule, RoutSignUpComponent],
  templateUrl: './training-info.component.html',
  styleUrl: './training-info.component.css'
})
export class TrainingInfoComponent implements OnInit {
  OnlineTrainingForm!: FormGroup;
  hasShop : boolean =false

  constructor(private router: Router, private fb: FormBuilder
    , private _send: SendDataService ,
     private _check : RegistrationService) {
    this.OnlineTrainingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      trainingType: ["", Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      noOfSessionsPerWeek: ['', [Validators.required, Validators.min(1)]],
      durationOfSession :['', [Validators.required, Validators.min(1)]]
    });
  }
  ngOnInit(): void {

  }

  get trainingType() {
    return this.OnlineTrainingForm.get('trainingType');
  }

  get price() {
    return this.OnlineTrainingForm.get('price');
  }
  get durationOfSession() {
    return this.OnlineTrainingForm.get('durationOfSession');
  }

  get noOfSessionsPerWeek() {
    return this.OnlineTrainingForm.get('noOfSessionsPerWeek');
  }


  get title() {
    return this.OnlineTrainingForm.get('title');
  }

  get description() {
    return this.OnlineTrainingForm.get('description');
  }

  onSubmit() {
    if (this.OnlineTrainingForm.valid) {

      const trainingData = { ...this.OnlineTrainingForm.value };

      this._send.sendTrainingInfo(trainingData).pipe(
    switchMap((response) => {
      if (response.coachID) {
        return this._check.getCoachBusiness();
      } else {
        this.router.navigate(["/layout/home"])
        return of(null);
      }
    })
      ).subscribe({
        next :(featuresResponse)=>{
            if(!featuresResponse?.data.hasShop){
              this.router.navigate(["/logging/shopInfo"])
            }else{
              this.router.navigate(["/layout/home"]);
            }
        }
      })
    }
  }

  skipForNow(){
    this._check.getCoachBusiness().subscribe({
      next: (response) => {
        this.hasShop =response.data.hasShop

        if(!response.data.hasShop){
          this.router.navigate(["/logging/shopInfo"]);
        }else{
          this.router.navigate(["/layout/home"]);
        }
      },
      error: (err) => {
        console.error("Error checking coach business:", err);
      }
    });
  }

}
