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

  addProduct(productData :any , image:File):Observable<any>{
   const formData = new FormData();

    formData.append('Name', productData.name);
    formData.append('Description', productData.description);
    formData.append('Price', productData.price.toString());
    formData.append('OfferPrice', productData.offerPrice.toString());
    formData.append('Quantity', productData.quantity.toString());
    formData.append('CategoriesName', productData.categoriesName);
    formData.append('ShopId', productData.shopId.toString());

    if (image) {
      formData.append('Image', image);
    }

    return this._http.post<any>(`${environment.mainurl}/Product`,formData)


  }
  updateProduct(productData :any , id :number ):Observable<any>{

    return this._http.put<any>(`${environment.mainurl}/Product/UpdateDetails/${id}`,productData)


  }

  getOnlinetrainingDetails(id : number):Observable<any>{
    return this._http.get(`${environment.mainurl}/OnlineTrainingSubscription/${id}`)
  }

  getProductForOwner(id : number):Observable<any>{
    return this._http.get(`${environment.mainurl}/Product/Products?ShopID=${id}`)
  }

  getShopOwner():Observable<any>{
    return this._http.get(`${environment.mainurl}/Shop/ShopsOfOwner`)
  }

  deleteProduct(id:number):Observable<any>{
    return this._http.delete(`${environment.mainurl}/Product/${id}`)
  }
}
