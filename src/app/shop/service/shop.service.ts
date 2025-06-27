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

}
