import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { CommonModule, NgFor } from '@angular/common';
import { AddRateComponent } from '../../shared/add-rate/add-rate.component';


@Component({
  standalone: true,
  selector: 'app-gym-details',
  imports: [ NgFor, CommonModule],
  templateUrl: './gym-details.component.html',
  styleUrl: './gym-details.component.css'
})
export class GymDetailsComponent implements OnInit {
  gymId: number | null = null;

  selectedTab: string = 'Description'; // مبدئيا Description هو اللي active
  constructor(private route: ActivatedRoute,private dialog: MatDialog) {
  }
  openRateModal() {
    this.dialog.open(AddRateComponent, {
      width: '600px',

    });
  }
  ngOnInit(): void {
    const gymId = this.route.snapshot.paramMap.get('id');
    console.log('Gym ID from URL:', gymId);

    // تستخدمي gymId تنادي الـ API بتاع تفاصيل الجيم
  }


  scrollToSection(sectionId: string, tabName: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.selectedTab = tabName;
  }

  products = [
    {
      image: 'assets/images/sneaker1.jpg',
      category: 'Sneakers',
      price: '$50.00',
      name: 'Ultra Grip Gym Shoes'
    },
    {
      image: 'assets/images/sneaker2.jpg',
      category: 'Sneakers',
      price: '$50.00',
      name: 'Ultra Grip Gym Shoes'
    },
    {
      image: 'assets/images/sneaker3.jpg',
      category: 'Sneakers',
      price: '$50.00',
      name: 'Ultra Grip Gym Shoes'
    },
    {
      image: 'assets/images/sneaker4.jpg',
      category: 'Sneakers',
      price: '$50.00',
      name: 'Ultra Grip Gym Shoes'
    }
    // ممكن تزودي منتجات زي ما تحبي
  ];

  posts = [
    {
      title: "Want to start Yoga? Here’s How",
      image: "assets/posts/yoga.png",
      date: new Date("2024-12-05")
    },
    {
      title: "A Guide to Boxing – The most exiting sport!",
      image: "assets/posts/boxing.png",
      date: new Date("2024-12-05")
    },
    {
      title: "Quick workout recovery tips",
      image: "assets/posts/workout.png",
      date: new Date("2024-12-05")
    }
  ];

}
