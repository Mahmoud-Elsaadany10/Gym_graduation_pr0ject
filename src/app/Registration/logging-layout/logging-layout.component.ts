import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarLoggingComponent } from "../navbar-logging/navbar-logging.component";

@Component({
  selector: 'app-logging-layout',
  imports: [RouterOutlet],
  templateUrl: './logging-layout.component.html',
  styleUrl: './logging-layout.component.css'
})
export class LoggingLayoutComponent {

}
