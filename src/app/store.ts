import { Currency } from './models/currency';
import { CHANGE_BASE_CURRENCY, CHANGE_SHIFT_CURRENCY,
  INCREASE_CURRENCY, GET_CURRENCY, DECREASE_CURRENCY,
} from './actions';

export interface IAppState {
  baseCurrency: string;
  shiftCurrency: string;
  currencies: number[][];
  base: number;

}
export const INITIAL_STATE: IAppState = {
  baseCurrency: "USD",
  shiftCurrency: "EUR",
  base: 0.875,
  currencies: [[10, 8.75], [20 ,17.50], [30, 26.25], [40, 35.00]]

};



export function rootReducer(state: IAppState, action): IAppState {
  switch (action.type) {
      case GET_CURRENCY:
      /*
        return CurrencyService.getCurrency(state.baseCurrency).then(
          async response => {
            console.log('success')
            console.log(response)
          }, error => {
            console.log(error)
          })
      */
      case INCREASE_CURRENCY:
        const newICurrencies = []
        for (let curr of state.currencies) {
          newICurrencies.push([curr[0]*10, curr[1]*10]);
        }
        return Object.assign({}, state, {
          currencies: newICurrencies
        })

      case DECREASE_CURRENCY:
        const newDCurrencies = []
        for (let curr of state.currencies) {
          newDCurrencies.push([curr[0]/10, curr[1]/10]);
        }
        return Object.assign({}, state, {
          currencies: newDCurrencies
        })
    }

    return state;
}
