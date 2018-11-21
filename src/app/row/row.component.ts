import { Component, OnInit, Input } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit {
  @Input() numberToTable;
  @Input() index;
  subrowShow;

  constructor(private api: CurrencyService) { }

  ngOnInit() {
    // this.api.CastNumbersToTable.subscribe(
    //   numbersToTable => this.numbersToTable = numbersToTable
    // );
    this.api.castSubrowShow.subscribe(
      subrowShow => this.subrowShow = subrowShow
    );
  }

}
