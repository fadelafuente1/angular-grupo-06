import { ICurrency } from './currency';
import { CHANGE_BASE_CURRENCY, CHANGE_SHIFT_CURRENCY} from './actions';

export interface IAppState {
  baseCurrency: ICurrency;
  shiftCurrency: ICurrency;
  currencies: {};
}
export const INITIAL_STATE: IAppState = {
  baseCurrency: null,
  shiftCurrency: null,
  currencies: {}
};

export function rootReducer(state: IAppState, action): IAppState {
  switch (action.type) {
    case CHANGE_BASE_CURRENCY:
      return Object.assign({}, state, {
        baseCurrency: action
      });
    case CHANGE_SHIFT_CURRENCY:
      return Object.assign({}, state, {
        shiftCurrency: action
      });
    }
    return state;
}
