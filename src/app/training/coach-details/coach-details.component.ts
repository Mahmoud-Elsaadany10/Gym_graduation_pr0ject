import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { OnlineTrainingService } from '../service/online-training.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { coachDetails, TrainingSession } from '../../Model/Models';
import { RegistrationService } from '../../Registration/service/registration.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { jwtDecode } from 'jwt-decode';

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
  trainingType : TrainingSession[]=[]

  constructor(private _getDetails : OnlineTrainingService ,
    private activeRoute: ActivatedRoute ,
  private _Check : RegistrationService){}
  ngOnInit(): void {
    this.getCoachById()
    this.getGroupTrainingById()
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
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  getCoachId(){
    const token = this.getToken()
    if(token){
      const decodedToken: any = jwtDecode(token);
      const coachId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return coachId
    }
    }

  getGroupTrainingById(){
    this._getDetails.getGroupTrainingById(this.getCoachId()).subscribe({
      next : (res)=>{
        this.trainingType = res
      }
    })
  }
  getPrivateTrainingById(){
    this._getDetails.getPrivateTrainingById(this.getCoachId()).subscribe({
      next : (res)=>{
        this.trainingType = res
      }
    })
  }
  onTrainingTypeChange(event: any) {
    const selectedValue = event.target.value;

    if (selectedValue === 'Group') {
      this.getGroupTrainingById();
    } else if (selectedValue === 'Private') {
      this.getPrivateTrainingById();
    }
  }
}

