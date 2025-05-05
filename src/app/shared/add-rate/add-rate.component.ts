import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-add-rate',
  imports: [FormsModule,NgFor],
  templateUrl: './add-rate.component.html',
  styleUrl: './add-rate.component.css',
  standalone: true,

})
export class AddRateComponent {
  rating: number = 0;
  hovered: number = 0;
  comment: string = '';
  stars: number[] = [1, 2, 3, 4, 5];


  constructor(private dialogRef: MatDialogRef<AddRateComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private gymServices: SharedService) {}

  setRating(value: number) {
    this.rating = value;
  }

  hoverRating(value: number) {
    this.hovered = value;
  }

  submitRating() {
    const payload: any = {
      ratingValue: this.rating,
      review: this.comment,
    };

    if (this.data.type === 'gym') {
      payload.gymID = this.data.gymID;
      this.gymServices.sendRating(payload).subscribe({
        next: res => {
          this.dialogRef.close("sendRate");
        },
        error: err => console.error('Gym rating error:', err)
      });
    }
    else if (this.data.type === 'training') {
      payload.coachId = this.data.coachId;
      this.gymServices.sendTrainingRating(payload).subscribe({
        next: res => {
          console.log('Training rating sent:', res);
          this.dialogRef.close("sended");
        },
        error: err => console.error('Training rating error:', err)
      });
    }
  }


}
