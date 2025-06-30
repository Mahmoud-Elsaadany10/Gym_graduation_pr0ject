import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APiRes, CoachPostsResponse, GymResponse } from '../../Model/Models';

@Injectable({
  providedIn: 'root'
})
export class GymService {

  constructor(private _http :HttpClient) { }


  getGymByPge(PageNumber : number):Observable<GymResponse>{
    return this._http.get<GymResponse>(`${environment.mainurl}/Gym?PageNumber=${PageNumber}&PageSize=9`)
  }
  searchGym(gymName :string):Observable<GymResponse>{
    return this._http.get<GymResponse>(`${environment.mainurl}/Gym?GymName=${gymName}`)
  }
  getGymById(id: number): Observable<any> {
    return this._http.get<GymResponse>(`${environment.mainurl}/Gym/${id}`)
  }
  getGymCities():Observable<any>{
    return this._http.get<GymResponse>(`${environment.mainurl}/Gym/Cities`)
  }
  getGymByCite(city: string):Observable<GymResponse>{
    return this._http.get<GymResponse>(`${environment.mainurl}/Gym?City=${city}`)
  }
  sortGyms(option : string ):Observable<GymResponse>{
    return this._http.get<GymResponse>(`${environment.mainurl}/Gym?SortBy=${option}`)
  }
  chechIfRated(id: number): Observable<any> {
    return this._http.get<any>(`${environment.mainurl}/GymRating/hasRated/${id}`,
      { headers: { 'X-Skip-Error': 'true' } });
  }

  //follow

  followGym(id: number): Observable<APiRes> {
    return this._http.post<APiRes>(`${environment.mainurl}/Follow/follow-gym/${id}`, {});
  }
  unfollowGym(id: number): Observable<APiRes> {
    return this._http.delete<APiRes>(`${environment.mainurl}/Follow/unfollow-gym/${id}`);
  }
  getStatus(id: number): Observable<any> {
    return this._http.get<any>(`${environment.mainurl}/Follow/is-following-gym/${id}`,
      { headers: { 'X-Skip-Error': 'true' } });
  }
    payment(id : {onlineTrainingId: number }):Observable<any>{
    return this._http.post<any>(`${environment.mainurl}/Payments/create-checkout-session`,id)
  }
  getGymPosts(id: number): Observable<CoachPostsResponse> {
    return this._http.get<CoachPostsResponse>(`${environment.mainurl}/Post/GetLastThreePostsOfGym/${id}`);
  }
}
