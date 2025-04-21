import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../service/profile.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { OnlineTrainingForm } from '../../Model/Models';

@Component({
  selector: 'app-profile',
  imports: [NavbarComponent , ReactiveFormsModule , CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  CoachInfo!: FormGroup;
  isEditMode: boolean = false;
  isEidtGymMode: boolean = false;
  isEditOnlineTrainingMode: boolean = false
  updateGymInfo!: FormGroup;
  UpdateOnlineTrainingInfo!: FormGroup;
  gymId :number = 0
  onlineTrainingId:number =0

  constructor(private fbulider: FormBuilder , private _profileServer: ProfileService) {
    this.CoachInfo = this.fbulider.group({
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],
      dateOfBirth: [{ value: '', disabled: true }],
      bio: [{ value: '', disabled: true }],
    });
    this.updateGymInfo = this.fbulider.group({
      gymName: [{ value: '', disabled: true }],
      governorate: [{ value: '', disabled: true }],
      city: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      monthlyPrice: [{ value: '', disabled: true }],
      yearlyPrice: [{ value: '', disabled: true }],
      sessionPrice: [{ value: '', disabled: true }],
      fortnightlyPrice: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }]
    });
    this.UpdateOnlineTrainingInfo = this.fbulider.group({
      title: [''],
      description: [''],
      trainingType: [''],
      price: [''],
      noOfSessionsPerWeek: [''],
      durationOfSession: ['']
    });




  }



  ngOnInit(): void {
    this.getCoachInfo();
    this.getGymInfo()
    this.getOnlineTrainingInfo()
  }
  enableEdit(){
    this.isEditMode = true;
    this.CoachInfo.enable();
  }
  enableGymEdit(){
    this.isEidtGymMode = true;
    this.updateGymInfo.enable();
  }
  enableOnlinttainingEdit(){
    this.isEditOnlineTrainingMode = true;
    this.UpdateOnlineTrainingInfo.enable();
  }

  getCoachInfo() {
    this._profileServer.getCoachInfo().subscribe({
      next: (coach) => {
        this.CoachInfo.patchValue({
          firstName: coach.firstName,
          lastName: coach.lastName,
          gender: coach.gender,
          bio: coach.bio,
          dateOfBirth: coach.dateOfBirth
        });
      },
      error: (err) => {
        console.error('Failed to load profile info:', err);
      }
    });
  }

  UpdateCoachInfo() {
    if (this.CoachInfo.valid) {
      this._profileServer.UpdateCoachInfo(this.CoachInfo.value).subscribe({
        next: (res) => {
          console.log('Profile updated successfully:', res);
          this.CoachInfo.disable();
          this.isEditMode = false;
        },
        error: (err) => {
          console.error('Error updating profile:', err);
        }
      });
    }
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
  getGymInfo() {
    this._profileServer.getGymInfo(this.getCoachId()).subscribe({
      next: (gym) => {
        this.updateGymInfo.patchValue({
          gymName: gym.gymName,
          phoneNumber: gym.phoneNumber,
          governorate: gym.governorate,
          city: gym.city,
          address: gym.address,
          yearlyPrice: gym.yearlyPrice,
          monthlyPrice: gym.monthlyPrice,
          sessionPrice: gym.sessionPrice,
          fortnightlyPrice: gym.fortnightlyPrice,
          description: gym.description
        });
        this.gymId = gym.gymID
      },
      error: (err) => {
        console.error('Failed to load gym info:', err);
      }
    });
  }


  GymUpdate(){
    // const gymInfo = {this.UpdateCoachInfo.value , this.gymId}
    this._profileServer.UpdateGymInfo(this.updateGymInfo.value , this.gymId).subscribe({
      next: (res) => {
        // console.log('Gym info updated successfully:', res);
        this.updateGymInfo.disable();
        this.isEidtGymMode = false;
      },
      error: (err) => {
        console.error('Error updating gym info:', err);
      }
    })
  }

  getOnlineTrainingInfo() {
    this._profileServer.getCoachById(this.getCoachId()).subscribe({
      next: (res) => {
        console.log(res.data)
        this.onlineTrainingId = res.data.onlineTrainings[0].id
          this.UpdateOnlineTrainingInfo.patchValue({
          title: res.data.onlineTrainings[0].title,
          description: res.data.onlineTrainings[0].description,
          trainingType: res.data.onlineTrainings[0].trainingType,
          price: res.data.onlineTrainings[0].price,
          noOfSessionsPerWeek: res.data.onlineTrainings[0].noOfSessionsPerWeek,
          durationOfSession: res.data.onlineTrainings[0].durationOfSession
        });
      },
      error: (err) => {
        console.error('Failed to load online training info:', err);
      }
    });
  }
  updateOnlineTraining() {
    if (this.UpdateOnlineTrainingInfo.valid) {

      this._profileServer.UpdateOnlineTraining(this.UpdateOnlineTrainingInfo.value , this.onlineTrainingId).subscribe({
        next: (res) => {
          this.isEditOnlineTrainingMode = false;
          this.UpdateOnlineTrainingInfo.disable();
        },
        error: (err) => {
          console.error('Error updating online training info:', err);
        }
      });
    }
  }

}
