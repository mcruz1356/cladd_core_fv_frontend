import { useEffect, useState } from 'react';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Typography, Stack, Box } from '@mui/material';
import { getReporteLaboratorio } from './API/APIFunctions';
import {
    loadCache,
    saveCache,
    isCacheFresh,
    fingerprintList,
    compareFingerprints,
} from './rutinasActivasCache';
import { colors } from '../../styles/alpacladdFvDesignTokens';

const STATUS_FILTERS = [
    { value: '', label: 'Todos' },
    { value: 'Registro', label: 'Registro' },
    { value: 'Entrada', label: 'Entrada' },
    { value: 'Ingreso', label: 'Ingreso' },
    { value: 'Marcado', label: 'Marcado' },
    { value: 'Lavado', label: 'Lavado' },
    { value: 'Reposo', label: 'Reposo' },
    { value: 'Medicion', label: 'Medición' },
    { value: 'Finalizado', label: 'Finalizado' },
];

function formatFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function isCurrentYear(fecha) {
    if (!fecha) return false;
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return false;
    return d.getFullYear() === new Date().getFullYear();
}

function BuscadorRutina({ handleTabChange }) {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const cached = loadCache();
        if (cached?.items?.length) {
            setRows(cached.items);
            setFilteredRows(cached.items);
        }
        if (!isCacheFresh()) {
            getData();
        }
    }, []);

    function QuickSearchToolbar() {
        return (
            <Box sx={{ p: 0.5, pb: 0 }}>
                <GridToolbarQuickFilter />
            </Box>
        );
    }

    async function getData(filterOverride, force = false) {
        try {
            const respuesta = await getReporteLaboratorio();
            const formattedData = (respuesta.data || [])
                .filter((item) => isCurrentYear(item.fecha))
                .map((item) => ({
                    ...item,
                    fecha: formatFecha(item.fecha),
                }));

            const prevCache = loadCache();
            const prevFp = fingerprintList(prevCache?.items || []);
            const nextFp = fingerprintList(formattedData);
            const { changed } = compareFingerprints(prevFp, nextFp);

            saveCache({ items: formattedData });

            if (!force && !changed && prevCache?.items?.length) {
                return;
            }

            const activeFilter = filterOverride !== undefined ? filterOverride : statusFilter;
            setRows(formattedData);
            setFilteredRows(
                activeFilter
                    ? formattedData.filter((row) => row.status === activeFilter)
                    : formattedData
            );
        } catch (error) {
            console.error('Error fetching data:', error);
            if (!loadCache()?.items?.length) {
                alert('Error fetching data. Please try again later.');
            }
        }
    }

    const handleFilter = (status) => {
        setStatusFilter(status);
        if (status === '') {
            setFilteredRows(rows);
            getData('', true);
        } else {
            setFilteredRows(rows.filter((row) => row.status === status));
        }
    };

    const abrirFormularioRutina = (row) => {
        window.open(`/ver-rutina/${row.rutina}`, '_blank');
    };

    const filterBtnSx = (active) => ({
        fontFamily: 'Poppins',
        textTransform: 'none',
        fontWeight: active ? 700 : 600,
        fontSize: '0.78rem',
        borderRadius: '10px',
        borderColor: active ? colors.brand : 'rgba(26,72,98,0.2)',
        color: active ? '#fff' : colors.brand,
        backgroundColor: active ? colors.brand : '#fff',
        px: 1.5,
        '&:hover': {
            borderColor: colors.brand,
            backgroundColor: active ? colors.brandDark : 'rgba(26,72,98,0.06)',
        },
    });

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'rutina',
            headerName: 'Rutina',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Button
                    onClick={() => abrirFormularioRutina(params.row)}
                    endIcon={<SearchIcon sx={{ color: '#000000' }} />}
                >
                    <Typography color="black" fontFamily="Poppins" fontWeight="bold">
                        {params.row.rutina}
                    </Typography>
                </Button>
            ),
        },
        { field: 'tarima', headerName: 'Tarima', flex: 0.8, headerClassName: 'super-app-theme--header' },
        { field: 'articulo_inicial', headerName: 'Artículo', flex: 0.8, headerClassName: 'super-app-theme--header' },
        { field: 'lote', headerName: 'Lote', flex: 1, headerClassName: 'super-app-theme--header' },
        { field: 'letra', headerName: 'Letra', flex: 0.5, headerClassName: 'super-app-theme--header' },
        {
            field: 'status',
            headerName: 'Estado',
            flex: 1,
            valueGetter: (params) => `${params.row.status || ''} ${params.row.resultado || ''}`,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography
                    sx={{
                        color:
                            params.row.status === 'Finalizado' && params.row.resultado !== 'CONFORME'
                                ? 'red'
                                : 'black',
                        fontFamily: 'Poppins',
                        fontWeight: 'bold',
                    }}
                >
                    {params.row.status === 'Finalizado' ? params.row.resultado : params.row.status}
                </Typography>
            ),
        },
        { field: 'articulo_final', headerName: 'ArtículoFin', flex: 0.8, headerClassName: 'super-app-theme--header' },
        { field: 'corte', headerName: 'Corte', flex: 0.7, headerClassName: 'super-app-theme--header' },
        { field: 'metros', headerName: 'Metros', flex: 0.7, headerClassName: 'super-app-theme--header' },
        { field: 'fecha', headerName: 'Fecha', flex: 1, headerClassName: 'super-app-theme--header' },
        { field: 'motivo', headerName: 'Motivo', flex: 1, headerClassName: 'super-app-theme--header' },
        { field: 'lugar_muestra', headerName: 'Etapa Proc', flex: 1, headerClassName: 'super-app-theme--header' },
    ];

    return (
        <>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                mb={2}
                flexWrap="wrap"
                useFlexGap
            >
                <Button variant="outlined" onClick={() => handleFilter('')} sx={filterBtnSx(false)}>
                    ↺
                </Button>
                {STATUS_FILTERS.map((f) => (
                    <Button
                        key={f.label}
                        variant="outlined"
                        onClick={() => handleFilter(f.value)}
                        sx={filterBtnSx(statusFilter === f.value)}
                    >
                        {f.label}
                    </Button>
                ))}
            </Stack>
            <div style={{ width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    slots={{ toolbar: QuickSearchToolbar }}
                    autoHeight
                    initialState={{
                        columns: {
                            columnVisibilityModel: { id: false },
                        },
                        pagination: {
                            paginationModel: { pageSize: 25 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    sx={{
                        boxShadow: 2,
                        border: 2,
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        fontWeight: 600,
                        margin: '0rem',
                        backgroundColor: '#f4f4f4',
                        '& .super-app-theme--header': {
                            backgroundColor: '#0D3F5E',
                            color: 'white',
                            fontFamily: 'Poppins',
                            fontSize: 16,
                            fontWeight: 700,
                        },
                    }}
                />
            </div>
        </>
    );
}

export default BuscadorRutina;
