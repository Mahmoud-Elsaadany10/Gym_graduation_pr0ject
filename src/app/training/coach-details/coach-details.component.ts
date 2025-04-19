import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { OnlineTrainingService } from '../service/online-training.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { coachDetails } from '../../Model/Models';
import { RegistrationService } from '../../Registration/service/registration.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-coach-details',
  imports: [NavbarComponent,CommonModule , NgbToastModule],
  templateUrl: './coach-details.component.html',
  styleUrl: './coach-details.component.css'
})
export class CoachDetailsComponent implements OnInit {
  id :string  =''
  followed : boolean =false
  coachDtd :coachDetails | null= null
  list : any=4
  isTrue: boolean =false;
  toastMessage: string = "";
  showToast: boolean =false;
  constructor(private _getDetails : OnlineTrainingService ,
    private activeRoute: ActivatedRoute ,
  private _Check : RegistrationService){}
  ngOnInit(): void {
    this.getCoachById()
  }
  getCoachById(){
    this.id = this.activeRoute.snapshot.paramMap.get("id")!
    this._getDetails.getCoachById(this.id).subscribe({
      next :(coachDetail)=>{
        this.coachDtd = coachDetail.data
        console.log(this.coachDtd)
      }
    })
  }
  follow(){
    if(this._Check.userData.getValue() === null){
      this.isTrue =false
      this.toastMessage = `you need to login first`;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);

    }else{

    this._getDetails.followCoach(this.id).subscribe({
      next: (res) => {
        if(res.message.includes('You Now Follow')){
        console.log('Follow response:', res);
        this.followed = true;
      }
      },
      error: (err) => {
        console.error('Follow error:', err);
      }
    })
    }
;
  }

  unfollow(){
    this._getDetails.unfollowCoach(this.id).subscribe({
      next : (res)=>{
        this.followed = false
      }
    })
  }
}

