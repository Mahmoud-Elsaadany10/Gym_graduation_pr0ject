import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-rate',
  templateUrl: './update-rate.component.html',
  styleUrls: ['./update-rate.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class UpdateRateComponent implements OnInit {
  rating: number = 0;
  hovered: number = 0;
  comment: string = '';
  stars: number[] = [1, 2, 3, 4, 5];
  isEditable: boolean = false;
  ratingId!: number | string;

  constructor(
    private dialogRef: MatDialogRef<UpdateRateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _Rate: SharedService
  ) {
    this.ratingId = data.type === 'gym' ? data.gymID : data.coachId;
  }

  ngOnInit(): void {
    if (this.data.type === 'gym') {
      this._Rate.getRatingById(this.ratingId as number).subscribe((rating) => {
        this.rating = rating.ratingValue;
        this.comment = rating.review;
      });
    } else if (this.data.type === 'training') {
      this._Rate.getTrainingRatingById(this.ratingId as string).subscribe((rating) => {
        this.rating = rating.ratingValue;
        this.comment = rating.review;
      });
    }
  }

  setRating(value: number) {
    if (this.isEditable) {
      this.rating = value;
    }
  }

  hoverRating(value: number) {
    if (this.isEditable) {
      this.hovered = value;
    }
  }

  editRating() {
    this.isEditable = true;
  }

  submitRating() {
    const payload = {
      ratingValue: this.rating,
      review: this.comment
    };

    if (this.data.type === 'gym') {

      this._Rate.UpdateRating(payload, this.ratingId as number).subscribe({
        next: (res) => {
          console.log('Gym rating updated:', res);
          this.dialogRef.close("update");
        },
        error: (err) => console.error('Error updating gym rating:', err)
      });
    } else if (this.data.type === 'training') {
      this._Rate.updateTrainingRating(payload, this.ratingId as string).subscribe({
        next: (res) => {
          console.log('Training rating updated:', res);
          this.dialogRef.close('updated');
        },
        error: (err) => console.error('Error updating training rating:', err)
      });
    }
  }

  deleteRating() {
    if (this.data.type === 'gym') {
      this._Rate.deleteRating(this.ratingId as number).subscribe({
        next: () => this.dialogRef.close("delete"),
        error: (err) => console.error('Error deleting gym rating:', err)
      });
    } else if (this.data.type === 'training') {
      this._Rate.deleteTrainingRating(this.ratingId as string).subscribe({
        next: () => this.dialogRef.close("deleted"),
        error: (err) => console.error('Error deleting training rating:', err)
      });
    }
  }
}
