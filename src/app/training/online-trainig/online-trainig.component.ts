import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OnlineTrainingService } from '../service/online-training.service';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Trainer } from '../../Model/Models';
import { Subscription } from 'rxjs';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-online-trainig',
  imports: [CommonModule,RouterModule, FormsModule, NgbPaginationModule, NavbarComponent],
  templateUrl: './online-trainig.component.html',
  styleUrl: './online-trainig.component.css'
})
export class OnlineTrainigComponent implements OnInit , OnDestroy{
  coachs :Trainer[] = []
  stars = Array(5).fill(0);
  page :number = 1
  pageSize :number = 9
  dynamicMaxSize :number = 5
  totalCoach :number = 0
  coachName :string = ""
  hide :boolean = false
  loading :boolean = false
  coachSubscription :Subscription | null = null
  searchSubscription :Subscription | null = null

  constructor(private _onlineTrainingService : OnlineTrainingService) {}
  ngOnDestroy(): void {
    this.coachSubscription?.unsubscribe()
    this.searchSubscription?.unsubscribe()
  }

  ngOnInit(): void {
    this.getCoachByPage()
    this.hide = true
    this.loading = true

  }

  getCoachByPage(){
  this.coachSubscription = this._onlineTrainingService.getCoachByPage(this.page).subscribe({
      next : (response) => {
        if(response){
          this.coachs = response.data
          this.totalCoach = response.totalRecords
          this.loading = false

        }
      },
      error : (err) => {console.error('Error fetching coaches:', err)
        this.loading = false
      }

    });
  }
  searchCoach(){
    this.searchSubscription =this._onlineTrainingService.searchCoach(this.coachName).subscribe({
      next : (response) => {
        if(response){
          this.coachs = response.data
          this.totalCoach = response.totalRecords
          this.hide =false
          this.dynamicMaxSize = this.coachs.length > 3 ? 5 : this.coachs.length;
          this.page = 1;
        }
      },
      error : (err) => console.error('Error fetching coaches:', err)
  })}
  onPageChange(newPage: number) {
    this.page = newPage;
    this.getCoachByPage();
    this.scrollToTop()
  }

  scrollToTop(){
    window.scrollTo({behavior:'smooth',top:0})
  }
  showButton(){
    this.hide =false
  }
  onClickButton(){
    this.getCoachByPage()
    this.page=1
    this.coachName=''
    this.hide=true
  }


}
