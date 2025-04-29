import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../service/profile.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { OnlineTrainingForm } from '../../Model/Models';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../shared/services/shared.service';

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
  isEidtShop: boolean = false;
  isEditOnlineTrainingMode: boolean = false
  updateGymInfo!: FormGroup;
  UpdateOnlineTrainingInfo!: FormGroup;
  gymId :number = 0
  onlineTrainingId:number =0
  updateShopInfo!: FormGroup;
  shopId : number = 0
  gymImage : string |null = ''
  coachImage :string | null =""
  shopImage : string | null =""


  constructor(private fbulider: FormBuilder ,
    private _profileServer: ProfileService ,
    private modalService: NgbModal ,
    private toastService: SharedService)

    {
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
      title: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      trainingType: [{ value: '', disabled: true }],
      price: [{ value: '', disabled: true }],
      noOfSessionsPerWeek: [{ value: '', disabled: true }],
      durationOfSession: [{ value: '', disabled: true }]
    });

    this.updateShopInfo = this.fbulider.group({
      shopName: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      governorate: [{ value: '', disabled: true }],
      city: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }]
    });




  }



  ngOnInit(): void {
    this.getCoachInfo();
    this.getGymInfo()
    this.getOnlineTrainingInfo()
    this.getShopDetails()
  }

  openPasswordModal() {
    this.modalService.open(ChangePasswordComponent, { centered: true });
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
  enableShopEdit(){
    this.isEidtShop = true;
    this.updateShopInfo.enable();
  }

  getCoachInfo() {
    this._profileServer.getCoachInfo().subscribe({
      next: (coach) => {
        this.coachImage = coach.profilePictureUrl
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
          this.toastService.show("Profile Updated Successfully", "light");
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
        this.gymImage = gym.pictureUrl
      },
      error: (err) => {
        console.error('Failed to load gym info:', err);
      }
    });
  }


  GymUpdate(){
    this._profileServer.UpdateGymInfo(this.updateGymInfo.value , this.gymId).subscribe({
      next: (res) => {
        this.updateGymInfo.disable();
        this.isEidtGymMode = false;
        this.toastService.show("Gym Info Updated Successfully", "light");
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
        next: () => {
          this.isEditOnlineTrainingMode = false;
          this.UpdateOnlineTrainingInfo.disable();
          this.toastService.show("Online Training Info Updated Successfully", "light");
        },
        error: (err) => {
          console.error('Error updating online training info:', err);
        }
      });
    }
  }

  getShopDetails() {
    this._profileServer.getShopInfo().subscribe({
      next: (res) => {
        console.log(res)
        this.shopImage = res.data[0].pictureUrl
        this.shopId = res.data[0].shopId
        this.updateShopInfo.patchValue({
          shopName: res.data[0].shopName,
          phoneNumber: res.data[0].phoneNumber,
          governorate: res.data[0].governorate,
          city: res.data[0].city,
          description: res.data[0].description
        });
      },
      error: (err) => {
        console.error('Failed to load shop details:', err);
      }
    });
  }

  updateShop(){

    this._profileServer.updateShopInfo(this.shopId,this.updateShopInfo.value).subscribe({
      next: () => {
        this.updateShopInfo.disable();
        this.isEidtShop = false;
        this.toastService.show("Shop Info Updated Successfully", "light");
      }
    })
  }

}
