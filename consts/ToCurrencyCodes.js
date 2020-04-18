import { FromCurrencyCodes } from './FromCurrencyCodes';

export const ToCurrencyCodes = {
  USD: 'US Dollar',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  EUR: 'Euro',
  GBP: 'Pound Sterling',
  ['---']: '---',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
};

//export const ToCurrencyCodes = { ...currencyCodes, ['---']: '---', ...FromCurrencyCodes };
