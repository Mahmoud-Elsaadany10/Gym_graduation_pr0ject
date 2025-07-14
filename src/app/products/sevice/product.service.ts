import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private http: HttpClient) {}

  // getProducts(filters: {
  //   PageNumber?: number;
  //   PageSize?: number;
  //   Name?: string;
  //   MinimumPrice?: number;
  //   MaximumPrice?: number;
  //   ShopID?: number;
  //   CategoryID?: number;
  //   SearchByBiggetDiscount?: boolean;
  //   SearchByPriceDescending?: boolean;
  //   SearchByPriceAscending?: boolean;
  // }): Observable<any> {
  //   let params = new HttpParams();

  //   Object.entries(filters).forEach(([key, value]) => {
  //     if (value !== undefined && value !== null && value !== '') {
  //       params = params.set(key, value);
  //     }
  //   });

  //   return this.http.get<any>(this.baseUrl, { params });
  // }

  getProducts(filters: { [key: string]: boolean }) {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get(`${environment.mainurl}/Product/Products`, { params });
  }

  getProductById(id :number):Observable<any>{
    return this.http.get(`${environment.mainurl}/Product/${id}`);
  }
}
