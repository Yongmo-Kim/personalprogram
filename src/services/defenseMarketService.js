import { defenseMarketCompanies } from '../data/defenseMarketCompanies';

const YAHOO_CHART_BASE = '/yahoo-finance/v8/finance/chart';

const buildChartUrl = (symbol) => `${YAHOO_CHART_BASE}/${encodeURIComponent(symbol)}?range=1d&interval=5m`;

const fetchChart = async (symbol) => {
  const response = await fetch(buildChartUrl(symbol));
  if (!response.ok) throw new Error(`${symbol} chart failed`);
  const data = await response.json();
  const result = data.chart?.result?.[0];
  if (!result) throw new Error(`${symbol} chart empty`);
  return result;
};

const fetchFx = async (symbol, fallback) => {
  try {
    const result = await fetchChart(symbol);
    return result.meta?.regularMarketPrice || fallback;
  } catch {
    return fallback;
  }
};

const getPoints = (result) => {
  const timestamps = result.timestamp || [];
  const closes = result.indicators?.quote?.[0]?.close || [];
  return timestamps
    .map((timestamp, index) => ({ timestamp, close: closes[index] }))
    .filter((point) => Number.isFinite(point.close));
};

const formatTime = (timestamp, timezone) =>
  new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', timeZone: timezone || undefined }).format(new Date(timestamp * 1000));

const toUsd = (value, currency, fx) => {
  if (currency === 'KRW') return value / fx.usdKrw;
  if (currency === 'EUR') return value * fx.eurUsd;
  if (currency === 'GBp') return (value / 100) * fx.gbpUsd;
  return value;
};

const fallbackPrice = (index, symbol) => {
  const seed = symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 80 + ((seed + index * 17) % 420);
};

const makeFallback = (company, index, fx) => {
  const base = fallbackPrice(index, company.symbol);
  const points = Array.from({ length: 48 }, (_, pointIndex) => ({
    timestamp: Math.floor(Date.now() / 1000) - (47 - pointIndex) * 60,
    close: base * (1 + Math.sin((pointIndex + index) / 6) * 0.01),
  }));
  const price = points.at(-1).close;
  const previousPrice = points.at(-2).close;
  const marketCapLocal = price * company.sharesOutstanding;
  return {
    ...company,
    price,
    previousPrice,
    changePercent: ((price - previousPrice) / previousPrice) * 100,
    marketCapUsd: toUsd(marketCapLocal, company.currency, fx),
    points,
    timezone: 'Asia/Seoul',
    isFallback: true,
  };
};

const makeSnapshot = (company, result, fx) => {
  const meta = result.meta || {};
  const points = getPoints(result);
  const price = meta.regularMarketPrice || points.at(-1)?.close || 0;
  const previousPrice = meta.previousClose || meta.chartPreviousClose || points.at(-2)?.close || price;
  const currency = meta.currency || company.currency;
  const marketCapLocal = price * company.sharesOutstanding;
  return {
    ...company,
    currency,
    price,
    previousPrice,
    changePercent: previousPrice ? ((price - previousPrice) / previousPrice) * 100 : 0,
    marketCapUsd: toUsd(marketCapLocal, currency, fx),
    points: points.slice(-60),
    timezone: meta.exchangeTimezoneName,
    isFallback: false,
  };
};

export const fetchDefenseMarketData = async () => {
  const fx = {
    usdKrw: await fetchFx('KRW=X', 1350),
    eurUsd: await fetchFx('EURUSD=X', 1.08),
    gbpUsd: await fetchFx('GBPUSD=X', 1.25),
  };
  const settled = await Promise.allSettled(
    defenseMarketCompanies.map(async (company) => makeSnapshot(company, await fetchChart(company.symbol), fx))
  );
  const companies = settled
    .map((item, index) => (item.status === 'fulfilled' ? item.value : makeFallback(defenseMarketCompanies[index], index, fx)))
    .sort((a, b) => b.marketCapUsd - a.marketCapUsd);
  return { companies, fx, hasFallback: companies.some((company) => company.isFallback), lastUpdated: new Date().toISOString() };
};

export const buildDefenseMarketSeries = (companies, selectedIds) => {
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
      const latestValue = company.marketCapUsd / 1_000_000_000;
      row[company.companyId] = latestValue * (point.close / company.price);
    });
    if (Object.keys(row).length > 1) rows.push(row);
  }
  return rows;
};
