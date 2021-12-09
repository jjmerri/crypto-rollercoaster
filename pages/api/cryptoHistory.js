import { getHistoricalData } from '../../services/cryptoCompareService';

const cryptoHistory = async (req, res) => {
  const { crypto, currency, timeUnits } = req.query;
  const histData = await getHistoricalData(crypto, currency, timeUnits);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(histData));
};

export default cryptoHistory;
