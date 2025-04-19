import { Component } from '@angular/core';
import { RoutSignUpComponent } from "../../Registration/rout-sign-up/rout-sign-up.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop-info',
  imports: [RoutSignUpComponent ,RouterModule],
  templateUrl: './shop-info.component.html',
  styleUrl: './shop-info.component.css'
})
export class ShopInfoComponent {

}
