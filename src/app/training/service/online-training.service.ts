import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APiRes, ApiResponse, coachResponse, isFollowingResponse, TrainersResponse, TrainingSession } from '../../Model/Models';

@Injectable({
  providedIn: 'root'
})
export class OnlineTrainingService {


  constructor(private _http : HttpClient) { }

  getCoachByPage(PageNumber : number):Observable<TrainersResponse>{
    return this._http.get<TrainersResponse>(`${environment.mainurl}/User/GetAllCoaches?PageNumber=${PageNumber}&PageSize=9`)
  }
  searchCoach(coachName :string):Observable<TrainersResponse>{
    return this._http.get<TrainersResponse>(`${environment.mainurl}/User/GetAllCoaches?CoachName=${coachName}`)
  }
  getCoachById(id : string):Observable<coachResponse>{
    return this._http.get<coachResponse>(`${environment.mainurl}/User/CoachDetails/${id}`)
  }
  followCoach(id : string):Observable<APiRes>{
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${localStorage.getItem('token')}`
    // });
    return this._http.post<APiRes>(`${environment.mainurl}/Follow/follow-user/${id}`,{} )
  }
  unfollowCoach(id: string): Observable<APiRes> {
    return this._http.delete<APiRes>(`${environment.mainurl}/Follow/unfollow-user/${id}`);
  }
  getStatus(id : string):Observable<isFollowingResponse>{
    return this._http.get<isFollowingResponse>(`${environment.mainurl}/Follow/is-following-user/${id}`,
      { headers: { 'X-Skip-Error': 'true' } })
  }
  sortOnlineTraining(Option : string):Observable<TrainersResponse>{
    return this._http.get<TrainersResponse>(`${environment.mainurl}/User/GetAllCoaches?SortBy=${Option}`)
  }
  sortByRating(minRating : number , maxRating: number): Observable<TrainersResponse> {
    return this._http.get<TrainersResponse>(`${environment.mainurl}/User/GetAllCoaches?MinRating=${minRating}&MaxRating=${maxRating}`);
  }
  getGroupTrainingById(id: string): Observable<TrainingSession[]> {
    return this._http.get<TrainingSession[]>(
      `${environment.mainurl}/OnlineTraining/ByCoachId/Group?CoachId=${id}`,
      { headers: { 'X-Skip-Error': 'true' } }
    );
  }

  getPrivateTrainingById(id: string): Observable<TrainingSession[]> {
    return this._http.get<TrainingSession[]>(
      `${environment.mainurl}/OnlineTraining/ByCoachId/Private?CoachId=${id}`,
      { headers: { 'X-Skip-Error': 'true' } }
    );
  }

  payment(id : any):Observable<any>{
    return this._http.post<any>(`${environment.mainurl}/Payments/create-checkout-session`,id)
  }

}
