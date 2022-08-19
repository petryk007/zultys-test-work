import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  api = 'http://universities.hipolabs.com'
  
  constructor(
    private readonly http: HttpClient,
    private toastr: ToastrService
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
      }),
      catchError(error => this.errorHandler(error))
    )
  }

  getUniversitiByCountry(contry: string) {
    return this.http.get(`${this.api}/search?country=${contry.toLowerCase()}1`).pipe(
      catchError(error => this.errorHandler(error))
    )
  } 

  private errorHandler(error): Observable<Error> {
    this.toastr.error(error.status, error.error && error.error[0] && error.error[0].errorMessage
      ? error.error[0].errorMessage
      : error.message)
    return throwError(error);
  }
}
