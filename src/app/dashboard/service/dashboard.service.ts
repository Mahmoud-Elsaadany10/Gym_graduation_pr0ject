import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _http : HttpClient) { }

  deleteGym(gymId: number) :Observable<any> {
    return this._http.delete(`${environment.mainurl}/Gym/${gymId}`);
  }
  deleteShop(shopId: number) :Observable<any> {
    return this._http.delete(`${environment.mainurl}/Shop/${shopId}`);
  }
  deleteOnlineTraining(trainingId: number) :Observable<any> {
    return this._http.delete(`${environment.mainurl}/OnlineTraining/${trainingId}`);
  }

  addGymPost(content: string, images: File[] , id :number): Observable<any> {
    const formData = new FormData();
    formData.append('Content', content);
    formData.append('GymId', id.toString());

    for (const image of images) {
      formData.append('Images', image);
    }

    return this._http.post(`${environment.mainurl}/Post/AddGymPost`, formData);
  }
  addShopPost(content: string, images: File[] , id :number): Observable<any> {
    const formData = new FormData();
    formData.append('Content', content);
    formData.append('ShopId', id.toString());

    for (const image of images) {
      formData.append('Images', image);
    }

    return this._http.post(`${environment.mainurl}/Post/AddShopPost`, formData);
  }

}
