import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/service/profile.service';
import { coachProfile } from '../../Model/Models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coach',
  imports: [CommonModule],
  templateUrl: './coach.component.html',
  styleUrl: './coach.component.css'
})
export class CoachComponent implements OnInit{
  coachImage :string | null = null;
  coachInfo: coachProfile | null = null;

  constructor(private _ProfileService: ProfileService ,
    private _router: Router
  ) {

  }
  ngOnInit(): void {
    this.getCoachInfo();

  }

  getCoachInfo() {
    this._ProfileService.getCoachInfo().subscribe({
      next: (coach) => {
        this.coachInfo = {
          ...coach,
          dateOfBirth: new Date(coach.dateOfBirth).toISOString().split('T')[0]
        };

        this.coachImage = coach.profilePictureUrl
          ? coach.profilePictureUrl + '?t=' + new Date().getTime()
          : null;

        console.log(this.coachInfo);
      },
      error: (err) => {
        console.error('Failed to load profile info:', err);
      }
    });
  }

  goToProfile(){
    this._router.navigate(['/layout/profile']);
  }

}
