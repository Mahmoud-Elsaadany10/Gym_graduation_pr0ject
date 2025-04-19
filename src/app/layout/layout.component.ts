import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from "../shared/footer/footer.component";


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
