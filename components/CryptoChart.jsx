import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { TimeUnits } from '../consts/TimeUnits';
import { ToCurrencyCodes } from '../consts/ToCurrencyCodes';
import { FromCurrencyCodes } from '../consts/FromCurrencyCodes';
import useWindowSize from '../hooks/useWindowSize';

const ChartControlsContainer = styled.div`
  padding-bottom: 2rem;
  text-align: left;
`;

const DESKTOP_BREAKPOINT = 612;
const currencySymbols = { USD: '$', BTC: '₿', AUD: '$', CAD: '$', EUR: '€', GBP: '£', ETH: 'Ξ' };

const getChartData = (histData, timeUnits) => {
  let formatTime;
  switch (timeUnits) {
    case TimeUnits.MINUTES.code:
      formatTime = (datetime) => datetime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      break;
    case TimeUnits.HOURS.code:
      formatTime = (datetime) => datetime.toLocaleString('en-US', { hour: 'numeric', hour12: true });
      break;
    case TimeUnits.DAYS.code:
      formatTime = (datetime) => datetime.toLocaleString('en-US', { day: '2-digit', month: '2-digit' });
      break;
  }

  return histData.Data.Data.map((data) => {
    return {
      name: formatTime(new Date(data.time * 1000)),
      price: data.close,
    };
  });
};

const calculatePrecision = (histData) => {
  const price = histData.Data.Data[0].close;
  let precision = 0;
  let numDigits = 0;
  if (price < 1) {
    // .123 = 0; .00001234 = 4
    const magnitude = -Math.floor(Math.log10(price)) - 1;

    //get 4 digits after 0s
    precision = magnitude + 4;
    numDigits = precision + 1;
  } else {
    // 1 = 1; 100 = 3
    precision = Math.floor(Math.log10(price)) + 1;

    if (precision >= 4) {
      numDigits = precision;
      precision = 0;
    } else {
      numDigits = Math.max(precision + 2, 4);
      precision = numDigits - precision;
    }
  }

  return { precision, numDigits };
};

const CryptoChart = (props) => {
  const { histData, updateData, initialFromCurrency, initialToCurrency, initialTimeUnits } = props;
  const [mobileView, setMobileView] = useState(true);
  const [precision, setPrecision] = useState(4);
  const [numDigits, setNumDigits] = useState(5);
  const [toCurrencySymbol, setToCurrencySymbol] = useState('$');
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency || FromCurrencyCodes.BTC.code);
  const [toCurrency, setToCurrency] = useState(initialToCurrency || ToCurrencyCodes.USD.code);
  const [timeUnits, setTimeUnits] = useState(initialTimeUnits || TimeUnits.HOURS.code);
  const [initialLoad, setInitialLoad] = useState(true);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize && windowSize.width >= DESKTOP_BREAKPOINT) {
      setMobileView(false);
    } else {
      setMobileView(true);
    }
  }, [windowSize]);

  useEffect(() => {
    const { precision, numDigits } = calculatePrecision(histData);
    setPrecision(precision);
    setNumDigits(numDigits);
  }, [histData]);

  useEffect(() => {
    setToCurrencySymbol(currencySymbols[toCurrency]);
  }, [toCurrency]);

  useEffect(() => {
    if (!initialLoad) {
      updateData(fromCurrency, toCurrency, timeUnits);
    } else {
      setInitialLoad(false);
    }
  }, [fromCurrency, toCurrency, timeUnits]);

  const handleFromCurrencyChange = async (e) => {
    setFromCurrency(e.target.value);
  };
  const handleToCurrencyChange = async (e) => {
    setToCurrency(e.target.value);
  };
  const handleTimeUnitsChange = async (e) => {
    setTimeUnits(e.target.value);
  };

  const chartDomain = useMemo(
    () => [(dataMin) => (dataMin * 0.95).toFixed(precision), (dataMax) => (dataMax * 1.05).toFixed(precision)],
    [precision],
  );

  const tooltipFormatter = useCallback((value) => [`${toCurrencySymbol}${value}`, ''], [toCurrencySymbol]);

  return (
    <>
      <ChartControlsContainer>
        <select
          onChange={handleFromCurrencyChange}
          value={fromCurrency}
          className='chart-options'
          style={{ marginLeft: `${4 + 0.5 * numDigits}rem` }}>
          {Object.keys(FromCurrencyCodes).map((code) => (
            <option disabled={code === toCurrency} key={code} value={code}>
              {mobileView ? FromCurrencyCodes[code].shortName : FromCurrencyCodes[code].longName}
            </option>
          ))}
        </select>
        <select
          onChange={handleToCurrencyChange}
          value={toCurrency}
          className='chart-options'
          style={{ marginLeft: '2rem' }}>
          {Object.keys(ToCurrencyCodes).map((code) => (
            <option disabled={code === fromCurrency || code === '---'} key={code} value={code}>
              {mobileView ? ToCurrencyCodes[code].shortName : ToCurrencyCodes[code].longName}
            </option>
          ))}
        </select>
        <select
          onChange={handleTimeUnitsChange}
          value={timeUnits}
          className='chart-options'
          style={{ marginLeft: '2rem' }}>
          {Object.keys(TimeUnits).map((code) => (
            <option key={code} value={code}>
              {mobileView ? TimeUnits[code].shortName : TimeUnits[code].longName}
            </option>
          ))}
        </select>
      </ChartControlsContainer>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart
          id='cryptoLineChart'
          data={getChartData(histData, timeUnits)}
          margin={{
            right: 10,
            left: 7 + 8 * numDigits,
            bottom: 40,
          }}>
          <CartesianGrid />
          <XAxis
            dataKey='name'
            label={<Label value={`LAST ${histData.Data.Data.length - 1} ${timeUnits}`} position='bottom' fill='gray' />}
          />
          <YAxis
            domain={chartDomain}
            tickFormatter={(tick) => `${toCurrencySymbol}${tick.toFixed(precision)}`}
            label={
              <Label
                value={`${fromCurrency} / ${toCurrency}`}
                angle={-90}
                position='left'
                offset={8 * (numDigits - 2)}
                fill='gray'
              />
            }
          />
          <Tooltip formatter={tooltipFormatter} separator={''} />
          <Line type='monotone' dataKey='price' />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default CryptoChart;
