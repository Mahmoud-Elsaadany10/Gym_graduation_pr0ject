import { Routes } from '@angular/router';
import { LoginComponent } from './Registration/login/login.component';

import { SignupUserComponent } from './Registration/signup-user/signup-user.component';
import { SignupCoachComponent } from './Registration/signup-coach/signup-coach.component';
import { Component } from '@angular/core';
import { LoggingLayoutComponent } from './Registration/logging-layout/logging-layout.component';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForgetPasswordComponent } from './Registration/forget-password/forget-password.component';
import { PasswordVerificationComponent } from './Registration/password-verification/password-verification.component';
import { ResetPasswordComponent } from './Registration/reset-password/reset-password.component';
import { AllDoneComponent } from './Registration/all-done/all-done.component';
import { GymInfoComponent } from './DataInput/gym-info/gym-info.component';
import { TrainingInfoComponent } from './DataInput/training-info/training-info.component';
import { ShopInfoComponent } from './DataInput/shop-info/shop-info.component';
import { VerifyEmailComponent } from './Registration/verify-email/verify-email.component';
import { GymComponent } from './gymComponent/gym/gym.component';
import { OnlineTrainigComponent } from './training/online-trainig/online-trainig.component';
import { HomeComponent } from './mainPage/home/home.component';
import { CoachDetailsComponent } from './training/coach-details/coach-details.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { GymDetailsComponent } from './gymComponent/gym-details/gym-details.component';
import { ChatComponent } from './chat/chat/chat.component';
import { roleGuard } from './core/guard/role.guard';
import { isloggedGuard } from './core/guard/islogged.guard';
import { ChatUserComponent } from './chat/chat-user/chat-user.component';
import { ShopComponent } from './shop/shop/shop.component';
import { PostsComponent } from './Posts/posts/posts.component';
import { ShopDetailsComponent } from './shop/shop-detailes/shop-detailes.component';
import { CoachDashboardComponent } from './dashboard/coach-dashboard/coach-dashboard.component';
import { CoachComponent } from './dashboard/coach/coach.component';
import { GymDashComponent } from './dashboard/gym-dash/gym-dash.component';
import { ShopDashComponent } from './dashboard/shop-dash/shop-dash.component';
import { TrainingDashComponent } from './dashboard/training-dash/training-dash.component';
import { ProductsComponent } from './products/Products/products.component';


export const routes: Routes = [
  {path : "logging",component:LoggingLayoutComponent,children:[
    {path:'login', component:LoginComponent },
    {path: 'user' ,component:SignupUserComponent},
    {path:'coach',component :SignupCoachComponent},
    {path:"otp",component:ForgetPasswordComponent},
    {path :"passwordReset",component:ResetPasswordComponent},
    {path:"VerifyCode",component:PasswordVerificationComponent},
    {path:"Done",component:AllDoneComponent},
    {path:"gymInfo",component:GymInfoComponent},
    {path :"traningInfo" ,component: TrainingInfoComponent},
    {path:"shopInfo" ,component:ShopInfoComponent},
    {path :"verifyEmail",component:VerifyEmailComponent}
  ] ,canActivate:[isloggedGuard],
    data: { requireLogin: false }}

  ,{path:"layout",component:LayoutComponent ,children:[
    {path:"home",component:HomeComponent} ,
    {path :"gym" ,component:GymComponent} ,
    {path :"GymDetails/:id" , component : GymDetailsComponent},
    {path : "onlineTraning" ,component:OnlineTrainigComponent},
    {path : "coachDetails/:id" ,component :CoachDetailsComponent},
    {path : "profile" , component : ProfileComponent , canActivate:[isloggedGuard], data: { requireLogin: true }},
    {path : "chat/:id" , component : ChatComponent} ,
    {path : "Chat" , component :ChatUserComponent} ,
    {path: "shop",component : ShopComponent} ,
    {path: "shopDetails/:id", component: ShopDetailsComponent} ,
    {path :"posts" , component :PostsComponent} ,
    {path :"Products" , component :ProductsComponent} ,
    {path: "dashboard", component: CoachDashboardComponent ,children:[
      {path: "profile", component: CoachComponent},
      {path: "gyms", component:GymDashComponent} ,
      {path :"shop", component :ShopDashComponent},
      {path :"online-trainings", component :TrainingDashComponent}
    ], canActivate:[roleGuard], data: { requireLogin: true }}

  ]}

  ,{ path: "", redirectTo: "layout/home", pathMatch: "full" },

  { path: "**", component: NotFoundComponent }

];
