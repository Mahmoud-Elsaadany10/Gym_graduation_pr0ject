import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RouterModule, Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-rout-sign-up',
  imports: [RouterModule, FormsModule, CommonModule] ,
  templateUrl: './rout-sign-up.component.html',
  styleUrls: ['./rout-sign-up.component.css']
})
export class RoutSignUpComponent implements OnInit {
  isCoach: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.checkRoute(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.url);
      });
  }


  private checkRoute(url: string): void {
    this.isCoach = url === '/logging/shopInfo'
    || url === '/logging/gymInfo' ||
    url === '/logging/traningInfo';
  }
}
