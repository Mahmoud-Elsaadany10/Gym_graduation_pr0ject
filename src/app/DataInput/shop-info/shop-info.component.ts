import { Component } from '@angular/core';
import { RoutSignUpComponent } from "../../Registration/rout-sign-up/rout-sign-up.component";
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SendDataService } from '../service/send-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-info',
  imports: [RoutSignUpComponent ,RouterModule ,ReactiveFormsModule ,CommonModule],
  templateUrl: './shop-info.component.html',
  styleUrl: './shop-info.component.css'
})
export class ShopInfoComponent {
  shopInfoForm !:FormGroup
  constructor(
    private fbuilder: FormBuilder,
    private _send : SendDataService ,
    private router: Router
  ) {
    this.shopInfoForm = this.fbuilder.group({
      ShopName: ['', [Validators.required]],
      Governorate: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      ImageUrl: [''],
    })

  }

  get ShopName() {
    return this.shopInfoForm.get('ShopName');
  }

  get Governorate() {
    return this.shopInfoForm.get('Governorate');
  }

  get City() {
    return this.shopInfoForm.get('City');
  }

  get Address() {
    return this.shopInfoForm.get('Address');
  }

  get phoneNumber() {
    return this.shopInfoForm.get('PhoneNumber');
  }
  get Description() {
    return this.shopInfoForm.get('Description');
  }

  sendData(){
    this.shopInfoForm.value.PhoneNumber = this.shopInfoForm.value.PhoneNumber.toString()
    if (this.shopInfoForm.valid) {
      console.log(this.shopInfoForm.value);
      this._send.sendShopInfo({...this.shopInfoForm.value}).subscribe({
        next: (res) => {
          if(res.isSuccess){
          this.router.navigate(['/layout/home']);
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      console.log('Form is invalid');
    }
  }


}
