const FINNHUB_PROXY_ENDPOINT = '/api/finnhub';

const isTradableSymbol = (symbol) => symbol && !symbol.endsWith('.PRIVATE');

export const hasFinnhubPrice = (quote) => Number.isFinite(quote?.c) && quote.c > 0;

export const fetchFinnhubQuoteMap = async (symbols) => {
  const tradableSymbols = [...new Set(symbols.filter(isTradableSymbol))];
  if (!tradableSymbols.length) return new Map();

  const response = await fetch(
    `${FINNHUB_PROXY_ENDPOINT}?endpoint=quote&symbols=${tradableSymbols.map(encodeURIComponent).join(',')}`
  );

  if (!response.ok) {
    throw new Error(`Finnhub quote failed: ${response.status}`);
  }

  const data = await response.json();
  const quotes = Array.isArray(data.quotes) ? data.quotes : [];

  return new Map(
    quotes
      .filter((quote) => hasFinnhubPrice(quote))
      .map((quote) => [quote.symbol, quote])
  );
};
