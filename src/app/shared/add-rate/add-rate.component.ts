import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-add-rate',
  imports: [FormsModule,NgFor],
  templateUrl: './add-rate.component.html',
  styleUrl: './add-rate.component.css',
  standalone: true, // ✅ أضف ده

})
export class AddRateComponent {
  rating: number = 0;
  hovered: number = 0;
  comment: string = '';
  stars: number[] = [1, 2, 3, 4, 5];
  

  constructor(private dialogRef: MatDialogRef<AddRateComponent>) {}

  setRating(value: number) {
    this.rating = value;
  }

  hoverRating(value: number) {
    this.hovered = value;
  }

  submitRating() {
    console.log('Rating:', this.rating);
    console.log('Comment:', this.comment);
    this.dialogRef.close();
  }
}