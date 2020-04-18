import axios from 'axios';

export const cryptoHistory = async (crypto, currency, timeUnits) => {
  return await axios
    .get(`/api/cryptoHistory?crypto=${crypto}&currency=${currency}&timeUnits=${timeUnits}`)
    .then((response) => response.data);
};
