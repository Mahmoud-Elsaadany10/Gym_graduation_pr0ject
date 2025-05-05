import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from "./shared/toaster/toaster.component";
import { SpinnerComponent } from './shared/spinner/spinner.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent , SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Gym';
}
