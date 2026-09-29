const CACHE_KEY = 'fv_rutinas_activas_cache_v1';
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/** @type {{ items: any[], updatedAt: number } | null} */
let memoryCache = null;

function itemFingerprint(item) {
  const id = item?.id ?? item?.rutina ?? '';
  const status = item?.status ?? '';
  const resultado = item?.resultado ?? '';
  const fecha = item?.fecha ?? '';
  return `${id}|${status}|${resultado}|${fecha}`;
}

/**
 * @returns {{ items: any[], updatedAt: number } | null}
 */
export function loadCache() {
  if (memoryCache) return memoryCache;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return null;
    memoryCache = {
      items: parsed.items,
      updatedAt: parsed.updatedAt || 0,
    };
    return memoryCache;
  } catch {
    return null;
  }
}

/**
 * @param {{ items: any[] }} payload
 */
export function saveCache({ items }) {
  const next = {
    items: Array.isArray(items) ? items : [],
    updatedAt: Date.now(),
  };
  memoryCache = next;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch (err) {
    console.warn('No se pudo guardar cache Rutinas Activas:', err);
  }
  return next;
}

export function clearCache() {
  memoryCache = null;
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * @param {number} [ttlMs]
 * @returns {boolean}
 */
export function isCacheFresh(ttlMs = DEFAULT_TTL_MS) {
  const cache = loadCache();
  if (!cache?.updatedAt) return false;
  return Date.now() - cache.updatedAt <= ttlMs;
}

/**
 * @param {any[]} items
 * @returns {Record<string, string>}
 */
export function fingerprintList(items) {
  const map = {};
  (items || []).forEach((item) => {
    const key = String(item?.id ?? item?.rutina ?? '');
    if (!key) return;
    map[key] = itemFingerprint(item);
  });
  return map;
}

/**
 * @returns {{ changed: boolean }}
 */
export function compareFingerprints(prevFp, nextFp) {
  const prev = prevFp || {};
  const next = nextFp || {};
  const prevIds = Object.keys(prev);
  const nextIds = Object.keys(next);

  if (prevIds.length !== nextIds.length) return { changed: true };

  for (const id of nextIds) {
    if (prev[id] !== next[id]) return { changed: true };
  }
  for (const id of prevIds) {
    if (!(id in next)) return { changed: true };
  }

  return { changed: false };
}
