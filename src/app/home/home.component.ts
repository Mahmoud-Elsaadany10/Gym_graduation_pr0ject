import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-home',
  imports: [MatCardModule,NgbAlertModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class homeComponent {

}
