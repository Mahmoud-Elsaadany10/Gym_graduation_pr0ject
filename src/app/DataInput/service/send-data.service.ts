import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, gymData, shopInfo, TrainingModelResponse, TrainingProgram } from '../../Model/Models';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  constructor(private _http :HttpClient) { }

  sendGymData(data :gymData):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Gym` ,data)
  }
  sendTrainingInfo(data :TrainingProgram):Observable<TrainingModelResponse>{
    return this._http.post<TrainingModelResponse>(`${environment.mainurl}/OnlineTraining` ,data)
  }
  sendShopInfo(data :shopInfo):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Shop` ,data)
  }
}
