/* global process */

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const QUOTE_CACHE_TTL_MS = 55_000;
const MAX_SYMBOLS_PER_REQUEST = 120;
const MAX_CONCURRENCY = 5;

const cache = globalThis.__wortoutFinnhubCache || new Map();
globalThis.__wortoutFinnhubCache = cache;

const json = (res, status, payload) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res.status(status).json(payload);
};

const uniqueSymbols = (value) =>
  [...new Set(String(value || '').split(',').map((symbol) => symbol.trim()).filter(Boolean))]
    .slice(0, MAX_SYMBOLS_PER_REQUEST);

const fetchFinnhubQuote = async (symbol, token) => {
  const key = `quote:${symbol}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < QUOTE_CACHE_TTL_MS) {
    return cached.data;
  }

  const url = new URL(`${FINNHUB_BASE_URL}/quote`);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('token', token);

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  const quote = response.ok
    ? {
        symbol,
        c: Number(data.c),
        d: Number(data.d),
        dp: Number(data.dp),
        h: Number(data.h),
        l: Number(data.l),
        o: Number(data.o),
        pc: Number(data.pc),
        t: Number(data.t),
      }
    : { symbol, error: `quote failed: ${response.status}` };

  cache.set(key, { time: Date.now(), data: quote });
  return quote;
};

const mapWithConcurrency = async (items, limit, mapper) => {
  const results = [];
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index]);
    }
  });

  await Promise.all(workers);
  return results;
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 200, {});
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return json(res, 503, { error: 'FINNHUB_API_KEY is not configured.' });
  }

  const endpoint = String(req.query.endpoint || 'quote');
  if (endpoint !== 'quote') {
    return json(res, 400, { error: 'Unsupported Finnhub endpoint.' });
  }

  const symbols = uniqueSymbols(req.query.symbols || req.query.symbol);
  if (!symbols.length) {
    return json(res, 400, { error: 'symbols query is required.' });
  }

  try {
    const quotes = await mapWithConcurrency(symbols, MAX_CONCURRENCY, (symbol) => fetchFinnhubQuote(symbol, token));
    return json(res, 200, {
      source: 'Finnhub',
      quotes,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
