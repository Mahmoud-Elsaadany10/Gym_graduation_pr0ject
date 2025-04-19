import { Component, OnDestroy, OnInit } from '@angular/core';
import { GymService } from '../service/gym.service';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { gym } from '../../Model/Models';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-gym',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule, NavbarComponent],
  templateUrl: './gym.component.html',
  styleUrls: ['./gym.component.css']
})
export class GymComponent implements OnInit , OnDestroy {

  stars = Array(5).fill(0);
  gyms: gym[] = [];
  page: number = 1;
  pageSize: number = 9;
  dynamicMaxSize: number=5;
  totalGym: number = 0;
  GymName:string =""
  hide :boolean = false
  gymSubscription :Subscription | null = null
  searchSubscription :Subscription | null = null


  constructor(private gymData: GymService) {}

  ngOnDestroy() {
    this.gymSubscription?.unsubscribe()
    this.searchSubscription?.unsubscribe()
  }

  ngOnInit() {
    this.getgymByPage();
    this.hide =true
  }

  getgymByPage() {
    this.gymSubscription= this.gymData.getGymByPge(this.page).subscribe({
      next: (response) => {
        if (response) {
          this.gyms = response.data
          this.totalGym = response.totalRecords
          console.log('Gym data:', this.gyms);
        }
      },
      error: (err) => console.error('Error fetching gyms:', err)
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.getgymByPage();
    this.scrollToTop()
  }

  scrollToTop(){
    window.scrollTo({behavior:'smooth',top:0})
  }

  searchGym(){
    this.searchSubscription =this.gymData.searchGym(this.GymName).subscribe({
      next:(response)=>{
          if(response){
            this.gyms =response.data
            this.totalGym = response.totalRecords
            this.hide =false
            this.dynamicMaxSize = this.gyms.length > 3 ? 5 : this.gyms.length;
            this.page = 1;
          }
      }
    })
  }
  showButton(){
    this.hide =false
  }
  onClickButton(){
    this.getgymByPage()
    this.page=1
    this.GymName=''
    this.hide=true
  }
}
