import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import { getReporteRutinasFiltrado } from '../API/APIFunctions';
import { colors, shadows, typography } from '../../../styles/alpacladdFvDesignTokens';

const STATUS_OPTIONS = [
  '',
  'Registro',
  'Entrada',
  'Ingreso',
  'Marcado',
  'Lavado',
  'Reposo',
  'Medicion',
  'Finalizado',
];

const MOTIVO_OPTIONS = [
  '',
  'Crudo',
  'Lavado Potencial',
  'Quick Wash',
  'Terminado',
  'Reprueba',
  'Stock (sin lab.)',
  'Personalizado',
];

const EMPTY_FILTERS = {
  rutina: '',
  status: '',
  articulo: '',
  lote: '',
  letra: '',
  motivo: '',
  resultado: '',
  fechaDesde: null,
  fechaHasta: null,
};

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

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'Poppins' },
  '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
};

function formatFecha(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return String(fecha);
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function estadoDisplay(row) {
  if (row.status === 'Finalizado') return row.resultado || row.status || '';
  return row.status || '';
}

function mapRowForExcel(row) {
  return {
    Rutina: row.rutina ?? '',
    Tarima: row.tarima ?? '',
    Artículo: row.articulo_inicial ?? '',
    Lote: row.lote ?? '',
    Letra: row.letra ?? '',
    Estado: estadoDisplay(row),
    Resultado: row.resultado ?? '',
    'Artículo Fin': row.articulo_final ?? '',
    Corte: row.corte ?? '',
    Metros: row.metros ?? '',
    Fecha: row.fecha ?? '',
    Motivo: row.motivo ?? '',
    'Etapa Proc': row.lugar_muestra ?? '',
  };
}

function toDateParam(value) {
  if (!value) return '';
  if (dayjs.isDayjs(value)) return value.format('YYYY-MM-DD');
  const d = dayjs(value);
  return d.isValid() ? d.format('YYYY-MM-DD') : '';
}

function Toolbar({ rows }) {
  const handleDownload = () => {
    if (!rows.length) {
      alert('No hay datos para exportar. Buscá con los filtros primero.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(rows.map(mapRowForExcel));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rutinas');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const hoy = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
    saveAs(blob, `Reporte Rutinas ${hoy}.xlsx`);
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
          placeholder="Filtrar en resultados…"
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

export default function ReporteRutinas() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const setField = (key) => (event) => {
    setFilters((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleLimpiar = () => {
    setFilters(EMPTY_FILTERS);
    setRows([]);
    setSearched(false);
  };

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const body = {
        rutina: filters.rutina,
        status: filters.status,
        articulo: filters.articulo,
        lote: filters.lote,
        letra: filters.letra,
        motivo: filters.motivo,
        resultado: filters.resultado,
        fechaDesde: toDateParam(filters.fechaDesde),
        fechaHasta: toDateParam(filters.fechaHasta),
      };
      const respuesta = await getReporteRutinasFiltrado(body);
      const data = (respuesta.data || []).map((item) => ({
        ...item,
        fecha: formatFecha(item.fecha),
      }));
      setRows(data);
      setSearched(true);
    } catch (error) {
      console.error('Error al buscar rutinas:', error);
      alert('No se pudo obtener el reporte. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { field: 'id', headerName: 'ID' },
      { field: 'rutina', headerName: 'Rutina', flex: 0.9, minWidth: 100 },
      { field: 'tarima', headerName: 'Tarima', flex: 0.7, minWidth: 90 },
      { field: 'articulo_inicial', headerName: 'Artículo', flex: 0.9, minWidth: 100 },
      { field: 'lote', headerName: 'Lote', flex: 0.9, minWidth: 100 },
      { field: 'letra', headerName: 'Letra', flex: 0.5, minWidth: 70 },
      {
        field: 'status',
        headerName: 'Estado',
        flex: 1,
        minWidth: 120,
        valueGetter: (params) => estadoDisplay(params.row),
        renderCell: (params) => (
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: '0.8rem',
              color:
                params.row.status === 'Finalizado' && params.row.resultado !== 'CONFORME'
                  ? '#b71c1c'
                  : colors.textSlate,
            }}
          >
            {estadoDisplay(params.row)}
          </Typography>
        ),
      },
      { field: 'articulo_final', headerName: 'Artículo Fin', flex: 0.9, minWidth: 100 },
      { field: 'corte', headerName: 'Corte', flex: 0.6, minWidth: 80 },
      { field: 'metros', headerName: 'Metros', flex: 0.6, minWidth: 80 },
      { field: 'fecha', headerName: 'Fecha', flex: 0.9, minWidth: 110 },
      { field: 'motivo', headerName: 'Motivo', flex: 0.9, minWidth: 110 },
      { field: 'lugar_muestra', headerName: 'Etapa Proc', flex: 0.9, minWidth: 110 },
    ],
    []
  );

  return (
    <Box sx={{ px: { xs: 1, md: 1.5 }, pb: 2 }}>
      <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>Reporte rutinas</Typography>
      <Typography
        sx={{
          fontFamily: typography.fontFamily,
          color: colors.textMuted,
          fontSize: '0.85rem',
          mb: 2,
        }}
      >
        Filtrá por estado, fechas, artículo u otros campos y buscá las rutinas
      </Typography>

      <CardAlpa sx={{ mt: 0, mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Grid container spacing={1.5} padding={2.5} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Rutina"
                value={filters.rutina}
                onChange={setField('rutina')}
                fullWidth
                size="small"
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  value={filters.status}
                  onChange={setField('status')}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {STATUS_OPTIONS.filter(Boolean).map((s) => (
                    <MenuItem key={s} value={s}>
                      {s === 'Medicion' ? 'Medición' : s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Artículo"
                value={filters.articulo}
                onChange={setField('articulo')}
                fullWidth
                size="small"
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Lote"
                value={filters.lote}
                onChange={setField('lote')}
                fullWidth
                size="small"
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1.5}>
              <TextField
                label="Letra"
                value={filters.letra}
                onChange={setField('letra')}
                fullWidth
                size="small"
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel>Motivo</InputLabel>
                <Select
                  label="Motivo"
                  value={filters.motivo}
                  onChange={setField('motivo')}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {MOTIVO_OPTIONS.filter(Boolean).map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Resultado"
                value={filters.resultado}
                onChange={setField('resultado')}
                fullWidth
                size="small"
                sx={fieldSx}
                placeholder="CONFORME…"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Fecha desde"
                value={filters.fechaDesde}
                onChange={(v) => setFilters((prev) => ({ ...prev, fechaDesde: v }))}
                disableFuture
                slotProps={{ textField: { fullWidth: true, size: 'small', sx: fieldSx } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Fecha hasta"
                value={filters.fechaHasta}
                onChange={(v) => setFilters((prev) => ({ ...prev, fechaHasta: v }))}
                disableFuture
                slotProps={{ textField: { fullWidth: true, size: 'small', sx: fieldSx } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleBuscar}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
                  sx={primaryBtnSx}
                >
                  Buscar
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLimpiar}
                  disabled={loading}
                  startIcon={<RestartAltIcon />}
                  sx={{
                    fontFamily: 'Poppins',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '10px',
                    borderColor: colors.borderCard,
                    color: colors.brand,
                    height: 40,
                    px: 2,
                    whiteSpace: 'nowrap',
                    '&:hover': { borderColor: colors.brand, backgroundColor: 'rgba(26,72,98,0.06)' },
                  }}
                >
                  Limpiar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </CardAlpa>

      <Box
        sx={{
          width: '100%',
          minHeight: 360,
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
          loading={loading}
          getRowId={(row) => row.id ?? `${row.rutina}-${row.fecha}-${row.lote}`}
          slots={{ toolbar: Toolbar }}
          slotProps={{ toolbar: { rows } }}
          autoHeight
          initialState={{
            columns: { columnVisibilityModel: { id: false } },
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          localeText={{
            noRowsLabel: searched
              ? 'Sin rutinas para los filtros seleccionados'
              : 'Completá los filtros y presioná Buscar',
            toolbarQuickFilterPlaceholder: 'Filtrar…',
            MuiTablePagination: {
              labelRowsPerPage: 'Filas:',
              labelDisplayedRows: ({ from, to, count }) => `${from}–${to} de ${count}`,
            },
          }}
          sx={{
            border: 'none',
            fontFamily: typography.fontFamily,
            fontSize: 13,
            fontWeight: 600,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: colors.brand,
              color: '#fff',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: '0.75rem',
            },
            '& .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-menuIcon, & .MuiDataGrid-sortIcon': {
              color: 'rgba(255,255,255,0.85)',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${colors.borderCard}`,
              fontFamily: 'Poppins',
            },
          }}
        />
      </Box>
    </Box>
  );
}
