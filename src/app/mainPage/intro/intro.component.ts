import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro',
  imports: [NavbarComponent , RouterModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class IntroComponent {

}
