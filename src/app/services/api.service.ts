import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl;
  httpOptions = {
    params: null
  };
  constructor(private http: HttpClient) {
    this.apiUrl = 'https://api.exchangeratesapi.io';
  }
  getCurrency(baseCurrency: string): Observable<any> {
    const url =  `${this.apiUrl}/latest`;
    this.httpOptions.params = new HttpParams().set('base', baseCurrency);
    return this.http.get(url, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.status  || 'Server Error');
  }
}
