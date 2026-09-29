import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DataGridRutinasTerminadas from './DataGridRutinasTerminadas';
import { getRutinasTerminadas } from '../../API/APIFunctions';
import { colors, typography, shadows } from '../../../../styles/alpacladdFvDesignTokens';
import {
  loadCache,
  loadCacheAsync,
  saveCache,
  fingerprintList,
  compareFingerprints,
  normalizeRutinasTerminadasResponse,
  filterRutinasPorAnio,
  sortRutinasPorFechaDesc,
  withRowIds,
} from './rutinasTerminadasCache';

/** Evita pedidos concurrentes (prefetch + mount). */
let inflightPromise = null;

const ANIO_FILTRO = 2026;

function prepareItems(raw) {
  return withRowIds(sortRutinasPorFechaDesc(filterRutinasPorAnio(raw, ANIO_FILTRO)));
}

/**
 * Trae del API, filtra año 2026 y actualiza cache. No reformatea fechas.
 */
export async function fetchAndCacheRutinasTerminadas({ force = false } = {}) {
  if (inflightPromise && !force) return inflightPromise;

  const run = (async () => {
    const respuesta = await getRutinasTerminadas(force);
    console.log('[RutinasTerminadas] respuesta cruda del API:', respuesta?.data);
    const raw = normalizeRutinasTerminadasResponse(respuesta?.data);
    console.log('[RutinasTerminadas] filas normalizadas:', raw?.length, raw);
    console.log(
      '[RutinasTerminadas] sample fecha_registro (primeras 10):',
      (raw || []).slice(0, 10).map((r) => ({
        rutina: r?.rutina,
        fecha_registro: r?.fecha_registro,
        typeof_fecha: typeof r?.fecha_registro,
      }))
    );
    const nextItems = prepareItems(raw);
    console.log('[RutinasTerminadas] filas tras filtro año ..26:', nextItems?.length);
    saveCache({ items: nextItems });
    return nextItems;
  })();

  inflightPromise = run.finally(() => {
    inflightPromise = null;
  });
  return inflightPromise;
}

/** Prefetch al entrar a Reportes. */
export function prefetchRutinasTerminadas() {
  const cached = loadCache();
  if (cached?.items?.length) {
    fetchAndCacheRutinasTerminadas({ force: false }).catch(() => {});
    return;
  }
  loadCacheAsync().then(() => {
    fetchAndCacheRutinasTerminadas({ force: false }).catch(() => {});
  });
}

const btnSx = {
  fontFamily: 'Poppins',
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '10px',
  borderColor: colors.brand,
  color: colors.brand,
  '&:hover': { borderColor: colors.brand, backgroundColor: 'rgba(26,72,98,0.06)' },
};

const RutinasTerminadas = () => {
  const initial = loadCache();
  const [rows, setRows] = useState(() => prepareItems(initial?.items || []));
  const [loading, setLoading] = useState(() => !(initial?.items?.length));
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(() => initial?.updatedAt || null);
  const mountedRef = useRef(true);

  const applyRows = useCallback((items, at = Date.now()) => {
    setRows(prepareItems(items));
    setUpdatedAt(at);
  }, []);

  const revalidate = useCallback(async ({ force = false } = {}) => {
    const hasRows = rows.length > 0 || loadCache()?.items?.length;

    if (force && !hasRows) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const prevCache = loadCache();
      const prevFp = fingerprintList(prevCache?.items || []);
      const nextItems = await fetchAndCacheRutinasTerminadas({ force });
      const nextFp = fingerprintList(nextItems);
      const { changed } = compareFingerprints(prevFp, nextFp);

      if (!mountedRef.current) return;

      if (force || changed || !prevCache?.items?.length) {
        applyRows(nextItems, Date.now());
      } else if (prevCache?.updatedAt) {
        setUpdatedAt(Date.now());
      }
    } catch (error) {
      console.error('Error al cargar rutinas terminadas:', error);
      if (!mountedRef.current) return;
      const cached = loadCache();
      if (cached?.items?.length && rows.length === 0) {
        applyRows(cached.items, cached.updatedAt);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [applyRows, rows.length]);

  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      if (!rows.length) {
        const asyncCache = await loadCacheAsync();
        if (!mountedRef.current) return;
        if (asyncCache?.items?.length) {
          applyRows(asyncCache.items, asyncCache.updatedAt);
          setLoading(false);
        }
      }

      revalidate({ force: false });
    })();

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const busy = loading || refreshing;

  return (
    <Box sx={{ px: { xs: 1, md: 1.5 }, pb: 2 }}>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(26, 72, 98, 0.06)',
          boxShadow: shadows.dashboard,
          p: { xs: 1.5, md: 2 },
          mb: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
        >
          <Box>
            <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>Rutinas terminadas</Typography>
            <Typography sx={{ fontFamily: typography.fontFamily, color: colors.textMuted, fontSize: '0.85rem' }}>
              Ensayos finalizados del año {ANIO_FILTRO}
              {updatedLabel ? ` · Actualizado: ${updatedLabel}` : ''}
              {refreshing ? ' · Buscando novedades…' : ''}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={busy ? <CircularProgress size={16} /> : <RefreshIcon />}
            disabled={busy}
            onClick={() => revalidate({ force: true })}
            sx={btnSx}
          >
            Actualizar
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(26, 72, 98, 0.06)',
          boxShadow: shadows.dashboard,
          overflow: 'hidden',
          p: { xs: 1, md: 1.25 },
          minHeight: 280,
          position: 'relative',
        }}
      >
        {loading && rows.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              gap: 1.5,
            }}
          >
            <CircularProgress sx={{ color: colors.brand }} />
            <Typography sx={{ fontFamily: typography.fontFamily, color: colors.textMuted, fontSize: '0.9rem' }}>
              Cargando rutinas terminadas…
            </Typography>
          </Box>
        ) : (
          <DataGridRutinasTerminadas
            rows={rows}
            filename={`Rutinas Finalizadas ${new Date().toLocaleDateString('es-AR')}`}
          />
        )}
      </Box>
    </Box>
  );
};

export default RutinasTerminadas;
