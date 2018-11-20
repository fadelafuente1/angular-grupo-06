import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from '../store';
import { GET_CURRENCY, INCREASE_CURRENCY, DECREASE_CURRENCY } from '../actions'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  @select() baseCurrency;
  @select() shiftCurrency;
  @select() currencies;
 

  constructor(private ngRedux: NgRedux<IAppState>) { 
  }

  ngOnInit() {
    // this.ngRedux.dispatch({type: GET_CURRENCY})
    console.log(this.baseCurrency);
  }

  onSwipeLeft(e) {
    console.log('bbbbbb')
  }

  onSwipeRight(e) {
    console.log("aaaaa");
  }

}
