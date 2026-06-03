import { marketValueCompanies } from '../data/marketValueCompanies';
import { fetchFinnhubQuoteMap, hasFinnhubPrice } from './finnhubMarketClient';

const YAHOO_CHART_BASE = '/yahoo-finance/v8/finance/chart';
const YAHOO_QUOTE_BASE = '/yahoo-finance/v7/finance/quote';
const MAX_POINTS = 72;

const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));

const buildChartUrl = (symbol, range = '1d', interval = '5m') =>
  `${YAHOO_CHART_BASE}/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;

const toUsd = (value, currency, fxRates) => {
  if (currency === 'USD') return value;
  if (currency === 'KRW') return value / fxRates.KRW;
  if (currency === 'JPY') return value / fxRates.JPY;
  if (currency === 'TWD') return value / fxRates.TWD;
  if (currency === 'EUR') return value * fxRates.EUR;
  if (currency === 'CHF') return value / fxRates.CHF;
  if (currency === 'SGD') return value / fxRates.SGD;
  return value;
};

const formatTime = (timestamp, timezone) =>
  new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone || undefined,
  }).format(new Date(timestamp * 1000));

const getCloseSeries = (result) => {
  const timestamps = result.timestamp || [];
  const quote = result.indicators?.quote?.[0] || {};
  const closes = quote.close || [];

  return timestamps
    .map((timestamp, index) => ({
      timestamp,
      close: closes[index],
    }))
    .filter((point) => Number.isFinite(point.close));
};

const fetchChart = async (symbol) => {
  const response = await fetch(buildChartUrl(symbol));
  if (!response.ok) {
    throw new Error(`${symbol} chart failed: ${response.status}`);
  }

  const data = await response.json();
  const result = data.chart?.result?.[0];
  if (!result) {
    throw new Error(`${symbol} chart is empty`);
  }

  return result;
};

const fetchFxPrice = async (symbol, fallback) => {
  try {
    const result = await fetchChart(symbol);
    return result.meta?.regularMarketPrice || fallback;
  } catch {
    return fallback;
  }
};

const fetchFxRates = async () => ({
  KRW: await fetchFxPrice('KRW=X', 1350),
  JPY: await fetchFxPrice('JPY=X', 155),
  TWD: await fetchFxPrice('TWD=X', 32),
  EUR: await fetchFxPrice('EURUSD=X', 1.08),
  CHF: await fetchFxPrice('CHF=X', 0.9),
  SGD: await fetchFxPrice('SGD=X', 1.35),
});

const fetchQuotes = async (symbols) => {
  const pairs = await Promise.all(
    chunk(symbols, 25).map(async (group) => {
      const response = await fetch(`${YAHOO_QUOTE_BASE}?symbols=${group.map(encodeURIComponent).join(',')}`);
      if (!response.ok) throw new Error(`quote failed: ${response.status}`);
      const data = await response.json();
      return data.quoteResponse?.result || [];
    })
  );

  return new Map(pairs.flat().map((quote) => [quote.symbol, quote]));
};

const makeFallbackCompany = (company, index, fxRates) => {
  const marketCapUsd = company.fallbackMarketCapUsd || 1_000_000_000;
  const basePrice = 100 + index * 3;
  const sharesOutstanding = company.sharesOutstanding || marketCapUsd / basePrice;
  const points = Array.from({ length: 48 }, (_, pointIndex) => {
    const drift = Math.sin((pointIndex + index) / 5) * 0.012;
    const pulse = Math.cos((pointIndex + 2 * index) / 7) * 0.006;
    const close = basePrice * (1 + drift + pulse);
    return {
      timestamp: Math.floor(Date.now() / 1000) - (47 - pointIndex) * 60,
      close,
    };
  });
  const latest = points.at(-1).close;
  const previous = points.at(-2).close;
  const marketCapLocal = company.currency === 'USD'
    ? marketCapUsd
    : marketCapUsd / toUsd(1, company.currency, fxRates);

  return {
    ...company,
    price: latest,
    previousPrice: previous,
    changePercent: ((latest - previous) / previous) * 100,
    marketCapUsd,
    marketCapLocal,
    sharesOutstanding,
    lastUpdated: new Date().toISOString(),
    points,
    timezone: 'Asia/Seoul',
    isFallback: true,
  };
};

const makeCompanySnapshot = (company, result, quote, finnhubQuote, fxRates) => {
  const meta = result.meta || {};
  const points = getCloseSeries(result);
  const hasFinnhub = hasFinnhubPrice(finnhubQuote);
  const latest = hasFinnhub ? finnhubQuote.c : quote?.regularMarketPrice || meta.regularMarketPrice || points.at(-1)?.close;
  const previous = hasFinnhub && Number.isFinite(finnhubQuote.pc) && finnhubQuote.pc > 0
    ? finnhubQuote.pc
    : quote?.regularMarketPreviousClose || meta.previousClose || meta.chartPreviousClose || points.at(-2)?.close || latest;
  const currency = quote?.currency || meta.currency || company.currency;
  const quoteMarketCap = Number(quote?.marketCap || 0);
  const usesEstimatedMarketCap = !quoteMarketCap;
  const yahooPrice = quote?.regularMarketPrice || meta.regularMarketPrice || latest;
  const sharesOutstanding =
    company.sharesOutstanding ||
    (quoteMarketCap && yahooPrice ? quoteMarketCap / yahooPrice : null) ||
    (company.fallbackMarketCapUsd && latest ? company.fallbackMarketCapUsd / toUsd(latest, currency, fxRates) : null);
  const marketCapLocal = latest && sharesOutstanding ? latest * sharesOutstanding : quoteMarketCap;

  return {
    ...company,
    currency,
    price: latest,
    previousPrice: previous,
    changePercent: previous ? ((latest - previous) / previous) * 100 : 0,
    marketCapUsd: toUsd(marketCapLocal, currency, fxRates),
    marketCapLocal,
    sharesOutstanding,
    lastUpdated: hasFinnhub && Number.isFinite(finnhubQuote.t)
      ? new Date(finnhubQuote.t * 1000).toISOString()
      : meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
    points: points.slice(-MAX_POINTS),
    timezone: meta.exchangeTimezoneName,
    priceSource: hasFinnhub ? 'Finnhub' : 'Yahoo Finance',
    isFallback: false,
    usesEstimatedMarketCap,
  };
};

export const fetchMarketValueData = async () => {
  const fxRates = await fetchFxRates();
  let quoteMap = new Map();
  let finnhubQuoteMap = new Map();
  let quoteFailed = false;
  let finnhubFailed = false;
  try {
    finnhubQuoteMap = await fetchFinnhubQuoteMap(marketValueCompanies.map((company) => company.symbol));
  } catch {
    finnhubFailed = true;
  }
  try {
    quoteMap = await fetchQuotes(marketValueCompanies.map((company) => company.symbol));
  } catch {
    quoteFailed = true;
  }
  const settled = await Promise.allSettled(
    marketValueCompanies.map(async (company) =>
      makeCompanySnapshot(company, await fetchChart(company.symbol), quoteMap.get(company.symbol), finnhubQuoteMap.get(company.symbol), fxRates)
    )
  );

  const companies = settled
    .map((item, index) =>
      item.status === 'fulfilled'
        ? item.value
        : makeFallbackCompany(marketValueCompanies[index], index, fxRates)
    )
    .sort((a, b) => b.marketCapUsd - a.marketCapUsd);

  const hasFallback = quoteFailed || companies.some((company) => company.isFallback || company.usesEstimatedMarketCap);
  return {
    companies,
    usdKrw: fxRates.KRW,
    fxRates,
    hasFallback,
    quoteFailed,
    finnhubFailed,
    provider: finnhubQuoteMap.size ? 'Finnhub + Yahoo Finance fallback' : 'Yahoo Finance fallback',
    lastUpdated: new Date().toISOString(),
  };
};

export const buildMarketCapSeries = (companies, selectedIds, fxRatesOrUsdKrw = 1350) => {
  const fxRates = typeof fxRatesOrUsdKrw === 'number' ? { KRW: fxRatesOrUsdKrw, JPY: 155, TWD: 32, EUR: 1.08, CHF: 0.9, SGD: 1.35 } : fxRatesOrUsdKrw;
  const selected = companies.filter((company) => selectedIds.includes(company.companyId));
  const longest = selected.reduce((max, company) => Math.max(max, company.points.length), 0);
  const rows = [];

  for (let index = 0; index < longest; index += 1) {
    const row = {};
    selected.forEach((company) => {
      const offset = company.points.length - longest;
      const point = company.points[index + offset];
      if (!point) return;

      row.time = row.time || formatTime(point.timestamp, company.timezone);
      row[company.companyId] = toUsd(point.close * company.sharesOutstanding, company.currency, fxRates) / 1_000_000_000;
    });
    if (Object.keys(row).length > 1) rows.push(row);
  }

  return rows;
};
