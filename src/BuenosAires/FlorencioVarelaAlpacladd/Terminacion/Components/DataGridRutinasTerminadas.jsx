import { useMemo } from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { colors, typography, shadows } from '../../../../styles/alpacladdFvDesignTokens';
import { fechaRegistroSortKey } from './rutinasTerminadasCache';

function formatCell(value) {
  if (value == null || value === '') return '—';
  return value;
}

function resultadoTone(raw) {
  const t = String(raw || '').toLowerCase();
  if (!t) return { bg: 'rgba(26,72,98,0.08)', color: colors.brand, label: '—' };
  if (t.includes('aprob') || t.includes('ok') || t.includes('conforme')) {
    return { bg: 'rgba(46, 125, 50, 0.12)', color: '#1b5e20', label: raw };
  }
  if (t.includes('rechaz') || t.includes('no conforme') || t.includes('fail')) {
    return { bg: 'rgba(198, 40, 40, 0.12)', color: '#b71c1c', label: raw };
  }
  if (t.includes('condic') || t.includes('observ')) {
    return { bg: 'rgba(245, 124, 0, 0.14)', color: '#e65100', label: raw };
  }
  return { bg: 'rgba(26,72,98,0.10)', color: colors.brand, label: raw };
}

const col = (field, headerName, opts = {}) => ({
  field,
  headerName,
  headerClassName: 'rt-header',
  cellClassName: 'rt-cell',
  align: 'center',
  headerAlign: 'center',
  minWidth: opts.minWidth ?? 110,
  width: opts.width,
  flex: opts.flex,
  sortable: opts.sortable !== false,
  valueFormatter: opts.valueFormatter,
  renderCell: opts.renderCell,
  sortComparator: opts.sortComparator,
});

export function buildRutinasTerminadasColumns() {
  return [
    col('rutina', 'Rutina', {
      minWidth: 120,
      width: 130,
      renderCell: (p) => (
        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.78rem', color: colors.brand }}>
          {formatCell(p.value)}
        </Typography>
      ),
    }),
    col('lote', 'Lote', { minWidth: 100, width: 110 }),
    col('articulo_final', 'Artículo', { minWidth: 110, width: 120 }),
    col('resultado', 'Resultado', {
      minWidth: 130,
      width: 150,
      renderCell: (p) => {
        const tone = resultadoTone(p.value);
        return (
          <Chip
            size="small"
            label={tone.label}
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 24,
              backgroundColor: tone.bg,
              color: tone.color,
              borderRadius: '8px',
              maxWidth: '100%',
              '& .MuiChip-label': { px: 1, overflow: 'hidden', textOverflow: 'ellipsis' },
            }}
          />
        );
      },
    }),
    col('fecha_registro', 'Fecha', {
      minWidth: 140,
      width: 160,
      sortComparator: (a, b) => fechaRegistroSortKey(a) - fechaRegistroSortKey(b),
    }),
    col('letra', 'Letra', { minWidth: 70, width: 80 }),
    col('metros', 'Metros', { minWidth: 90, width: 100 }),
    col('ancho_sin_lavar_cal', 'Ancho s/lav', { minWidth: 110 }),
    col('peso_sin_lavar_cal', 'Peso s/lav', { minWidth: 100 }),
    col('peso_lavado_cal', 'Peso lav', { minWidth: 95 }),
    col('ancho_lavado_cal', 'Ancho lav', { minWidth: 100 }),
    col('recuento_urdido_cal', 'Rec. urdido', { minWidth: 110 }),
    col('recuento_trama_cal', 'Rec. trama', { minWidth: 110 }),
    col('pasadas_por_costo_cal', 'Pasadas', { minWidth: 95 }),
    col('estabilidad_urdido_cal', 'Est. urdido', { minWidth: 110 }),
    col('estabilidad_trama_cal', 'Est. trama', { minWidth: 110 }),
    col('predistorsion_izq', 'Predist. izq', { minWidth: 110 }),
    col('predistorsion_der', 'Predist. der', { minWidth: 110 }),
    col('movimiento_izq', 'Mov. izq', { minWidth: 95 }),
    col('movimiento_der', 'Mov. der', { minWidth: 95 }),
    col('elasticidad_sin_lavar_cal', 'Elást. s/lav', { minWidth: 110 }),
    col('elasticidad_lavada_cal', 'Elást. lav', { minWidth: 100 }),
    col('deformacion_lavada_cal', 'Deform. lav', { minWidth: 110 }),
    col('elmendorf_urdido_sin_lavar_cal', 'Elm. urdido', { minWidth: 110 }),
    col('elmendorf_trama_sin_lavar_cal', 'Elm. trama', { minWidth: 110 }),
    col('desliz_costura_ut_cal', 'Desliz UT', { minWidth: 100 }),
    col('desliz_costura_tu_cal', 'Desliz TU', { minWidth: 100 }),
    col('rigidez_cal', 'Rigidez', { minWidth: 90 }),
  ].map((c) => ({
    ...c,
    renderCell:
      c.renderCell ||
      ((params) => (
        <Typography
          component="span"
          sx={{
            fontFamily: 'Poppins',
            fontSize: '0.75rem',
            color: colors.textSlate,
            fontWeight: 500,
          }}
        >
          {formatCell(params.value)}
        </Typography>
      )),
  }));
}

function Toolbar({ rows, filename }) {
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      rows.map((row) => {
        const next = { ...row };
        delete next.id;
        return next;
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, `${filename || 'Rutinas Terminadas'}.xlsx`);
  };

  return (
    <GridToolbarContainer
      sx={{
        px: 1.5,
        py: 1.25,
        gap: 1.25,
        flexWrap: 'wrap',
        borderBottom: `1px solid ${colors.borderCard}`,
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      }}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={handleDownload}
        startIcon={<SummarizeIcon sx={{ fontSize: 18 }} />}
        sx={{
          fontFamily: 'Poppins',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '10px',
          borderColor: '#2e7d32',
          color: '#1b5e20',
          px: 1.5,
          '&:hover': { borderColor: '#1b5e20', backgroundColor: 'rgba(46,125,50,0.06)' },
        }}
      >
        Excel
      </Button>
      <Box
        sx={{
          flex: 1,
          minWidth: 200,
          maxWidth: 360,
          '& .MuiInputBase-root': {
            fontFamily: 'Poppins',
            fontSize: '0.85rem',
            borderRadius: '10px',
            backgroundColor: '#fff',
          },
        }}
      >
        <GridToolbarQuickFilter
          quickFilterParser={(v) => v.split(/\s+/).filter(Boolean)}
          debounceMs={300}
          placeholder="Buscar rutina, lote, artículo…"
        />
      </Box>
      <Chip
        size="small"
        label={`${rows.length} registro${rows.length === 1 ? '' : 's'}`}
        sx={{
          ml: { xs: 0, sm: 'auto' },
          fontFamily: 'Poppins',
          fontWeight: 600,
          fontSize: '0.72rem',
          height: 26,
          backgroundColor: 'rgba(26,72,98,0.08)',
          color: colors.brand,
          borderRadius: '8px',
        }}
      />
    </GridToolbarContainer>
  );
}

/**
 * DataGrid Alpacladd para Rutinas Terminadas.
 */
export default function DataGridRutinasTerminadas({ rows = [], filename }) {
  const columns = useMemo(() => buildRutinasTerminadasColumns(), []);

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 480, md: 560 },
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${colors.borderCard}`,
        boxShadow: shadows.status,
        backgroundColor: '#fff',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        density="compact"
        disableRowSelectionOnClick
        disableColumnSelector
        disableDensitySelector
        pageSizeOptions={[15, 25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
          sorting: { sortModel: [{ field: 'fecha_registro', sort: 'desc' }] },
        }}
        slots={{ toolbar: Toolbar }}
        slotProps={{
          toolbar: { rows, filename },
        }}
        localeText={{
          noRowsLabel: 'Sin rutinas para mostrar',
          toolbarQuickFilterPlaceholder: 'Buscar…',
          MuiTablePagination: {
            labelRowsPerPage: 'Filas:',
            labelDisplayedRows: ({ from, to, count }) => `${from}–${to} de ${count}`,
          },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'rt-row-even' : 'rt-row-odd'
        }
        sx={{
          border: 'none',
          fontFamily: typography.fontFamily,
          '& .MuiDataGrid-columnHeaders': {
            background: `linear-gradient(145deg, ${colors.brand}, ${colors.brandDark})`,
            borderBottom: 'none',
            minHeight: '44px !important',
            maxHeight: '44px !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: '#fff',
          },
          '& .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-menuIcon, & .MuiDataGrid-sortIcon': {
            color: 'rgba(255,255,255,0.85)',
          },
          '& .MuiDataGrid-columnSeparator': { color: 'rgba(255,255,255,0.2)' },
          '& .rt-header': {
            background: 'transparent',
          },
          '& .MuiDataGrid-cell': {
            borderColor: 'rgba(26,72,98,0.06)',
            py: 0.75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .rt-row-even': { backgroundColor: '#fff' },
          '& .rt-row-odd': { backgroundColor: 'rgba(244, 247, 251, 0.85)' },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.06) !important',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid ${colors.borderCard}`,
            minHeight: 48,
            fontFamily: 'Poppins',
          },
          '& .MuiTablePagination-root': {
            fontFamily: 'Poppins',
            color: colors.textMuted,
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#fff',
          },
          '& .MuiDataGrid-overlay': {
            fontFamily: 'Poppins',
            color: colors.textMuted,
          },
        }}
      />
    </Box>
  );
}
