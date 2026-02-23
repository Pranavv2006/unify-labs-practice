/**
 * App.js — State & Event Orchestration Module
 * Central controller that wires together API.js and UI.js.
 * Owns the State object, all event listeners, search/sort/filter
 * logic via functional programming, and LocalStorage persistence.
 */

import { fetchCoins }                    from './API.js';
import {
  renderSkeletons,
  renderCoins,
  showError,
  hideError,
  hideEmpty,
  showWatchlistEmpty,
  showToast,
  updateStats,
  applyTheme,
} from './UI.js';


// ══════════════════════════════════════════════════════════════
//  STORAGE KEYS
// ══════════════════════════════════════════════════════════════
const STORAGE_KEYS = {
  FAVORITES : 'nexus_favorites',
  THEME     : 'nexus_theme',
  SORT_BY   : 'nexus_sort_by',
  SORT_ORDER: 'nexus_sort_order',
};


// ══════════════════════════════════════════════════════════════
//  CENTRAL STATE
//  Single source of truth for the entire application.
// ══════════════════════════════════════════════════════════════

/** @type {AppState} */
const State = {
  /** All coins returned from the API (raw, un-filtered) */
  allCoins: [],

  /** Coin IDs saved to the watchlist */
  favorites: loadFromStorage(STORAGE_KEYS.FAVORITES, []),

  /** Current search string typed by the user */
  searchQuery: '',

  /** Field currently used for sorting */
  sortBy: loadFromStorage(STORAGE_KEYS.SORT_BY, 'market_cap'),

  /** 'asc' | 'desc' */
  sortOrder: loadFromStorage(STORAGE_KEYS.SORT_ORDER, 'desc'),

  /** 'dark' | 'light' */
  theme: loadFromStorage(STORAGE_KEYS.THEME, 'dark'),

  /** Whether the watchlist-only filter is active */
  watchlistOnly: false,

  /** Whether a fetch is currently in-flight */
  isLoading: false,
};

/**
 * @typedef {'asc'|'desc'}           SortOrder
 * @typedef {'market_cap'|'price'|'change'|'name'|'volume'} SortField
 * @typedef {Object} AppState
 * @property {import('./API.js').CoinData[]} allCoins
 * @property {string[]}  favorites
 * @property {string}    searchQuery
 * @property {SortField} sortBy
 * @property {SortOrder} sortOrder
 * @property {'dark'|'light'} theme
 * @property {boolean}   watchlistOnly
 * @property {boolean}   isLoading
 */


// ══════════════════════════════════════════════════════════════
//  FUNCTIONAL DATA PIPELINE
//  filter → sort → render
// ══════════════════════════════════════════════════════════════

/**
 * Apply search, watchlist filter, and sort order to State.allCoins.
 * Uses .filter() and .sort() — no mutation of the original array.
 * @returns {import('./API.js').CoinData[]}
 */
function deriveVisibleCoins() {
  const query = State.searchQuery.toLowerCase().trim();

  // ── 1. Filter by search query (name OR symbol) ──────────────
  const searched = State.allCoins.filter(coin => {
    if (!query) return true;
    return (
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
    );
  });

  // ── 2. Filter to watchlist only (if toggled) ─────────────────
  const watchlisted = State.watchlistOnly
    ? searched.filter(coin => State.favorites.includes(coin.id))
    : searched;

  // ── 3. Sort using .sort() + a sorter function ────────────────
  const sortedCoins = [...watchlisted].sort(getSorter(State.sortBy, State.sortOrder));

  return sortedCoins;
}

/**
 * Return a comparator function for a given field + order.
 * @param {SortField}  field
 * @param {SortOrder}  order
 * @returns {(a: CoinData, b: CoinData) => number}
 */
function getSorter(field, order) {
  const direction = order === 'asc' ? 1 : -1;

  const comparators = {
    market_cap : (a, b) => direction * (a.market_cap                  - b.market_cap),
    price      : (a, b) => direction * (a.current_price               - b.current_price),
    change     : (a, b) => direction * (a.price_change_percentage_24h - b.price_change_percentage_24h),
    name       : (a, b) => direction * a.name.localeCompare(b.name),
    volume     : (a, b) => direction * (a.total_volume                - b.total_volume),
  };

  return comparators[field] ?? comparators.market_cap;
}

/**
 * Re-derive visible coins and push them to the UI.
 * Central render coordinator — call this whenever State changes.
 */
function renderView() {
  const visible = deriveVisibleCoins();
  renderCoins(visible, State.favorites);
  updateStats(State.allCoins.length, visible.length, State.favorites.length);
}


// ══════════════════════════════════════════════════════════════
//  DATA FETCHING
// ══════════════════════════════════════════════════════════════

/**
 * Fetch fresh coin data, update State, and re-render.
 * Shows skeletons while loading, handles errors gracefully.
 */
async function loadData() {
  if (State.isLoading) return;           // prevent double-fetch
  State.isLoading = true;
  setRefreshSpinner(true);
  renderSkeletons(20);

  try {
    const coins = await fetchCoins();

    // Store raw data in State
    State.allCoins = coins;

    // Render updated view
    renderView();
    showToast(`${coins.length} coins loaded successfully`, 'success');

  } catch (/** @type {any} */ err) {
    // Graceful degradation: show inline error; keep any stale data
    showError(err.message ?? 'An unknown error occurred.');
    showToast('Failed to load data', 'danger');
    console.error('[NEXUS] Fetch error:', err);

  } finally {
    State.isLoading = false;
    setRefreshSpinner(false);
  }
}

/** Toggle the spinning animation on the refresh button. */
function setRefreshSpinner(active) {
  const btn = document.getElementById('refreshBtn');
  btn?.classList.toggle('spinning', active);
}


// ══════════════════════════════════════════════════════════════
//  FAVORITES / WATCHLIST (LocalStorage persistence)
// ══════════════════════════════════════════════════════════════

/**
 * Toggle a coin in/out of the favorites list.
 * Persists the updated list to localStorage.
 * @param {string} coinId
 */
function toggleFavorite(coinId) {
  const coin      = State.allCoins.find(c => c.id === coinId);
  const coinName  = coin?.name ?? coinId;
  const isNowFav  = State.favorites.includes(coinId);

  if (isNowFav) {
    // ── Remove using .filter() ─ pure, no mutation ──────────
    State.favorites = State.favorites.filter(id => id !== coinId);
    showToast(`${coinName} removed from Watchlist`, 'info');
  } else {
    // ── Add ──────────────────────────────────────────────────
    State.favorites = [...State.favorites, coinId];
    showToast(`${coinName} added to Watchlist ★`, 'success');
  }

  saveToStorage(STORAGE_KEYS.FAVORITES, State.favorites);

  // Re-render so the star button and card border update instantly
  renderView();

  // If watchlist view is active and we just un-starred, handle empty state
  if (State.watchlistOnly && State.favorites.length === 0) {
    showWatchlistEmpty();
  }
}


// ══════════════════════════════════════════════════════════════
//  THEME TOGGLE (LocalStorage persistence)
// ══════════════════════════════════════════════════════════════

/**
 * Toggle between dark and light themes.
 * Persists the choice in localStorage.
 */
function toggleTheme() {
  State.theme = State.theme === 'dark' ? 'light' : 'dark';
  applyTheme(State.theme);
  saveToStorage(STORAGE_KEYS.THEME, State.theme);
  showToast(`${State.theme === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'info');
}


// ══════════════════════════════════════════════════════════════
//  EVENT HANDLERS
// ══════════════════════════════════════════════════════════════

/** Wire up all event listeners. Called once on DOMContentLoaded. */
function bindEvents() {

  // ── Search input ─────────────────────────────────────────────
  const searchInput  = document.getElementById('searchInput');
  const clearSearch  = document.getElementById('clearSearch');

  searchInput?.addEventListener('input', e => {
    State.searchQuery = e.target.value;
    clearSearch.hidden = State.searchQuery.length === 0;
    renderView();
  });

  clearSearch?.addEventListener('click', () => {
    searchInput.value   = '';
    State.searchQuery   = '';
    clearSearch.hidden  = true;
    searchInput.focus();
    renderView();
  });

  // ── Sort select ───────────────────────────────────────────────
  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', e => {
    State.sortBy = /** @type {SortField} */ (e.target.value);
    saveToStorage(STORAGE_KEYS.SORT_BY, State.sortBy);
    renderView();
  });

  // ── Sort order toggle ─────────────────────────────────────────
  const sortOrderBtn  = document.getElementById('sortOrderBtn');
  const sortOrderIcon = document.getElementById('sortOrderIcon');

  sortOrderBtn?.addEventListener('click', () => {
    State.sortOrder = State.sortOrder === 'desc' ? 'asc' : 'desc';
    saveToStorage(STORAGE_KEYS.SORT_ORDER, State.sortOrder);
    sortOrderBtn.classList.toggle('asc', State.sortOrder === 'asc');
    sortOrderIcon.className = State.sortOrder === 'asc'
      ? 'fa-solid fa-arrow-up-wide-short'
      : 'fa-solid fa-arrow-down-wide-short';
    sortOrderBtn.title = State.sortOrder === 'asc' ? 'Ascending' : 'Descending';
    renderView();
  });

  // ── Watchlist toggle ──────────────────────────────────────────
  const watchlistToggle = document.getElementById('watchlistToggle');

  watchlistToggle?.addEventListener('click', () => {
    State.watchlistOnly = !State.watchlistOnly;
    watchlistToggle.setAttribute('aria-pressed', String(State.watchlistOnly));
    watchlistToggle.classList.toggle('active-watchlist', State.watchlistOnly);

    if (State.watchlistOnly && State.favorites.length === 0) {
      showWatchlistEmpty();
      updateStats(State.allCoins.length, 0, 0);
      return;
    }

    renderView();
  });

  // ── Refresh button ────────────────────────────────────────────
  document.getElementById('refreshBtn')?.addEventListener('click', loadData);

  // ── Error retry ───────────────────────────────────────────────
  document.getElementById('retryBtn')?.addEventListener('click', () => {
    hideError();
    loadData();
  });

  // ── Theme toggle ──────────────────────────────────────────────
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

  // ── Delegated click on coin grid (favorite buttons) ───────────
  document.getElementById('coinGrid')?.addEventListener('click', e => {
    const favBtn = /** @type {HTMLElement} */ (e.target).closest('.favorite-btn');
    if (favBtn) {
      const coinId = favBtn.dataset.id;
      if (coinId) toggleFavorite(coinId);
    }
  });

  // ── Keyboard shortcut: "/" focuses search ─────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput?.focus();
    }
  });
}


// ══════════════════════════════════════════════════════════════
//  LOCALSTORAGE HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Read and parse a value from localStorage.
 * Returns `defaultValue` if the key is missing or JSON parsing fails.
 * @template T
 * @param {string} key
 * @param {T}      defaultValue
 * @returns {T}
 */
function loadFromStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Serialize and write a value to localStorage.
 * Silently ignores errors (e.g. private-browsing quota limits).
 * @param {string} key
 * @param {unknown} value
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('[NEXUS] localStorage write failed:', err);
  }
}


// ══════════════════════════════════════════════════════════════
//  INIT — Initialise UI state from persisted preferences
// ══════════════════════════════════════════════════════════════

/**
 * Restore persisted UI state before the first render.
 */
function restoreUIState() {
  // Theme
  applyTheme(State.theme);

  // Sort select dropdown
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = State.sortBy;

  // Sort order button icon
  const sortOrderBtn  = document.getElementById('sortOrderBtn');
  const sortOrderIcon = document.getElementById('sortOrderIcon');
  if (sortOrderBtn && sortOrderIcon) {
    sortOrderBtn.classList.toggle('asc', State.sortOrder === 'asc');
    sortOrderIcon.className = State.sortOrder === 'asc'
      ? 'fa-solid fa-arrow-up-wide-short'
      : 'fa-solid fa-arrow-down-wide-short';
  }
}

// ── ENTRY POINT ──────────────────────────────────────────────
restoreUIState();
bindEvents();
loadData();

// ── Auto-refresh every 90 seconds ───────────────────────────
setInterval(loadData, 90_000);
