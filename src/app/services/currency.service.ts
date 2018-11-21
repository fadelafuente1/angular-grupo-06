import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject} from 'rxjs';
import { Currency } from '../models/currency';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private baseCurrency = new BehaviorSubject('USD');
  private shiftCurrency = new BehaviorSubject('EUR');
  private baseCurrencyList = new BehaviorSubject([]);
  private numbersToTable = new BehaviorSubject([]);
  private subrowShow = new BehaviorSubject(null);
  castBaseCurrencyList = this.baseCurrencyList.asObservable();
  CastNumbersToTable = this.numbersToTable.asObservable();
  castBaseCurrency = this.baseCurrency.asObservable();
  castShiftCurrency = this.shiftCurrency.asObservable();
  castSubrowShow = this.subrowShow.asObservable();
  currentShiftCurrencyAmount;
  calculatedCurrencies = {};
  firstTableNumber = 1;
  powerOf10Number = 1;
  apiUrl;
  constructor(private http: HttpClient) {
    this.apiUrl = 'https://api.exchangeratesapi.io';
  }

  updateCurrencies() {
    if (this.calculatedCurrencies[this.baseCurrency.value]){

    }
    const baseCurrency = this.baseCurrency.value;
    this.getCurrency(baseCurrency).subscribe(
      response => {
        this.loadBaseCurrencyList(response.rates);
        this.addCurrencyToCurrencyList(baseCurrency);
        this.addCalculatedCurrency(response.rates);
        this.loadCurrentShiftCurrencyAmount();
        this.loadNumbersToTable();
        this.addSubrowToNumbersToTable();
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
  increasePowerOf10() {
    this.powerOf10Number += 1;
    this.loadNumbersToTable();
    this.addSubrowToNumbersToTable();
  }
  decreasePowerOf10() {
    this.powerOf10Number -= 1;
    this.loadNumbersToTable();
    this.addSubrowToNumbersToTable();
  }
  exchangeCurrenciesAndUpdateNumbers() {
    this.exchangeCurrencies();
    this.checkCurrenciesAvailable();
  }
  setSubrowShow(subrowShow) {
    this.subrowShow.next(subrowShow);
  }
  checkCurrenciesAvailable() {
    if (!this.calculatedCurrencies || !this.calculatedCurrencies[this.baseCurrency.value]) {
      return this.updateCurrencies();
    }
    this.loadCurrentShiftCurrencyAmount();
    this.loadNumbersToTable();
    this.addSubrowToNumbersToTable();
  }

  private exchangeCurrencies() {
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
  private loadNumbersToTable () {
    const numbersToTable = [];
    for (const value of _.range(10)) {
      const numbers = {};
      const unit = value + 1;
      const baseNumber = unit * this.firstTableNumber * Math.pow(10, this.powerOf10Number);
      const shiftNumber = baseNumber * this.currentShiftCurrencyAmount;
      numbers['baseNumber'] = baseNumber;
      numbers['shiftNumber'] = shiftNumber.toFixed(2);
      numbersToTable.push(numbers);
    }
    this.setNumbersToTable(numbersToTable);
  }
  private addSubrowToNumbersToTable () {
    const numbersToTable = this.numbersToTable.value;
    numbersToTable.forEach(
      (row, index) => {
        const subrowNumbersToTable = [];
        subrowNumbersToTable.push({ 'baseNumber': row['baseNumber'], 'shiftNumber': row['shiftNumber'] });
        for (const subrowValue of _.range(10)) {
          const subrowNumbers = {};
          const subrowUnit = subrowValue + 1;
          const subrowPowerOf10Number = this.powerOf10Number - 1;
          const subrowBaseNumber = row['baseNumber'] + subrowUnit * Math.pow(10, subrowPowerOf10Number);
          const subrowShiftNumber = subrowBaseNumber * this.currentShiftCurrencyAmount;
          subrowNumbers['baseNumber'] = subrowBaseNumber;
          subrowNumbers['shiftNumber'] = subrowShiftNumber.toFixed(2);
          subrowNumbersToTable.push(subrowNumbers);
        }
        numbersToTable[index]['clickead'] = false;
        numbersToTable[index]['subrowNumbers'] = subrowNumbersToTable;
      }
    );
    this.setNumbersToTable(numbersToTable);
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.status  || 'Server Error');
  }
}
