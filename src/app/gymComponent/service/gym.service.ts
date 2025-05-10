import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GymResponse } from '../../Model/Models';

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
}
