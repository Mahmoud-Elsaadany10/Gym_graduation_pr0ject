import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToasterComponent } from "./shared/toaster/toaster.component";
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent , SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Gym';
  constructor(private router: Router, private viewportScroller: ViewportScroller) {
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }
}
