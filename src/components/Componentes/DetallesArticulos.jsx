import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Stack,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import { GetTABLAARTICULOS, GetTABLADETALLES } from '../API/APIFunctions.js';
import { colors, shadows, typography } from '../../styles/alpacladdFvDesignTokens';

const primaryBtnSx = {
  background: 'linear-gradient(145deg, #2c4356, #1e2c3a)',
  fontFamily: 'Poppins',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '10px',
  boxShadow: 'none',
  height: 40,
  '&:hover': { background: '#1A4862' },
};

const filterBarSx = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  border: `1px solid ${colors.borderSlate08}`,
  boxShadow: shadows.capsule,
  p: { xs: 1.5, md: 2 },
};

const cardSx = {
  backgroundColor: '#fff',
  borderRadius: '14px',
  border: `1px solid ${colors.borderCard}`,
  boxShadow: shadows.dashboard,
  overflow: 'hidden',
};

function displayValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'number' && Number.isNaN(value)) return '—';
  return String(value);
}

function FieldRow({ label, value }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '160px 1fr' },
        columnGap: 2,
        rowGap: 0.35,
        alignItems: 'start',
        py: 1.1,
        px: 0.25,
        borderBottom: '1px solid rgba(26, 72, 98, 0.08)',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Typography
        sx={{
          fontFamily: typography.fontFamily,
          fontSize: '0.78rem',
          fontWeight: 600,
          color: colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          lineHeight: 1.4,
          pt: { sm: 0.15 },
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: typography.fontFamily,
          fontSize: '0.95rem',
          fontWeight: 600,
          color: colors.textSlate,
          lineHeight: 1.45,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        {displayValue(value)}
      </Typography>
    </Box>
  );
}

function SectionBlock({ title, children }) {
  return (
    <Box
      sx={{
        border: '1px solid rgba(26, 72, 98, 0.08)',
        borderRadius: '12px',
        backgroundColor: 'rgba(26, 72, 98, 0.02)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 1.75,
          py: 1,
          backgroundColor: 'rgba(26, 72, 98, 0.08)',
          borderBottom: '1px solid rgba(26, 72, 98, 0.08)',
        }}
      >
        <Typography
          sx={{
            fontFamily: typography.fontFamily,
            fontWeight: 700,
            fontSize: '0.82rem',
            color: colors.brand,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ px: 1.75, py: 0.5 }}>{children}</Box>
    </Box>
  );
}

const DetallesArticulos = () => {
  const [detalle, setDetalle] = useState(null);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [inputArticulo, setInputArticulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const obtenerArticulos = async () => {
      try {
        const response = await GetTABLAARTICULOS();
        const raw = response?.Dato;
        const lista = Array.isArray(raw?.[0]) && !raw[0]?.articulo
          ? raw[0]
          : (Array.isArray(raw) ? raw : []);
        setArticulos(lista.filter((a) => a && a.articulo));
      } catch (error) {
        console.error('Error al obtener los Articulos', error);
        setMensaje('No se pudieron cargar los artículos. Revisá la conexión con el servidor.');
        setArticulos([]);
      }
    };
    obtenerArticulos();
  }, []);

  const formatNumber = (num) => {
    if (num === null || num === undefined || num === '') return '';
    const n = parseFloat(num);
    return Number.isNaN(n) ? String(num) : String(n);
  };

  const handleBotonBuscar = async () => {
    const codigo = (articuloSeleccionado || inputArticulo || '').trim();
    if (!codigo) {
      setMensaje('Seleccioná un artículo para buscar.');
      return;
    }

    setBuscando(true);
    setMensaje('');
    try {
      const response = await GetTABLADETALLES(codigo);
      const raw = response?.Dato;
      const fila = Array.isArray(raw?.[0]) ? raw[0][0] : raw?.[0];
      if (fila && fila.articulo) {
        setDetalle(fila);
      } else {
        setDetalle(null);
        setMensaje(`No se encontraron detalles para ${codigo}.`);
      }
    } catch (error) {
      console.error('error con: ', error);
      setDetalle(null);
      setMensaje('Error al buscar el artículo.');
    } finally {
      setBuscando(false);
    }
  };

  const opciones = useMemo(
    () => articulos.slice().sort((a, b) => String(a.articulo).localeCompare(String(b.articulo))),
    [articulos]
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 920, mx: 'auto', px: { xs: 0.5, md: 1 }, pb: 3 }}>
      <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>
        Detalles del artículo
      </Typography>
      <Typography sx={{ ...typography.muted, fontSize: '0.85rem', mb: 1.5, fontWeight: 500 }}>
        Buscá un artículo para ver su ficha técnica
      </Typography>

      <Box sx={{ ...filterBarSx, mb: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.25}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Autocomplete
              options={opciones}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : (option?.articulo ?? '')
              }
              isOptionEqualToValue={(option, value) => option?.articulo === value?.articulo}
              value={opciones.find((a) => a.articulo === articuloSeleccionado) || null}
              onChange={(_event, newValue) => {
                setArticuloSeleccionado(newValue ? newValue.articulo : null);
              }}
              inputValue={inputArticulo}
              onInputChange={(_event, newInput) => {
                setInputArticulo(newInput);
                if (!newInput) setArticuloSeleccionado(null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Artículo"
                  placeholder="Escribí o seleccioná..."
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') handleBotonBuscar();
                  }}
                  sx={{
                    fontFamily: typography.fontFamily,
                    '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'Poppins' },
                  }}
                />
              )}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleBotonBuscar}
            disabled={buscando}
            sx={{ ...primaryBtnSx, px: 2.5, flexShrink: 0 }}
          >
            Buscar
          </Button>
        </Stack>
        {mensaje ? (
          <Typography sx={{ mt: 1.25, fontFamily: 'Poppins', fontSize: '0.85rem', color: '#b45309' }}>
            {mensaje}
          </Typography>
        ) : null}
        {!mensaje && opciones.length > 0 ? (
          <Typography sx={{ mt: 1, fontFamily: 'Poppins', fontSize: '0.75rem', color: colors.textMuted }}>
            {opciones.length} artículos disponibles
          </Typography>
        ) : null}
      </Box>

      {detalle ? (
        <Box sx={cardSx}>
          <Box
            sx={{
              background: 'linear-gradient(180deg, #1A4862 0%, #163f55 100%)',
              px: 2.5,
              py: 1.75,
            }}
          >
            <Typography
              sx={{
                fontFamily: typography.fontFamily,
                fontWeight: 700,
                color: '#fff',
                fontSize: { xs: '1.15rem', md: '1.35rem' },
                letterSpacing: '0.04em',
              }}
            >
              {detalle.articulo}
            </Typography>
            <Typography
              sx={{
                fontFamily: typography.fontFamily,
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.9rem',
                mt: 0.35,
                overflowWrap: 'anywhere',
              }}
            >
              {detalle.nombre || 'Sin nombre'}
            </Typography>
          </Box>

          <Stack spacing={1.75} sx={{ p: { xs: 1.5, md: 2.25 } }}>
            <SectionBlock title="Identificación">
              <FieldRow label="Artículo" value={detalle.articulo} />
              <FieldRow label="Nombre" value={detalle.nombre} />
              <FieldRow label="Línea" value={detalle.linea} />
              <FieldRow label="Ex" value={detalle.ex} />
              <FieldRow label="Artículo FV" value={detalle.articulo_fv} />
            </SectionBlock>

            <SectionBlock title="Tejido">
              <FieldRow label="Urdimbre" value={detalle.urdimbre} />
              <FieldRow label="Trama" value={detalle.trama} />
              <FieldRow label="Hilos" value={formatNumber(detalle.hilos)} />
              <FieldRow label="Dibujo" value={detalle.dibujo} />
              <FieldRow label="Peine" value={detalle.peine} />
              <FieldRow label="Pas x cm" value={formatNumber(detalle.pas_x_cm)} />
              <FieldRow label="Hilo x orillo" value={detalle.hilo_x_orillo} />
            </SectionBlock>

            <SectionBlock title="Dimensiones y peso">
              <FieldRow label="Gr/ml" value={formatNumber(detalle.gr_ml)} />
              <FieldRow label="Gr/m²" value={formatNumber(detalle.gr_m2)} />
              <FieldRow
                label="Ancho peine"
                value={detalle.ancho_peine != null && detalle.ancho_peine !== '' ? `${formatNumber(detalle.ancho_peine)} cm` : ''}
              />
              <FieldRow
                label="Ancho descanso"
                value={detalle.ancho_descanso != null && detalle.ancho_descanso !== '' ? `${formatNumber(detalle.ancho_descanso)} cm` : ''}
              />
            </SectionBlock>

            <SectionBlock title="Observaciones">
              <FieldRow label="Observaciones" value={detalle.observaciones || 'Sin observaciones'} />
            </SectionBlock>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            ...cardSx,
            p: 4,
            textAlign: 'center',
            color: colors.textMuted,
            fontFamily: typography.fontFamily,
          }}
        >
          Seleccioná un artículo y tocá Buscar para ver la ficha.
        </Box>
      )}
    </Box>
  );
};

export default DetallesArticulos;
