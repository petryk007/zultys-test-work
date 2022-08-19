import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  api = 'http://universities.hipolabs.com'
  // http://universities.hipolabs.com/search?country=turkey
  constructor(
    private readonly http: HttpClient
  ) { }


  getCountry() {
    return  this.http.get(`${this.api}/search`).pipe(
      map((res: any) => {
        const newData: any[] = [];
        res.forEach((item: any) => {
          if (!newData.some(el => el === item.country)) {
            newData.push(item.country)
          }
        })
        return newData;
      })
    )
  }

  getUniversitiByCountry(contry: string) {
    return this.http.get(`${this.api}/search?country=${contry.toLowerCase()}`)
  } 
}
