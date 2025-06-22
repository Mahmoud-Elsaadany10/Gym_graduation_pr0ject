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
    return this._http.get<coachProfile>(`${environment.mainurl}/User/ProfileDetails`,
      { headers: { 'X-Skip-Error': 'true' } });
  }
  //gym
  UpdateGymInfo(data : GymInfo ,id :number):Observable<ApiResponse>{
    return this._http.put<ApiResponse>(`${environment.mainurl}/Gym/${id}` ,data)
  }
  getGymInfo(id :string): Observable<GymInfo> {
    return this._http.get<GymInfo>(`${environment.mainurl}/Gym/ByCoachId?CoachId=${id}`,
      { headers: { 'X-Skip-Error': 'true' } });
  }
  //OnlineTraining
  UpdateOnlineTraining(data : TrainingModelResponse,id :number):Observable<ApiResponse>{
    return this._http.put<ApiResponse>(`${environment.mainurl}/OnlineTraining/${id}`,data)
  }
  getCoachById(id : string):Observable<any>{
    return this._http.get<any>(`${environment.mainurl}/User/CoachDetails/${id}`,
      { headers: { 'X-Skip-Error': 'true' } })
  }
  getShopInfo(): Observable<ShopResponse> {
    return this._http.get<ShopResponse>(`${environment.mainurl}/Shop/ShopsOfOwner`,
      { headers: { 'X-Skip-Error': 'true' } });
  }
  updateShopInfo(id : number , data :any):Observable<ApiResponse>{
    return this._http.put<ApiResponse>(`${environment.mainurl}/Shop/${id}` , data)
  }
  changePassword(data : ChangePassword):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/ChangePassword` ,data)
  }


  uploadUserImage(file: File) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FileName', file.name);
    formData.append('Name', 'user-image');
    formData.append('ContentType', file.type);
    formData.append('ContentDisposition', 'form-data');
    formData.append('Length', file.size.toString());

    const headersObject = {
      additionalProp1: ['value1'],
      additionalProp2: ['value2'],
      additionalProp3: ['value3']
    };
    formData.append('Headers', JSON.stringify(headersObject));

    return this._http.post(`${environment.mainurl}/Images/upload-user-image`, formData);
  }

  deleteUserImage(): Observable<any> {
    return this._http.delete(`${environment.mainurl}/Images/delete-user-image`);
  }

  uploadGymImage(file: File , gymId: number) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FileName', file.name);
    formData.append('Name', 'gym-image');
    formData.append('ContentType', file.type);
    formData.append('ContentDisposition', 'form-data');
    formData.append('Length', file.size.toString());

    const headersObject = {
      additionalProp1: ['value1'],
      additionalProp2: ['value2'],
      additionalProp3: ['value3']
    };
    formData.append('Headers', JSON.stringify(headersObject));

    return this._http.post(`${environment.mainurl}/Images/upload-gym-image/${gymId}`, formData);
  }
  deleteGymImage(gymId: number): Observable<any> {
    return this._http.delete(`${environment.mainurl}/Images/delete-gym-image/${gymId}`);
  }
  uploadShopImage(file: File , shopId: number) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FileName', file.name);
    formData.append('Name', 'gym-image');
    formData.append('ContentType', file.type);
    formData.append('ContentDisposition', 'form-data');
    formData.append('Length', file.size.toString());

    const headersObject = {
      additionalProp1: ['value1'],
      additionalProp2: ['value2'],
      additionalProp3: ['value3']
    };
    formData.append('Headers', JSON.stringify(headersObject));

    return this._http.post(`${environment.mainurl}/Images/upload-shop-image/${shopId}`, formData);
  }
  deleteShopImage(shopId: number): Observable<any> {
    return this._http.delete(`${environment.mainurl}/Images/delete-shop-image/${shopId}`);
  }

}
