/**
 * API.js — Data Acquisition Module
 * Handles all network requests and response normalization.
 * Uses CoinGecko's free public API (no key required).
 */

// ── Constants ────────────────────────────────────────────────
const BASE_URL = 'https://api.coingecko.com/api/v3';
const COINS_ENDPOINT = `${BASE_URL}/coins/markets`;

/**
 * Default query parameters sent to CoinGecko.
 * @type {Record<string, string|number>}
 */
const DEFAULT_PARAMS = {
  vs_currency: 'usd',
  order: 'market_cap_desc',
  per_page: 50,           // fetch 50 coins (well above the 20-item minimum)
  page: 1,
  sparkline: false,
  price_change_percentage: '24h',
};

// ── Helpers ──────────────────────────────────────────────────

/**
 * Build a URL from a base string and a params object.
 * @param {string} url
 * @param {Record<string, string|number|boolean>} params
 * @returns {string}
 */
function buildUrl(url, params) {
  const query = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );
  return `${url}?${query.toString()}`;
}

// ── Public API ───────────────────────────────────────────────

/**
 * Fetch the top coins from CoinGecko.
 *
 * @returns {Promise<CoinData[]>}
 *   Resolves with a normalized array of coin objects.
 *   Rejects with an Error whose `message` is user-facing.
 *
 * @typedef {Object} CoinData
 * @property {string}      id
 * @property {string}      symbol
 * @property {string}      name
 * @property {string}      image
 * @property {number}      current_price
 * @property {number}      market_cap
 * @property {number}      market_cap_rank
 * @property {number}      total_volume
 * @property {number}      high_24h
 * @property {number}      low_24h
 * @property {number}      price_change_percentage_24h
 * @property {number}      circulating_supply
 */
export async function fetchCoins() {
  const url = buildUrl(COINS_ENDPOINT, DEFAULT_PARAMS);

  let response;

  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  } catch (networkError) {
    // fetch() itself threw — typically a Network / CORS / offline error
    throw new Error(
      'Network request failed. Check your internet connection and try again.'
    );
  }

  if (!response.ok) {
    // Map common HTTP status codes to helpful messages
    const statusMessages = {
      429: 'Rate limit reached. Please wait a moment before refreshing.',
      403: 'Access forbidden. The API may require authentication.',
      404: 'API endpoint not found. Please report this issue.',
      500: 'CoinGecko server error. Please try again later.',
    };
    const msg =
      statusMessages[response.status] ??
      `Unexpected server response (HTTP ${response.status}).`;
    throw new Error(msg);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Could not parse the server response. Try again later.');
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No coin data returned by the API.');
  }

  // Normalize: guarantee all expected fields exist with safe fallbacks
  return data.map(normalizeCoin);
}

/**
 * Normalize a raw CoinGecko coin object so the rest of the app
 * never has to deal with null / undefined field values.
 *
 * @param {object} raw
 * @returns {CoinData}
 */
function normalizeCoin(raw) {
  return {
    id:                          raw.id                          ?? 'unknown',
    symbol:                      (raw.symbol ?? '').toUpperCase(),
    name:                        raw.name                        ?? 'Unknown',
    image:                       raw.image                       ?? '',
    current_price:               raw.current_price               ?? 0,
    market_cap:                  raw.market_cap                  ?? 0,
    market_cap_rank:             raw.market_cap_rank             ?? 0,
    total_volume:                raw.total_volume                ?? 0,
    high_24h:                    raw.high_24h                    ?? 0,
    low_24h:                     raw.low_24h                     ?? 0,
    price_change_percentage_24h: raw.price_change_percentage_24h ?? 0,
    circulating_supply:          raw.circulating_supply          ?? 0,
  };
}
