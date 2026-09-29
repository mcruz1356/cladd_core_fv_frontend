import axios from 'axios'

// Para desarrollo local: en .env del frontend poner VITE_API_FV_BASE=http://localhost:4300
// const _base = import.meta.env.VITE_API_FV_BASE || "http://192.168.0.18:4300";
const _base = import.meta.env.VITE_API_FV_BASE || "http://192.168.0.18:4300";
const _url = new URL(_base);
const URL_SERVIDOR = `${_url.protocol}//${_url.hostname}`;
const PUERTO_FV_LABORATORIO = `:${_url.port || "4300"}/`;
const PUERTO_FV_PRODUCTIVIDAD = PUERTO_FV_LABORATORIO;
const STOCK_TERMINA_FV = PUERTO_FV_LABORATORIO; 

async function getStockTerminadoFV() {
    try {
        let respuesta = await axios.get(URL_SERVIDOR + STOCK_TERMINA_FV + "Stock_Terminado_FV");
        return respuesta.data;  // Retorna { resultSet1, resultSet2 }
    } catch (error) {
        console.error("Error al obtener Inventario Terminado:", error);
        return { resultSet1: [], resultSet2: [] };
    }
}

async function getRutinasLaboratorio(rutina) {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/getReporte/rutina/" + rutina)
    return (respuesta)
}

async function PutEnsayoDeRutina(datos) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/registrar_ensayo", datos)
    return (respuesta);
}
async function getEstadoRollos() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + "Home/StockRollos");
    return (respuesta);
}
async function getReporteLaboratorio() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/getReporte");
    return (respuesta);
}

async function getReporteRutinasFiltrado(body) {
    let respuesta = await axios.post(
        URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/getReporte/filtrado",
        body || {}
    );
    return respuesta;
}
async function putInventarioPlanta(body) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + "Inventario/cargaManual", body);
    return respuesta;
}
async function putFinalizarEnsayo(body) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/FinalizarEnsayo", body);
    return respuesta;
}

async function getDatosEnsayo(rutina) {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/rutinas/ensayo/" + rutina);
    return respuesta;
}

async function putCambiarEtapaEnsayo(body) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/CambiarEtapa", body);
    return respuesta;
}
async function getResultadosPosiblesEnsayos() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/ensayo/TablaResultados");
    return respuesta;
}
async function getEspecificacionArticulos(articuloFinal, motivo) {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + 'BuenosAires/laboratorio/ensayo/Especificacion', {
        params: {
            articuloFinal: articuloFinal,
            motivo: motivo
        }
    });
    return respuesta;
}

async function getTodasRutinas() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + 'BuenosAires/laboratorio/getReporte');
    return respuesta;
}

async function getTarimasUsadas() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/ensayo/TablaTarimas");
    return respuesta;
}

async function getUltimaRutinaLab() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/UltimaRutina");
    return respuesta;
}

async function getArticulosFV() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/tablaFV/ArticuloFinal");
    return respuesta;
}

async function putRegistrarMuestra(body) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/laboratorio/registrar_rutina", body);
    return respuesta;
}

async function validarDatosMuestras(rollo) {
    const codigo = encodeURIComponent(String(rollo || '').trim());
    return await axios.get(
        `${URL_SERVIDOR}${PUERTO_FV_LABORATORIO}BuenosAires/Laboratorio/ValidarDatosMuestras/${codigo}`
    );
}


async function getArticuloInicialFV(articuloFinal) {
    let response = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + `BuenosAires/laboratorio/tablaFV/ArticuloInicial/${articuloFinal}`);
    return response;
}

async function putCambiarEstadoCalidad(body) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_LABORATORIO + 'BuenosAires/Calidad/CambiarEstado', body);
    return respuesta;
}
async function putArchivarRutina(rutina, operario) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_LABORATORIO + 'BuenosAires/Calidad/ArchivarRutina', {
        rutina: rutina,
        operario: operario
    });
    return respuesta;
}

async function getStockCalidad() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/Calidad/Stock");
    return respuesta;
}

async function getResumenRutinas() {
    const response = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + 'BuenosAires/Laboratorio/ResumenRutinas');
    return response;
}
async function getRutinasTerminadas(force = false) {
    const qs = force ? '?force=1' : '';
    let respuesta = await axios.get(
        URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/Laboratorio/RutinasFinalizadas" + qs
    );
    return respuesta;
}


// PRODUCTIVIDAD

async function getStockRollosDeposito() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + "StockRollos");
    return respuesta;
}

async function getStockTotalPlanta() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + 'Productividad/StockRollos/TodosLosRollos');
    return respuesta;
}

async function putAgregarRolloDeposito(datos) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + 'AgregarRolloStock', datos, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return respuesta;
}

async function getBuscarRolloAlpa(rollo) {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + `BuscarRollo/${rollo}`);
    return respuesta;
}
async function putDescontarRolloDeposito(rollo) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + `StockRollos/DescontarRollo/${rollo}`);
    return respuesta;
}
async function getBuscarRolloDeposito(rollo) {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + `BuscarRolloEnStock/${rollo}`);
    return respuesta;
}
async function getReporteIngresoRollos(body) {
    let respuesta = await axios.post(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + "Reporte/IngresoRollos", body);
    return respuesta
}
async function getReporteSalidaRollos(body) {
    let respuesta = await axios.post(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + "Reporte/SalidaRollos", body);
    return respuesta;
}
async function putEnviarRollosAProduccion(body) {
    const respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + 'StockRollos/EnviarAProduccion', body);
    return respuesta;
}
async function getRollosEnProduccionXArt(articulo) {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + `StockRollos/EnProduccion/${articulo}`);
    return respuesta;
}
async function getStockRollosXArt(articulo) {
    let response = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + `StockRollos/${articulo}`);
    return response;
}
async function getRollosRechazoXArt(articulo) {
    let response = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + `Rechazos/RollosArticulo/${articulo}`);
    return response;
}
async function getStockRollosXOrden(orden) {
    const response = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + `StockRollos/rollosPorOrden/${orden}`);
    return response;
}
async function putRegistroProdReal(body) {
    const response = await axios.put(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + 'AlpacladdFVProductividadRegistroProduccion', body);
    return (response.data)
}
async function getTiposSubproductos(data) {
    const response = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + 'AlpacladdFVProductividadTablaTiposSubProd', data)
    return (response.data)
}
async function putRegistroSubprod(body) {
    const response = await axios.put(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + 'AlpacladdFVProductividadREGISTROSUBPROD', body)
    return response;
}
async function getDatosDashboardSubProd(data) {
    const response = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + 'AlpacladdFVProductividadDatosDashboardSubProd', data)
    return (response.data)
}

async function getReporteEnsayosXArticulo(body) {
    let respuesta = await axios.post(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/Laboratorio/Reporte/Articulo", body);
    return respuesta;
}

async function getReporteTiempoXRutina(rutina) {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_LABORATORIO + `BuenosAires/Laboratorio/Reporte/tiempos/rutina/${rutina}`);
    return respuesta;
}

async function getReporteTiempoXFechas(body) {
    let respuesta = await axios.post(URL_SERVIDOR + PUERTO_FV_LABORATORIO + `BuenosAires/Laboratorio/Reporte/tiempos/rutinaxFechas`, body);
    return respuesta;
}
async function getDatosDePiezas(body) {
    let respuesta = await axios.post(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/Calidad/etiqueta/imprimir", body);
    return respuesta;
}

async function getOperarios() {
    let respuesta = await axios(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/Usuarios/Operarios");
    return respuesta;
}

async function getStockQuimicos() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + "StockQuimicos");
    return (respuesta.data)
}

async function putCargaStockQuimico(body) {
    let respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + "Carga/StockQuimicos", body);
    return (respuesta)
}

async function getMonitoreoMaquinas() {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + "Maquinas/RegistrosProduccion");
    return (respuesta.data)
}

async function getOrdenesGanttPorNumero(orden) {
    let respuesta = await axios.get(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + `Gantt/GetOrdenesGanttPorNumero/${orden}`);
    return (respuesta.data);
}

async function putRegistroLaboratorio(body) {
    try {
        const respuesta = await axios.put(URL_SERVIDOR + PUERTO_FV_LABORATORIO + "BuenosAires/Laboratorio/RegistroLaboratorio", body);
        return respuesta.data;
    } catch (error) {
        console.error("❌ Error en putRegistroLaboratorio:", error);
        throw error;
    }
}

export const getStockRollosXOrden2 = async (orden) => {
    try {
        const response = await fetch(URL_SERVIDOR + PUERTO_FV_PRODUCTIVIDAD + `Gant/rollosPorOrdenStock/${orden}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error en getStockRollosXOrden:", error);
        return [];
    }
};

async function putRegistrarRechazo(body) {
    try {
        const respuesta = await axios.post(
            URL_SERVIDOR + PUERTO_FV_LABORATORIO + "Rechazos/RegistrarRechazo",
            body
        );
        return respuesta.data;
    } catch (error) {
        console.error("Error en pustRegistrarRechazo:", error);
        return { success: false, error };
    }
}

async function getVerificarRollo(lote) {
    try {
        const respuesta = await axios.get(
            URL_SERVIDOR + PUERTO_FV_LABORATORIO + `Rechazos/VerificarRollos/${lote}`,
        );
        const data = respuesta.data?.data;
        return respuesta.data?.data?.rollo ? true : false;
        return !!rollo;

    } catch (error) {
        console.error("Error en getVerificarRollo:", error);
        return false
    }
}

async function getMotivosRechazos() {
    try {
        const respuesta = await axios.get(
            URL_SERVIDOR + PUERTO_FV_LABORATORIO + "Rechazos/MotivosRechazos"
        );
        return respuesta.data?.data || [];
    } catch (error) {
        console.error("Error al obtener motivos:", error);
        return [];
    }
}



export {
    getStockTerminadoFV,
    getRutinasLaboratorio,
    PutEnsayoDeRutina,
    getEstadoRollos,
    getReporteLaboratorio,
    getReporteRutinasFiltrado,
    putInventarioPlanta,
    putFinalizarEnsayo,
    getDatosEnsayo,
    putCambiarEtapaEnsayo,
    getResultadosPosiblesEnsayos,
    getEspecificacionArticulos,
    getTodasRutinas,
    getTarimasUsadas,
    getUltimaRutinaLab,
    getArticulosFV,
    putRegistrarMuestra,
    getArticuloInicialFV,
    putCambiarEstadoCalidad,
    putArchivarRutina,
    getStockCalidad,
    getResumenRutinas,
    getRutinasTerminadas,
    getStockRollosDeposito,
    getStockTotalPlanta,
    putAgregarRolloDeposito,
    getBuscarRolloAlpa,
    putDescontarRolloDeposito,
    getBuscarRolloDeposito,
    getReporteIngresoRollos,
    getReporteSalidaRollos,
    putEnviarRollosAProduccion,
    getRollosEnProduccionXArt,
    getStockRollosXArt,
    getStockRollosXOrden,
    putRegistroProdReal,
    getTiposSubproductos,
    putRegistroSubprod,
    getDatosDashboardSubProd,
    getReporteEnsayosXArticulo,
    getReporteTiempoXRutina,
    getReporteTiempoXFechas,
    getDatosDePiezas,
    getOperarios,
    getStockQuimicos,
    putCargaStockQuimico,
    getMonitoreoMaquinas,
    getOrdenesGanttPorNumero,
    putRegistroLaboratorio,
    validarDatosMuestras,
    putRegistrarRechazo,
    getRollosRechazoXArt,
    getVerificarRollo,
    getMotivosRechazos,
}