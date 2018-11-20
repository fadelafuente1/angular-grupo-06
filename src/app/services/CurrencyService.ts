import Api from './Api'

export default {
  getCurrency (baseCurrency) {
    return Api().get(`/latest?base=${baseCurrency}`)
  }
}