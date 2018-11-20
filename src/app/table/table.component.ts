import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from '../store';
import { GET_CURRENCY, INCREASE_CURRENCY, DECREASE_CURRENCY } from '../actions';
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
  @select() currencies;

  constructor(private ngRedux: NgRedux<IAppState>, private api: CurrencyService) {}

  ngOnInit() {
    this.subscribeToCasts();
    this.api.updateCurrencies(this.baseCurrency);
  }

  onSwipeLeft(e) {
    console.log('bbbbbb');
  }

  onSwipeRight(e) {
    console.log('aaaaa');
  }
  onClickSwap(event) {
    this.api.exchangeCurrencies();
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
  }

}
