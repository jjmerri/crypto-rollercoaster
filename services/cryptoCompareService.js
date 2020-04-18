import axios from 'axios';
import { TimeUnits } from '../consts/TimeUnits';

export const getHistoricalData = async (crypto, currency, timeUnits) => {
  let limit;
  let endpoint;
  switch (timeUnits) {
    case TimeUnits.MINUTES:
      limit = 15;
      endpoint = 'histominute';
      break;
    case TimeUnits.HOURS:
      limit = 12;
      endpoint = 'histohour';
      break;
    case TimeUnits.DAYS:
      limit = 15;
      endpoint = 'histoday';
      break;
    default:
  }

  return await axios
    .get(`https://min-api.cryptocompare.com/data/v2/${endpoint}?fsym=${crypto}&tsym=${currency}&limit=${limit}`, {
      headers: {
        authorization: `Apikey ${process.env.cryptoCompareApiKey}`,
      },
    })
    .then((response) => response.data);
};
