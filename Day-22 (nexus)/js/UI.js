/**
 * UI.js — Rendering Module
 * All DOM mutation lives here. Pure functions that receive data and
 * write to the DOM — no state, no fetch calls.
 */

// ── DOM References ───────────────────────────────────────────
const coinGrid     = document.getElementById('coinGrid');
const errorBanner  = document.getElementById('errorBanner');
const errorMsg     = document.getElementById('errorMsg');
const emptyState   = document.getElementById('emptyState');
const emptyMsg     = document.getElementById('emptyStateMsg');
const statTotal    = document.getElementById('statTotal');
const statShowing  = document.getElementById('statShowing');
const statFavorites= document.getElementById('statFavorites');
const statUpdated  = document.getElementById('statUpdated');
const toast        = document.getElementById('toast');
const toastMsg     = document.getElementById('toastMsg');
const toastIcon    = document.getElementById('toastIcon');
const themeIcon    = document.getElementById('themeIcon');

let toastTimer = null;   // tracks the hide timeout


// ══════════════════════════════════════════════════════════════
//  SKELETON LOADING
// ══════════════════════════════════════════════════════════════

/**
 * Render N skeleton placeholder cards while data is loading.
 * @param {number} [count=12]
 */
export function renderSkeletons(count = 12) {
  hideEmpty();
  hideError();

  coinGrid.innerHTML = Array.from({ length: count }, buildSkeletonCard).join('');
}

/**
 * Build a single skeleton card string.
 * @returns {string}
 */
function buildSkeletonCard() {
  return /* html */`
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-card__header">
        <div class="skeleton skeleton-card__avatar"></div>
        <div class="skeleton-card__lines">
          <div class="skeleton skeleton-card__line wide"></div>
          <div class="skeleton skeleton-card__line short"></div>
        </div>
        <div class="skeleton skeleton-card__badge"></div>
      </div>
      <div class="skeleton skeleton-card__price"></div>
      <div class="skeleton-card__stats">
        <div class="skeleton skeleton-card__stat"></div>
        <div class="skeleton skeleton-card__stat"></div>
        <div class="skeleton skeleton-card__stat"></div>
        <div class="skeleton skeleton-card__stat"></div>
      </div>
      <div class="skeleton-card__footer">
        <div class="skeleton skeleton-card__footer-l"></div>
        <div class="skeleton skeleton-card__footer-r"></div>
      </div>
    </div>`;
}


// ══════════════════════════════════════════════════════════════
//  COIN CARDS
// ══════════════════════════════════════════════════════════════

/**
 * Render an array of coins as cards inside the grid.
 * @param {import('./API.js').CoinData[]} coins        - Coins to display
 * @param {string[]}                      favoriteIds  - Array of favorited coin IDs
 */
export function renderCoins(coins, favoriteIds) {
  hideError();

  if (coins.length === 0) {
    coinGrid.innerHTML = '';
    showEmpty('No coins match your search. Try a different term.');
    return;
  }

  hideEmpty();
  coinGrid.innerHTML = coins.map(coin => buildCoinCard(coin, favoriteIds)).join('');
}

/**
 * Build a single coin card using template literals.
 * @param {import('./API.js').CoinData} coin
 * @param {string[]} favoriteIds
 * @returns {string}
 */
function buildCoinCard(coin, favoriteIds) {
  const isFav       = favoriteIds.includes(coin.id);
  const changeVal   = coin.price_change_percentage_24h;
  const changeSign  = changeVal >= 0 ? '+' : '';
  const changeClass = changeVal >= 0 ? 'positive' : 'negative';
  const changeArrow = changeVal >= 0
    ? '<i class="fa-solid fa-arrow-trend-up"></i>'
    : '<i class="fa-solid fa-arrow-trend-down"></i>';

  // High/Low position as a percentage of the 24h range
  const range = coin.high_24h - coin.low_24h;
  const hlPct = range > 0
    ? Math.min(100, Math.max(0, ((coin.current_price - coin.low_24h) / range) * 100))
    : 50;

  return /* html */`
    <article
      class="coin-card${isFav ? ' coin-card--favorite' : ''}"
      data-id="${coin.id}"
      aria-label="${coin.name} — ${formatCurrency(coin.current_price)}"
    >
      <!-- Header: identity + rank -->
      <div class="coin-card__header">
        <div class="coin-card__identity">
          <img
            class="coin-card__img"
            src="${coin.image}"
            alt="${coin.name} logo"
            loading="lazy"
            width="36"
            height="36"
            onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 36 36%22%3E%3Ccircle cx=%2218%22 cy=%2218%22 r=%2218%22 fill=%22%23333%22/%3E%3C/svg%3E'"
          />
          <div>
            <div class="coin-card__name">${escapeHtml(coin.name)}</div>
            <div class="coin-card__symbol">${escapeHtml(coin.symbol)}</div>
          </div>
        </div>
        <span class="coin-card__rank">#${coin.market_cap_rank}</span>
      </div>

      <!-- Price + 24h change -->
      <div class="coin-card__price-row">
        <span class="coin-card__price">${formatCurrency(coin.current_price)}</span>
        <span class="coin-card__change ${changeClass}">
          ${changeArrow}
          ${changeSign}${changeVal.toFixed(2)}%
        </span>
      </div>

      <!-- Stats grid -->
      <div class="coin-card__stats">
        <div class="coin-card__stat">
          <span class="coin-card__stat-label">Market Cap</span>
          <span class="coin-card__stat-value">${formatCompact(coin.market_cap)}</span>
        </div>
        <div class="coin-card__stat">
          <span class="coin-card__stat-label">24h Volume</span>
          <span class="coin-card__stat-value">${formatCompact(coin.total_volume)}</span>
        </div>
        <div class="coin-card__stat">
          <span class="coin-card__stat-label">24h High</span>
          <span class="coin-card__stat-value">${formatCurrency(coin.high_24h)}</span>
        </div>
        <div class="coin-card__stat">
          <span class="coin-card__stat-label">24h Low</span>
          <span class="coin-card__stat-value">${formatCurrency(coin.low_24h)}</span>
        </div>
      </div>

      <!-- 24h High/Low position bar -->
      <div class="coin-card__hl" title="Price position in today's range">
        <span>${formatCurrency(coin.low_24h)}</span>
        <div class="coin-card__hl-bar" role="meter" aria-valuenow="${hlPct.toFixed(0)}" aria-valuemin="0" aria-valuemax="100">
          <div class="coin-card__hl-fill" style="width:${hlPct.toFixed(1)}%"></div>
        </div>
        <span>${formatCurrency(coin.high_24h)}</span>
      </div>

      <!-- Footer: supply + watchlist button -->
      <div class="coin-card__footer">
        <span class="coin-card__footer-link">
          <i class="fa-solid fa-coins" aria-hidden="true"></i>
          ${formatCompact(coin.circulating_supply)} ${escapeHtml(coin.symbol)}
        </span>
        <button
          class="favorite-btn${isFav ? ' active' : ''}"
          data-id="${coin.id}"
          aria-label="${isFav ? 'Remove from watchlist' : 'Add to watchlist'}"
          aria-pressed="${isFav}"
          title="${isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}"
        >
          <i class="fa-${isFav ? 'solid' : 'regular'} fa-star" aria-hidden="true"></i>
        </button>
      </div>
    </article>`;
}


// ══════════════════════════════════════════════════════════════
//  ERROR / EMPTY STATE
// ══════════════════════════════════════════════════════════════

/**
 * Show the error banner with a given message.
 * @param {string} message
 */
export function showError(message) {
  coinGrid.innerHTML = '';
  hideEmpty();
  errorMsg.textContent = message;
  errorBanner.hidden = false;
}

/** Hide the error banner. */
export function hideError() {
  errorBanner.hidden = true;
}

/**
 * Show the empty-state panel with a custom message.
 * @param {string} [message]
 */
function showEmpty(message = 'Nothing to show here.') {
  emptyMsg.textContent = message;
  emptyState.hidden = false;
}

/** Hide the empty-state panel. */
export function hideEmpty() {
  emptyState.hidden = true;
}

/**
 * Show the empty state for the watchlist view.
 */
export function showWatchlistEmpty() {
  coinGrid.innerHTML = '';
  showEmpty("You haven't added any coins to your Watchlist yet.\nClick the ★ on any card to save it here.");
}


// ══════════════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════════════

/**
 * Display a brief toast notification.
 * @param {string} message
 * @param {'success'|'danger'|'info'} [type='success']
 * @param {number} [duration=2800]  milliseconds
 */
export function showToast(message, type = 'success', duration = 2800) {
  const iconMap = {
    success: 'fa-circle-check',
    danger:  'fa-circle-xmark',
    info:    'fa-circle-info',
  };

  toastMsg.textContent         = message;
  toastIcon.className          = `fa-solid ${iconMap[type] ?? iconMap.info} toast__icon ${type}`;
  toast.className              = 'toast visible';

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, duration);
}


// ══════════════════════════════════════════════════════════════
//  STATS BAR
// ══════════════════════════════════════════════════════════════

/**
 * Refresh the stat counters in the header stats bar.
 * @param {number} total
 * @param {number} showing
 * @param {number} favorites
 */
export function updateStats(total, showing, favorites) {
  statTotal.textContent     = total.toLocaleString();
  statShowing.textContent   = showing.toLocaleString();
  statFavorites.textContent = favorites.toLocaleString();
  statUpdated.textContent   = new Date().toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
  });
}


// ══════════════════════════════════════════════════════════════
//  THEME
// ══════════════════════════════════════════════════════════════

/**
 * Apply a theme to the document element and update the toggle icon.
 * @param {'dark'|'light'} theme
 */
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark'
    ? 'fa-solid fa-moon'
    : 'fa-solid fa-sun';
}


// ══════════════════════════════════════════════════════════════
//  TINY UTILITIES (private to this module)
// ══════════════════════════════════════════════════════════════

/**
 * Format a number as a US-dollar currency string.
 * Automatically selects 2 or 6 decimal places based on magnitude.
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  if (value === 0) return '$0.00';
  const decimals = value >= 1 ? 2 : 6;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a large number into a compact human-readable string.
 * e.g. 1_200_000 → "$1.2M"
 * @param {number} value
 * @returns {string}
 */
function formatCompact(value) {
  if (value === 0) return '—';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Simple HTML escape to prevent XSS from coin names/symbols.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
