import { Component } from '@angular/core';
import { RoutSignUpComponent } from "../../Registration/rout-sign-up/rout-sign-up.component";
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SendDataService } from '../service/send-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-training-info',
  imports: [RouterModule, RouterModule, ReactiveFormsModule, CommonModule, RoutSignUpComponent],
  templateUrl: './training-info.component.html',
  styleUrl: './training-info.component.css'
})
export class TrainingInfoComponent {
  OnlineTrainingForm!: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private _send: SendDataService) {
    this.OnlineTrainingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      trainingType: ["", Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      noOfSessionsPerWeek: ['', [Validators.required, Validators.min(1)]],
      durationOfSession :['', [Validators.required, Validators.min(1)]]
    });
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

      console.log(trainingData)
      this._send.sendTrainingInfo(trainingData).subscribe({
        next: (response) => {
          if(response.coachID){
            this.router.navigate(["/logging/shopInfo"]);
          }

        },
        error: (err) => {
          console.error("Error sending data:", err);
        }
      });
    }
  }

}
