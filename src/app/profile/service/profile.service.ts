import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ChangePassword, coachProfile, coachResponse, gymData, GymInfo, Shop, ShopResponse, TrainingModelResponse } from '../../Model/Models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _http : HttpClient) { }

  //coach
  UpdateCoachInfo(data : coachProfile):Observable<any>{
    return this._http.put<any>(`${environment.mainurl}/User/UpdateProfileDetails`,data)
  }
  getCoachInfo(): Observable<coachProfile> {
    return this._http.get<coachProfile>(`${environment.mainurl}/User/ProfileDetails`);
  }
  //gym
  UpdateGymInfo(data : GymInfo ,id :number):Observable<ApiResponse>{
    return this._http.put<ApiResponse>(`${environment.mainurl}/Gym/${id}` ,data)
  }
  getGymInfo(id :string): Observable<GymInfo> {
    return this._http.get<GymInfo>(`${environment.mainurl}/Gym/ByCoachId?CoachId=${id}`);
  }
  //OnlineTraining
  UpdateOnlineTraining(data : TrainingModelResponse,id :number):Observable<ApiResponse>{
    return this._http.put<ApiResponse>(`${environment.mainurl}/OnlineTraining/${id}`,data)
  }
  getCoachById(id : string):Observable<any>{
    return this._http.get<any>(`${environment.mainurl}/User/CoachDetails/${id}`)
  }
  getShopInfo(): Observable<ShopResponse> {
    return this._http.get<ShopResponse>(`${environment.mainurl}/Shop/ShopsOfOwner`);
  }
  updateShopInfo(id : number , data :any):Observable<ApiResponse>{
    return this._http.put<ApiResponse>(`${environment.mainurl}/Shop/${id}` , data)
  }
  changePassword(data : ChangePassword):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/ChangePassword` ,data)
  }

}
