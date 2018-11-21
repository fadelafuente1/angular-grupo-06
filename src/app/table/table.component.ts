import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  baseCurrency;
  // @select() shiftCurrency;
  shiftCurrency;
  baseCurrencyList;
  numbersToTable;
  subrowShow;
  @select() currencies;

  constructor(private api: CurrencyService) {}

  ngOnInit() {
    this.subscribeToCasts();
    this.api.updateCurrencies();
  }

  onSwipeLeft(e) {
    this.api.decreasePowerOf10();
  }

  onSwipeRight(e) {
    this.api.increasePowerOf10();
  }

  onClickSwap(event) {
    this.api.exchangeCurrenciesAndUpdateNumbers();
  }
  onChangeBaseCurrency(selectedCurrency) {
    this.api.setBaseCurrency(selectedCurrency.value);
    this.api.checkCurrenciesAvailable();
  }
  onChangeShiftCurrency(selectedCurrency) {
    this.api.setShiftCurrency(selectedCurrency.value);
    this.api.checkCurrenciesAvailable();
  }

  onClickRow(index) {
    let subrowShow = this.subrowShow;
    subrowShow = subrowShow ? subrowShow = null : this.numbersToTable[index].subrowNumbers;
    this.api.setSubrowShow(subrowShow);
  }

  onClickSubrow() {
    this.api.setSubrowShow(null);
  }

  onClickIncrease() {
    this.api.increasePowerOf10();
  }

  onClickDecrease() {
    this.api.decreasePowerOf10();
  }

  subscribeToCasts() {
    this.api.castBaseCurrency.subscribe(
      baseCurrency => this.baseCurrency = baseCurrency
    );
    this.api.castShiftCurrency.subscribe(
      shiftCurrency => this.shiftCurrency = shiftCurrency
    );
    this.api.castBaseCurrencyList.subscribe(
      baseCurrencyList => this.baseCurrencyList = baseCurrencyList
    );
    this.api.CastNumbersToTable.subscribe(
      numbersToTable => this.numbersToTable = numbersToTable
    );
    this.api.castSubrowShow.subscribe(
      subrowShow => this.subrowShow = subrowShow
    );
  }

}
