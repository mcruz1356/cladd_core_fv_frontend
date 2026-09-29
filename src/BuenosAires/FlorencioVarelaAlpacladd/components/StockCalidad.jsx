import React, { useState, useEffect } from 'react';
import { Typography, Modal, Box, Card, CardContent, TextField, MenuItem, Button } from '@mui/material';
import { useAuth } from '../../../AuthContext';
import MensajeDialog from '../../../components/Plantilla/MensajeDialog';
import { putCambiarEstadoCalidad, putArchivarRutina, getStockCalidad, getOperarios } from '../API/APIFunctions';
import DataGridCalidad from '../../../components/Plantilla/DataGridCalidad';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';

const StockCalidad = ({ withChrome = false }) => {
    const [tipo, setTipo] = useState('success');
    const [isOpen, setIsOpen] = useState(false);
    const [resultadoTrenFallas, setResultadoTrenFallas] = useState('');
    const [resultadoCorte, setResultadoCorte] = useState('');
    const [rows, setRows] = useState([]);
    const [obsTrenFallas, setObsTrenFallas] = useState('');
    const [responsableTrenFallas, setResponsableTrenFallas] = useState('');
    const [observacionCorte, setObservacionCorte] = useState('');
    const [resultadoLavado, setResultadoLavado] = useState('');
    const [observacionLavado, setObservacionLavado] = useState('');
    const [resultadoColor, setResultadoColor] = useState('');
    const [observacionColor, setObservacionColor] = useState('');
    const [resultadoSecuencia, setResultadoSecuencia] = useState('');
    const [observacionSecuencia, setObservacionSecuencia] = useState('');
    const [resultadoPegado, setResultadoPegado] = useState('');
    const [observacionPegado, setObservacionPegado] = useState('');
    const [resultadoCerrado, setResultadoCerrado] = useState('');
    const [observacionCerrado, setObservacionCerrado] = useState('');
    const { auth } = useAuth();
    const [mensaje, setMensaje] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalParams, setModalParams] = useState({});
    const [operarios, setOperarios] = useState([]);
    const [responsableCorte, setResponsableCorte] = useState('');
    const [responsableLavado, setResponsableLavado] = useState('');
    const [responsableColor, setResponsableColor] = useState('');
    const [responsableSecuencia, setResponsableSecuencia] = useState('');
    const [responsablePegado, setResponsablePegado] = useState('');
    const [responsableCerrado, setResponsableCerrado] = useState('');

    function validarUsuario(responsable) {
        if (auth?.rol === 'Administrador' || auth?.rol === 'Supervisor') {
            return auth?.usuario;
        }
       else {
        const operario = operarios.find((op) => op.contrasenia === responsable);
        if (operario) {
            return operario.usuario;
        }
        else {
            setMensaje('Operario no encontrado');
            setTipo('error');
            setIsOpen(true);
            return null;
        }
       }
    }
    async function cambiarEstado(columna, resultado, observacion, responsable, rutina) {
        const usuario = validarUsuario(responsable);
        if (usuario === null){
            return;
        }
        let body = {
            rutina: rutina,
            operario: usuario,
            modalContent: columna,
            resultado: resultado,
            observacion: observacion
        }
        try {
            let respuesta = await putCambiarEstadoCalidad(body);

            if (respuesta.status >= 200 && respuesta.status < 300) {
                console.log("Conexión exitosa: ", respuesta);
                setMensaje('Datos guardados correctamente');
                setTipo('success');
                setIsOpen(true);
                setOpenModal(false);
            } else {
                setMensaje("Conexión realizada pero con posibles problemas: ", respuesta);
                setTipo('error');
                setIsOpen(true);

            }

        } catch (error) {
            setMensaje('Error al guardar los datos');
            setTipo('error');
            setIsOpen(true);

        }
        finally {
            fetchStockCalidad();
        }
    }

    async function handleCambiarEstado(field, params) {
        if (field === 'Tren de Fallas') {
            await cambiarEstado(field, resultadoTrenFallas, obsTrenFallas, responsableTrenFallas, params.rutina);
            return
        }
        if (field === 'Corte') {
            await cambiarEstado(field, resultadoCorte, observacionCorte, responsableCorte, params.rutina);
            return
        }
        if (field === 'Lavadero') {
            await cambiarEstado(field, resultadoLavado, observacionLavado, responsableLavado, params.rutina);
            return
        }
        if (field === 'Color') {
            await cambiarEstado(field, resultadoColor, observacionColor, responsableColor, params.rutina);
            return
        }
        if (field === 'Secuencia') {
            await cambiarEstado(field, resultadoSecuencia, observacionSecuencia, responsableSecuencia, params.rutina);
            return
        }
        if (field === 'Pegado') {
            await cambiarEstado(field, resultadoPegado, observacionPegado, responsablePegado,params.rutina);
            return
        }
        if (field === 'Cerrado') {
            await cambiarEstado(field, resultadoCerrado, observacionCerrado, responsableCerrado, params.rutina);
            return
        }
    }

    const handleOpenModal = (field, params) => {
        setModalContent(field);
        setModalParams(params);
        setOpenModal(true);
    };

    const handleArchivar = async (params) => {

        if (auth?.rol !== 'Administrador' && auth?.rol !== 'Supervisor') {
            setMensaje('No tienes permisos para archivar rutinas');
            setTipo('error');
            setIsOpen(true);
            return
        }

        try {
            let respuesta = await putArchivarRutina(params.row.rutina, auth?.usuario);
            if (respuesta.status >= 200 && respuesta.status < 300) {
                setMensaje('Rutina archivada correctamente');
                setTipo('success');
                setIsOpen(true);
            } else {
                console.warn("Conexión realizada pero con posibles problemas: ", respuesta);

            }

        } catch (error) {
            setMensaje('Error al archivar la rutina');
            setTipo('error');
            setIsOpen(true);
        }
        finally {
            fetchStockCalidad();
        }
    }
    async function fetchOperarios() {
        try {
            let respuesta = await getOperarios();
            if (respuesta.data && respuesta.data.length > 0) {
                setOperarios(respuesta.data);
            }
            else {
                setOperarios([]);
                setMensaje("No se encontraron operarios");
                setTipo('error');
                setIsOpen(true);
            }
        } catch (error) {
            setMensaje("Error al obtener los operarios");
            setTipo('error');
            setIsOpen(true);
        }


    }
    const fetchStockCalidad = async () => {
        let respuesta = await getStockCalidad();
        const formattedData = respuesta.data.map((item) => ({
            ...item,
            fecha_muestra: new Date(item.fecha_muestra).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
        }));
        setRows(formattedData);

    }
    useEffect(() => {
        fetchStockCalidad();
        fetchOperarios();
    }, []);

    const modalFields = {

        "Tren de Fallas": (
            <>

                <TextField
                    id='resultado_tren_fallas'
                    select
                    label="Tren de Fallas"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rows?.resultado_tren_fallas}
                    onChange={(e) => setResultadoTrenFallas(e.target.value)}
                >
                    <MenuItem value=''>
                        <em>Sin Selección</em>
                    </MenuItem>
                    {['Finalizado', 'Det. x2da', 'Lavando', 'Rechazo', 'PlanTF1', 'PlanTF2', 'PlanTF3', 'PlanTF4', 'PlanTF5', 'PlanTF6', 'PlanTF7', 'PlanTF8'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id='observacion_tren_fallas'
                    label="Observaciones"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rows?.observacion_tren_fallas}
                    onChange={(e) => setObsTrenFallas(e.target.value)}
                />
                <TextField
                    id='responsable_tren_fallas'
                    label="Operario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rows?.responsable_tren_fallas}
                    onChange={(e) => setResponsableTrenFallas(e.target.value)}
                />
            </>
        ),
        'Corte': (
            <>
                <TextField
                    id='resultado_corte'
                    select
                    label="Resultado Corte"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={resultadoCorte}
                    onChange={(e) => setResultadoCorte(e.target.value)}
                >
                    {['Finalizado', 'Det. x2da', 'Lavando', 'Rechazo', 'Plan M5', 'Plan M6', 'Plan M7', 'Plan M8', 'Plan M9'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id='observacion_corte'
                    label="Observaciones"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={observacionCorte}
                    onChange={(e) => setObservacionCorte(e.target.value)}
                />
                <TextField
                    id='responsable_corte'
                    label="Operario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rows?.responsable_corte}
                    onChange={(e) => setResponsableCorte(e.target.value)}/>
            </>
        ),
        'Lavadero': (
            <>
                <TextField
                    id='resultado_lavado'
                    select
                    label="Lavado"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={resultadoLavado}
                    onChange={(e) => setResultadoLavado(e.target.value)}
                >
                    {['Finalizado', 'Marcado', 'Cosido', 'Lavado'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id='observacion_lavado'
                    label="observaciones"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={observacionLavado}
                    onChange={(e) => setObservacionLavado(e.target.value)}
                />
                <TextField
                    id='responsable_lavado'
                    label="Operario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rows?.responsable_lavado}
                    onChange={(e) => setResponsableLavado(e.target.value)}/>
            </>
        ),
        'Color': (
            <>
                <TextField
                    id='resultado_color'
                    select
                    label="Color"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={resultadoColor}
                    onChange={(e) => setResultadoColor(e.target.value)}
                >
                    {['OK Color', 'Detenido', 'Rechazo'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id='observacion_color'
                    label="observaciones"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={observacionColor}
                    onChange={(e) => setObservacionColor(e.target.value)}
                />
                <TextField
                    id='responsable_color'
                    label="Operario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rows?.responsable_color}
                    onChange={(e) => setResponsableColor(e.target.value)}/>
            </>
        ),
        'Secuencia': (
            <>
                <TextField
                    id='resultado_secuencia'
                    select
                    label="Secuencia"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={resultadoSecuencia}
                    onChange={(e) => setResultadoSecuencia(e.target.value)}
                >
                    {['Finalizado', 'Marcado', 'Cosido', 'Lavado'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id='observacion_secuencia'
                    label="Observaciones"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={observacionSecuencia}
                    onChange={(e) => setObservacionSecuencia(e.target.value)}
                />
                <TextField
                    id='responsable_secuencia'
                    label="Operario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rows?.responsable_secuencia}
                    onChange={(e) => setResponsableSecuencia(e.target.value)}/>
            </>
        ),
        'Pegado': (
            <>
                <TextField
                    id='resultado_pegado'
                    select
                    label="Color"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={resultadoPegado}
                    onChange={(e) => setResultadoPegado(e.target.value)}
                >
                    {['Finalizado', 'Incompleto'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id='observacion_pegado'
                    label="Observaciones"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={observacionPegado}
                    onChange={(e) => setObservacionPegado(e.target.value)}
                />
                <TextField
                    id='responsable_pegado'
                    label="Operario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rows?.responsable_pegado}
                    onChange={(e) => setResponsablePegado(e.target.value)}/>
            </>
        ),
        'Cerrado': (
            <>
                <TextField
                    id='resultado_cerrado'
                    select
                    label="Color"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={resultadoCerrado}
                    onChange={(e) => setResultadoCerrado(e.target.value)}
                >
                    {['Finalizado'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id='observacion_cerrado'
                    label="Oservaciones"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={observacionCerrado}
                    onChange={(e) => setObservacionCerrado(e.target.value)}
                />
                <TextField
                    id='responsable_cerrado'
                    label="Operario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rows?.responsable_cerrado}
                    onChange={(e) => setResponsableCerrado(e.target.value)}/>
            </>
        )
    };

    const columns = [
        // { flex: 1, minWidth: 80, field: 'alerta', headerName: 'Alerta', headerClassName: 'super-app-theme--header' },
        { flex: 0.4, minWidth: 50, field: 'tarima', headerName: 'Tari', headerClassName: 'super-app-theme--header' },
        { flex: 1, minWidth: 90, field: 'articulo_final', headerName: 'Artículo', headerClassName: 'super-app-theme--header' },
        { flex: 1, minWidth: 90, field: 'rollo', headerName: 'Lote', headerClassName: 'super-app-theme--header' },
        { flex: 0.9, minWidth: 80, field: 'orden', headerName: 'Orden', headerClassName: 'super-app-theme--header' },
        { flex: 0.4, minWidth: 50, field: 'letra', headerName: 'Letr', headerClassName: 'super-app-theme--header' },
        { flex: 0.7, minWidth: 70, field: 'largo', headerName: 'Metros', headerClassName: 'super-app-theme--header' },
        // { flex: 1, minWidth: 80, field: 'sector', headerName: 'Sector', headerClassName: 'super-app-theme--header' },
        { flex: 1, minWidth: 90, field: 'fecha_muestra', headerName: 'Fecha', headerClassName: 'super-app-theme--header' },
        {
            flex: 1, minWidth: 90, field: 'estado_laboratorio', headerName: 'Lab', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
                    {params.row.estado_laboratorio === "Finalizado" ? params.row.resultado_laboratorio : params.row.estado_laboratorio}
                </Typography>
            ),

        },
        {
            flex: 1.1, minWidth: 100, field: 'observaciones', headerName: 'Obs lab', headerClassName: 'super-app-theme--header'
        },
        {
            field: 'resultado_tren_fallas',
            headerName: 'Tren de F',
            flex: 1,
            minWidth: 90,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <>
                    <Typography
                        variant="body2"
                        color="primary"
                        onClick={() => handleOpenModal('Tren de Fallas', params)}
                        style={{ cursor: 'pointer' }}
                    >
                        {!params.row.resultado_tren_fallas ? '-' : params.row.resultado_tren_fallas}
                        {!params.row.observacion_tren_fallas ? '' : ' - ' + params.row.observacion_tren_fallas}
                    </Typography>

                </>
            ),
        },
        {
            flex: 1, minWidth: 90, field: 'resultado_corte',
            headerName: 'Corte',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    color="primary"
                    onClick={() => handleOpenModal('Corte', params)} // Envolver en una función de flecha
                    style={{ cursor: 'pointer' }}
                >
                    {!params.row.resultado_corte ? '-' : params.row.resultado_corte}
                    {!params.row.observacion_corte ? '' : ' - ' + params.row.observacion_corte}
                </Typography>
            ),
        },
        {
            flex: 1, minWidth: 90, field: 'resultado_lavadero',
            headerName: 'Lavadero',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    color="primary"
                    onClick={() => handleOpenModal('Lavadero', params)}
                    style={{ cursor: 'pointer' }}
                >
                    {!params.row.resultado_lavadero ? '-' : params.row.resultado_lavadero}
                    {!params.row.observacion_lavadero ? '' : ' - ' + params.row.observacion_lavadero}
                </Typography>
            ),
        },
        {
            flex: 1, minWidth: 90, field: 'resultado_color',
            headerName: 'Color',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    color="primary"
                    onClick={() => handleOpenModal('Color', params)}
                    style={{ cursor: 'pointer' }}
                >
                    {!params.row.resultado_color ? '-' : params.row.resultado_color}
                    {!params.row.observacion_color ? '' : ' - ' + params.row.observacion_color}
                </Typography>
            ),
        },
        {
            flex: 1, minWidth: 90, field: 'resultado_secuencia',
            headerName: 'Secuencia',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    color="primary"
                    onClick={() => handleOpenModal('Secuencia', params)}
                    style={{ cursor: 'pointer' }}
                >
                    {!params.row.resultado_secuencia ? '-' : params.row.resultado_secuencia}
                    {!params.row.observacion_secuencia ? '' : ' - ' + params.row.observacion_secuencia}
                </Typography>
            ),
        },
        {
            flex: 1, minWidth: 90, field: 'resultado_pegado',
            headerName: 'Pegado',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    color="primary"
                    onClick={() => handleOpenModal('Pegado', params)}
                    style={{ cursor: 'pointer' }}
                >
                    {!params.row.resultado_pegado ? '-' : params.row.resultado_pegado}
                    {!params.row.observacion_pegado ? '' : ' - ' + params.row.observacion_pegado}
                </Typography>
            ),
        },
        {
            flex: 1, minWidth: 90, field: 'resultado_cerrado',
            headerName: 'Cerrado',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    color="primary"
                    onClick={() => handleOpenModal('Cerrado', params)}
                    style={{ cursor: 'pointer' }}
                >
                    {!params.row.resultado_cerrado ? '-' : params.row.resultado_cerrado}
                    {!params.row.observacion_cerrado ? '' : ' - ' + params.row.observacion_cerrado}
                </Typography>
            ),
        },
        {
            flex: 1, minWidth: 100, field: 'archivar', headerName: 'Archivar', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Button sx={{ color: 'red' }} onClick={() => handleArchivar(params)}>
                    Archivar
                </Button>
            )
        },


    ];

    const content = (
        <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <DataGridCalidad rows={rows} columns={columns} />
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        maxWidth: 400,
                        width: '100%',
                    }}
                >
                    <Card>
                        <CardContent>
                            <Typography id="modal-title" variant="h6" component="h2">
                                Detalles de {modalContent}
                            </Typography>
                            <form>
                                {modalFields[modalContent] || <Typography>No hay datos disponibles</Typography>}

                            </form>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    console.log(modalContent, modalParams.row);
                                    handleCambiarEstado(modalContent, modalParams.row);
                                }}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Guardar
                            </Button>
                        </CardContent>

                    </Card>
                </Box>
            </Modal>
            <MensajeDialog
                mensaje={mensaje}
                tipo={tipo}
                duracion={3000}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </Box>
    );

    if (withChrome) {
        return (
            <HeaderYFooter titulo="STOCK CALIDAD" routes={[]} color="alpacladd" showMainMenu={false}>
                {content}
            </HeaderYFooter>
        );
    }

    return content;
};

export default StockCalidad;
