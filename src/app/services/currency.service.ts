import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject} from 'rxjs';
import { Currency } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private baseCurrency = new BehaviorSubject('USD');
  private shiftCurrency = new BehaviorSubject('EUR');
  private baseCurrencyList = new BehaviorSubject([]);
  private numbersToTable = new BehaviorSubject([]);
  castBaseCurrencyList = this.baseCurrencyList.asObservable();
  CastNumbersToTable = this.numbersToTable.asObservable();
  castBaseCurrency = this.baseCurrency.asObservable();
  castShiftCurrency = this.shiftCurrency.asObservable();
  currentShiftCurrencyAmount;
  calculatedCurrencies = {};
  apiUrl;
  constructor(private http: HttpClient) {
    this.apiUrl = 'https://api.exchangeratesapi.io';
  }

  updateCurrencies(baseCurrency: string) {
    this.getCurrency(baseCurrency).subscribe(
      response => {
        this.loadBaseCurrencyList(response.rates);
        this.addCurrencyToCurrencyList(baseCurrency);
        this.addCalculatedCurrency(response.rates);
        this.loadCurrentShiftCurrencyAmount();
        console.log(this.currentShiftCurrencyAmount);
      }, error => console.log(error)
    );
  }
  getBaseCurrency() {
    return this.baseCurrency.value;
  }
  setBaseCurrency(baseCurrency: string) {
    this.baseCurrency.next(baseCurrency);
  }
  getShiftCurrency(): string {
    return this.shiftCurrency.value;
  }
  setShiftCurrency(shiftCurrency: string) {
    this.shiftCurrency.next(shiftCurrency);
  }
  setBaseCurrencyList(baseCurrencyList) {
    this.baseCurrencyList.next(baseCurrencyList);
  }
  setNumbersToTable(numbersToTable) {
    this.numbersToTable.next(numbersToTable);
  }
  exchangeCurrencies() {
    const newShiftCurrency = this.baseCurrency.value;
    const newBaseCurrency = this.shiftCurrency.value;
    this.setShiftCurrency(newShiftCurrency);
    this.setBaseCurrency(newBaseCurrency);
  }

  private getCurrency(baseCurrency: string): Observable<any> {
    const url =  `${this.apiUrl}/latest?base=${baseCurrency}`;
    return this.http.get(url).pipe(catchError(this.errorHandler));
  }
  private loadBaseCurrencyList(rates) {
    if (!this.currentShiftCurrencyAmount) {
      const shiftCurrencies = Object.keys(rates);
      this.setBaseCurrencyList(shiftCurrencies);
    }
  }
  private addCurrencyToCurrencyList(currency) {
    const baseCurrencyList = this.baseCurrencyList.value;
    if (!baseCurrencyList.includes(currency)) {
      baseCurrencyList.push(currency);
      this.setBaseCurrencyList(baseCurrencyList);
    }
  }
  private addCalculatedCurrency(shiftCurrencies) {
    if (!this.calculatedCurrencies || !this.calculatedCurrencies[this.baseCurrency.value]) {
      this.calculatedCurrencies[this.baseCurrency.value] = shiftCurrencies;
    }
  }
  private loadCurrentShiftCurrencyAmount() {
    this.currentShiftCurrencyAmount = this.calculatedCurrencies[this.baseCurrency.value][this.shiftCurrency.value];
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.status  || 'Server Error');
  }
}
