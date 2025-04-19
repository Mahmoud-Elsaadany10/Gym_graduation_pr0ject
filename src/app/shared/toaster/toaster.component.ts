import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toaster',
  imports: [CommonModule,NgbToastModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css'
})
export class ToasterComponent {
  constructor( public toastService: SharedService){

  }
  closeToast() {
    this.toastService.showToast = false;
  }
}
