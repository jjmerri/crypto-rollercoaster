import { FromCurrencyCodes } from './FromCurrencyCodes';

export const ToCurrencyCodes = {
  USD: { code: 'USD', shortName: 'USD', longName: 'US Dollar' },
  AUD: { code: 'AUD', shortName: 'AUD', longName: 'Australian Dollar' },
  CAD: { code: 'CAD', shortName: 'CAD', longName: 'Canadian Dollar' },
  EUR: { code: 'EUR', shortName: 'EUR', longName: 'Euro' },
  GBP: { code: 'GBP', shortName: 'GBP', longName: 'Pound Sterling' },
  ['---']: { shortName: '---', longName: '---' },
  BTC: { code: 'BTC', shortName: 'BTC', longName: 'Bitcoin' },
  ETH: { code: 'ETH', shortName: 'ETH', longName: 'Ethereum' },
};

//export const ToCurrencyCodes = { ...currencyCodes, ['---']: '---', ...FromCurrencyCodes };
