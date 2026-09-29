import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DataGridTable from '../DataGrid/DataGridTable';
import { getTablaArticulosDetalles } from '../API/APIFunctions';
import { colors, shadows, typography } from '../../styles/alpacladdFvDesignTokens';

const headCellsBg = 'rgba(26, 72, 98, 0.12)';
const rowCellsBg = 'rgba(26, 72, 98, 0.04)';

const tableWrapSx = {
  backgroundColor: '#fff',
  borderRadius: '14px',
  border: `1px solid ${colors.borderCard}`,
  boxShadow: shadows.dashboard,
  overflow: 'hidden',
  p: { xs: 1, md: 1.5 },
  '& .MuiPaper-root': {
    backgroundColor: 'transparent !important',
    boxShadow: 'none',
    mb: '0 !important',
  },
};

function formatNumber(num) {
  if (num === null || num === undefined || num === '') return '';
  const n = parseFloat(num);
  return Number.isNaN(n) ? String(num) : String(n);
}

function TablaArtDetalles() {
  const [serie, setSerie] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const datosArt = async () => {
      try {
        const response = await getTablaArticulosDetalles();
        const raw = response?.Dato;
        const lista = Array.isArray(raw?.[0]) && !raw[0]?.articulo
          ? raw[0]
          : (Array.isArray(raw) ? raw : []);
        setSerie(lista);
        setError('');
      } catch (err) {
        console.error('Error al obtener datos', err);
        setSerie([]);
        setError('No se pudieron cargar los registros. Revisá la conexión con el servidor.');
      }
    };
    datosArt();
  }, []);

  const filas = useMemo(
    () =>
      serie.map((elemento, index) => ({
        id: index,
        Articulo: elemento.articulo ?? '',
        Urdimbre: elemento.urdimbre ?? '',
        Trama: elemento.trama ?? '',
        Hilos: formatNumber(elemento.hilos),
        PXCM: formatNumber(elemento.pas_x_cm),
        Peine: elemento.peine ?? '',
      })),
    [serie]
  );

  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    {
      field: 'Articulo',
      headerName: 'Artículo',
      flex: 1,
      minWidth: 110,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'Urdimbre',
      headerName: 'Urdimbre',
      flex: 1,
      minWidth: 110,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'Trama',
      headerName: 'Trama',
      flex: 1,
      minWidth: 110,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'Hilos',
      headerName: 'Hilos',
      flex: 0.8,
      minWidth: 90,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'PXCM',
      headerName: 'Pas x cm',
      flex: 0.8,
      minWidth: 100,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
    {
      field: 'Peine',
      headerName: 'Peine',
      flex: 1,
      minWidth: 110,
      headerClassName: 'table-header',
      cellClassName: 'table-body',
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: { xs: 0.5, md: 1 }, pb: 3 }}>
      <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>
        Registros de artículos
      </Typography>
      <Typography sx={{ ...typography.muted, fontSize: '0.85rem', mb: 1.5, fontWeight: 500 }}>
        Listado completo de fichas técnicas
      </Typography>

      {error ? (
        <Typography sx={{ mb: 1.5, fontFamily: 'Poppins', fontSize: '0.85rem', color: '#b45309' }}>
          {error}
        </Typography>
      ) : (
        <Typography sx={{ mb: 1.25, fontFamily: 'Poppins', fontSize: '0.75rem', color: colors.textMuted }}>
          {filas.length} registros
        </Typography>
      )}

      <Box sx={tableWrapSx}>
        <DataGridTable
          rows={filas}
          columns={columns}
          filename="- Listado de Articulos"
          RowCellsBg={rowCellsBg}
          HeadCellsBg={headCellsBg}
        />
      </Box>
    </Box>
  );
}

export default TablaArtDetalles;
