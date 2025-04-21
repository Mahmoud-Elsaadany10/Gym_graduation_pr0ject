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
      name: ['', [Validators.required]],
      governorate: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: [''],
    })

  }

  get name() {
    return this.shopInfoForm.get('name');
  }

  get governorate() {
    return this.shopInfoForm.get('governorate');
  }

  get city() {
    return this.shopInfoForm.get('city');
  }

  get address() {
    return this.shopInfoForm.get('address');
  }

  get phoneNumber() {
    return this.shopInfoForm.get('phoneNumber');
  }
  get description() {
    return this.shopInfoForm.get('description');
  }

  sendData(){
    this.shopInfoForm.value.phoneNumber = this.shopInfoForm.value.phoneNumber.toString()
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
