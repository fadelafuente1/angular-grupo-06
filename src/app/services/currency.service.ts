import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Currency } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  apiUrl;
  constructor(private http: HttpClient) {
    this.apiUrl = 'https://api.exchangeratesapi.io';
  }
  getCurrency(baseCurrency: string): Observable<any> {
    const url =  `${this.apiUrl}/latest?base=${baseCurrency}`;
    return this.http.get(url).pipe(catchError(this.errorHandler));
  }


  errorHandler(error: HttpErrorResponse) {
    return throwError(error.status  || 'Server Error');
  }
}
