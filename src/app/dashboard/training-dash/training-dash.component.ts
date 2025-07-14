import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../profile/service/profile.service';
import { DashboardService } from '../service/dashboard.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingProfile } from '../../Model/Models';
import { SendDataService } from '../../DataInput/service/send-data.service';

@Component({
  selector: 'app-training-dash',
  imports: [CommonModule, FormsModule ,ReactiveFormsModule],
  templateUrl: './training-dash.component.html',
  styleUrl: './training-dash.component.css'
})
export class TrainingDashComponent implements OnInit {

  trainingData :TrainingProfile | null = null;
    OnlineTrainingForm!: FormGroup;
  @ViewChild('deleteModal') deleteModal: any;

  onlineTrainingId: number = 0
  trainingIdToDelete: number = 0
  currentModalRef: any;


    constructor(private _profileServer: ProfileService
        , private _dashboardService: DashboardService ,
         private fb: FormBuilder
        , private _router: Router ,
      private modalService: NgbModal,
      private _send: SendDataService,
      private _sharedService: SharedService) {
      this.OnlineTrainingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      trainingType: ["", Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      noOfSessionsPerWeek: ['', [Validators.required, Validators.min(1)]],
      durationOfSession :['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.getOnlineTrainingInfo();

  }

  get trainingType() {
    return this.OnlineTrainingForm.get('trainingType');
  }

  get price() {
    return this.OnlineTrainingForm.get('price');
  }
  get durationOfSession() {
    return this.OnlineTrainingForm.get('durationOfSession');
  }

  get noOfSessionsPerWeek() {
    return this.OnlineTrainingForm.get('noOfSessionsPerWeek');
  }


  get title() {
    return this.OnlineTrainingForm.get('title');
  }

  get description() {
    return this.OnlineTrainingForm.get('description');
  }

addNewTraining() {
  if (this.OnlineTrainingForm.valid) {
    const modalRef = this.modalService.open(this.OnlineTrainingForm, { size: 'lg', centered: true });
    this.currentModalRef = modalRef;
  }
}


onSubmit() {
  if (this.OnlineTrainingForm.valid) {
    const trainingData = { ...this.OnlineTrainingForm.value };
    console.log(trainingData);

    this._send.sendTrainingInfo(trainingData).subscribe({
      next: (response) => {
        this._sharedService.show("Online training added successfully", "light");
        if (this.currentModalRef) {
          this.currentModalRef.close();
        }
        this.getOnlineTrainingInfo();
      },
      error: (err) => {
        console.error("Error sending data:", err);
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


    getOnlineTrainingInfo() {
    this._profileServer.getCoachById(this.getCoachId()).subscribe({
      next: (res) => {
        console.log(res.data)
        this.onlineTrainingId = res.data.onlineTrainings[0].id
        this.trainingData = res.data

      },
      error: (err) => {
        console.error('Failed to load online training info:', err);
      }
    });
  }

  editTraining() {
    this._router.navigate(['/layout/profile']);
  }

  openDeleteModal(id: number | undefined, content: any) {
    if (id) {
      this.trainingIdToDelete = id;
      this.modalService.open(content);
    }
  }




  confirmDelete(modal: any) {
    this._dashboardService.deleteOnlineTraining(this.onlineTrainingId).subscribe({
      next: () => {
        this._sharedService.show("Online training deleted successfully", "light");
        this._router.navigate(['/layout/dashboard/profile']);

        modal.close();
      },
      error: (err) => {
        console.error('Failed to delete gym:', err);
      }
    });
  }

  getDetailsOfSubsriber(id:number){
    this._dashboardService.getOnlinetrainingDetails(id).subscribe({
      next :(res)=>{
        console.log(res)
      }
    })
  }



}
