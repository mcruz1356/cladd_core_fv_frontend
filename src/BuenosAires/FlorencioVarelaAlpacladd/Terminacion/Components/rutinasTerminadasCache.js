const CACHE_KEY = 'fv_rutinas_terminadas_cache_v9';
const IDB_NAME = 'fv_terminacion_cache';
const IDB_STORE = 'kv';
const DEFAULT_TTL_MS = 10 * 60 * 1000;

/** @type {{ items: any[], updatedAt: number } | null} */
let memoryCache = null;
let idbReady = null;

function openIdb() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  if (idbReady) return idbReady;
  idbReady = new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return idbReady;
}

async function idbGet(key) {
  const db = await openIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(key, value) {
  const db = await openIdb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

function readLocalStorage() {
  try {
    const raw = localStorage.getItem(CACHE_KEY) || sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return {
      items: parsed.items,
      updatedAt: parsed.updatedAt || 0,
    };
  } catch {
    return null;
  }
}

function writeLocalStorage(payload) {
  const raw = JSON.stringify(payload);
  try {
    localStorage.setItem(CACHE_KEY, raw);
    return true;
  } catch {
    try {
      sessionStorage.setItem(CACHE_KEY, raw);
      return true;
    } catch {
      return false;
    }
  }
}

function itemFingerprint(item) {
  const id = item?.id ?? item?.rutina ?? '';
  const resultado = item?.resultado ?? '';
  const fecha = item?.fecha_registro ?? '';
  const rutina = item?.rutina ?? '';
  return `${id}|${rutina}|${resultado}|${fecha}`;
}

/**
 * Lectura síncrona (memoria / localStorage). Para el primer paint.
 * @returns {{ items: any[], updatedAt: number } | null}
 */
export function loadCache() {
  if (memoryCache?.items?.length) return memoryCache;
  const fromLs = readLocalStorage();
  if (fromLs?.items?.length) {
    memoryCache = fromLs;
    return memoryCache;
  }
  return memoryCache;
}

/**
 * Completa cache desde IndexedDB si localStorage no alcanzó (datasets grandes).
 * @returns {Promise<{ items: any[], updatedAt: number } | null>}
 */
export async function loadCacheAsync() {
  const sync = loadCache();
  if (sync?.items?.length) return sync;
  const fromIdb = await idbGet(CACHE_KEY);
  if (fromIdb && Array.isArray(fromIdb.items) && fromIdb.items.length) {
    memoryCache = {
      items: fromIdb.items,
      updatedAt: fromIdb.updatedAt || 0,
    };
    return memoryCache;
  }
  return null;
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
  writeLocalStorage(next);
  idbSet(CACHE_KEY, next).catch(() => {});
  return next;
}

export function clearCache() {
  memoryCache = null;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
  idbSet(CACHE_KEY, null).catch(() => {});
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

/**
 * Normaliza la respuesta del SP (puede venir como [rows] o rows).
 * @param {any} data
 * @returns {any[]}
 */
export function normalizeRutinasTerminadasResponse(data) {
  if (!data) return [];
  if (Array.isArray(data?.data)) return normalizeRutinasTerminadasResponse(data.data);
  if (!Array.isArray(data)) return [];
  // mysql2 CALL: [rows, ResultSetHeader, ...]
  if (data.length > 0 && Array.isArray(data[0])) {
    return data[0];
  }
  return data;
}

/**
 * Filtra por año en fecha_registro.
 * En DB llega como "dd-mm-yy" (ej: "07-05-25") → se filtra por los 2 dígitos finales ("26").
 * @param {any[]} items
 * @param {number} [anio=2026]
 * @returns {any[]}
 */
export function filterRutinasPorAnio(items, anio = 2026) {
  const yy = String(anio).slice(-2); // 2026 → "26"
  return (items || []).filter((row) => {
    const fecha = row?.fecha_registro;
    if (fecha == null || fecha === '') return false;
    const s = String(fecha).trim();
    // Formato DB: dd-mm-yy
    const dmy = s.match(/^\d{1,2}-\d{1,2}-(\d{2})$/);
    if (dmy) return dmy[1] === yy;
    // Fallback si viniera con 4 dígitos u otro separador
    if (s.endsWith(`-${yy}`) || s.endsWith(`/${yy}`)) return true;
    return s.includes(String(anio));
  });
}

/** Clave numérica YYYYMMDD para ordenar fechas "dd-mm-yy" sin reformatear. */
export function fechaRegistroSortKey(fecha) {
  const s = String(fecha ?? '').trim();
  const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{2})$/);
  if (!m) return 0;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = 2000 + Number(m[3]);
  return year * 10000 + month * 100 + day;
}

/**
 * Más nueva → más antigua (por fecha_registro dd-mm-yy).
 * @param {any[]} items
 * @returns {any[]}
 */
export function sortRutinasPorFechaDesc(items) {
  return [...(items || [])].sort(
    (a, b) => fechaRegistroSortKey(b?.fecha_registro) - fechaRegistroSortKey(a?.fecha_registro)
  );
}

/**
 * @param {any[]} items
 * @returns {any[]}
 */
export function withRowIds(items) {
  return (items || []).map((row, idx) => ({
    ...row,
    id: row.id ?? row.rutina ?? `rt-${idx}`,
  }));
}
