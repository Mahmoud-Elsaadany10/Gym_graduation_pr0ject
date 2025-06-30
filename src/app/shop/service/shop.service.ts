import { Injectable } from '@angular/core';
import {  ShopDetailes, ShopResponse } from '../../Model/Models';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private http: HttpClient) {}

  getAllProducts(page: number = 1, pageSize: number = 9): Observable<any> {
    const url = `${environment.mainurl}/Shop/ShopSearch?PageNumber=${page}&PageSize=${pageSize}`;
    console.log('Making API request to:', url);
    return this.http.get<any>(url);
  }
  getShopById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.mainurl}/Shop/${id}`);
  }
  getProducts(params: any) {
  return this.http.get<any>('https://fitnesspro.runasp.net/api/Product/Products', { params });
}

  followShop(shopId: string): Observable<any> {
    return this.http.post(`${environment.mainurl}/Follow/follow-shop/${shopId}`, {});
  }

  unfollowShop(shopId: string): Observable<any> {
    return this.http.delete(`${environment.mainurl}/Follow/unfollow-shop/${shopId}`, {
      headers: { 'X-Skip-Error': 'true' }
    });
  }

  isFollowingShop(shopId: string) {
  return this.http.get<{ isFollowing: boolean }>(
    `${environment.mainurl}/Follow/is-following-shop/${shopId}`, {
      headers: { 'X-Skip-Error': 'true' }
    });

}
  getPostsOfShop(shopId: string): Observable<any> {
  return this.http.get(`${environment.mainurl}/Post/GetLastThreePostsOfShop/${shopId}`);
  }
addPost(content: string, images: File[] , id :number): Observable<any> {
  const formData = new FormData();
  formData.append('Content', content);
  formData.append('ShopId', id.toString());

  for (const image of images) {
    formData.append('Images', image);
  }

  return this.http.post(`${environment.mainurl}/Post/AddShopPost`, formData);
}
  //https://fitnesspro.runasp.net/api/Post/AddShopPost?ShopId=1&Content=dd
}
