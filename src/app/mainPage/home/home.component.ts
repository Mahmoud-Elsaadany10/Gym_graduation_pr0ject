import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { AboutUsComponent } from "../about-us/about-us.component";
import { IntroComponent } from "../intro/intro.component";
import { FitnessProgramsComponent } from "../fitness-programs/fitness-programs.component";
import { WhyChooseFitnessComponent } from "../why-choose-fitness/why-choose-fitness.component";
import { ClassesComponent } from "../classes/classes.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [AboutUsComponent, IntroComponent, FitnessProgramsComponent, WhyChooseFitnessComponent, ClassesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
