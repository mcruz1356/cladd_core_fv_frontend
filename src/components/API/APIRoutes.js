
//Direccion de la API
const APIURL="http://192.168.40.95:4205/";   // Server
// const APIURL="http://192.168.40.87:3006/";   // Notebook Mariano
// const APIURL="http://192.168.0.18:4205/";     // Notebook Mariano VPN (no disponible)

const APIURL_Calidad ="http://192.168.40.95:4205/Calidad/Revisado/resumen"             //API Calidad Data
 
//Buscar Rollo por Partida y Secuencia  Datos del Toyota
const RolloCalidadxfecha                                =APIURL+"AlpacladdCalidadRollo/"; 
const ReporteCalidadRollosxTelar                        =APIURL+"AlpacladdCalidadRollosPorTelar/";
const ReporteCalidadRolloHistorial                      =APIURL+"AlpacladdCalidadRolloHistorial/";
const ReporteCalidadGrupoFallas                         =APIURL+"AlpacladdCalidadGrupoFallas/";
const ReporteCalidadPorRollo                            =APIURL+"AlpacladdCalidadPorRollo/";
const ReporteRolloCalidadRevisado                       =APIURL+"AlpacladdCalidadRevisadoPorFecha/";
const ReporteRolloCalidadTrenFallaFecha                 =APIURL+"AlpacladdCalidadTrenFallasPorFecha/";
const ReporteRolloCalidadResumenFallasArticulosFecha    =APIURL+"AlpacladdCalidadTrenFallasArticulosPorFecha/";
const ReporteRolloAptoBLanco                            =APIURL+"AlpacladdCalidadAptoParaBlancoPorFecha/";
const ReporteRolloNoAptoBLanco                          =APIURL+"AlpacladdCalidadNOAptoParaBlancoPorFecha/";
const ReporteMetrosArticulos                            =APIURL+"AlpacladdCalidadMetrosArticulosRollos/";

//Articulos
const TablaArticulos                                    =APIURL+"AlpacladdCalidadTABLAARTICULOS";
const TablaDetalles                                     =APIURL+"AlpacladdCalidadTABLADETALLES/";
const CargarArticulos                                   =APIURL+"AlpacladdCalidadREGISTROARTICULO";
const TablaArticulosDetalles                            =APIURL+"AlpacladdCalidadTABLADETALLESARTICULOS";

// Datos Graficos
const DatosAptosNoaptos                                 =APIURL+"AlpacladdCalidadDATOSAPTOSNOAPTOS";
const DatosAptosNoaptosMensual                          =APIURL+"AlpacladdCalidadDATOSAPTOSNOAPTOSMENSUAL";

// Datos Formulario Revisado
const TablaOperarios                                    =APIURL+"AlpacladdCalidadTABLAOPERARIOS";
const TablaFallas                                       =APIURL+"AlpacladdCalidadTABLAFALLAS";
const RollosCreados                                     =APIURL+"AlpacladdCalidadROLLOSCREADOS";
const DatosRollo                                        =APIURL+"AlpacladdCalidadDATOETIQUETA/";
const DetalleRevisado                                   =APIURL+"AlpacladdCalidadDETALLEREVISADOROLLO/";
const RegistroDetallesRevisado                          =APIURL+"AlpacladdCalidadREGISTRODETALLESREVISADO";
const EliminarDetalle                                   =APIURL+"AlpacladdCalidadEliminarDetalle/";
const AgregarDetalleARevisado                           =APIURL+'AlpacladdCalidadGuardarDetallesRevisado/';

const APIRoutes = [ 
    {
        RolloCalidadxfecha                                  :     RolloCalidadxfecha,
        ReporteCalidadRollosxTelar                          :     ReporteCalidadRollosxTelar,
        ReporteCalidadRolloHistorial                        :     ReporteCalidadRolloHistorial,
        ReporteCalidadGrupoFallas                           :     ReporteCalidadGrupoFallas,
        ReporteCalidadPorRollo                              :     ReporteCalidadPorRollo,
        ReporteRolloCalidadRevisado                         :     ReporteRolloCalidadRevisado,
        APIURL_Calidad                                      :     APIURL_Calidad,
        ReporteRolloCalidadTrenFallaFecha                   :     ReporteRolloCalidadTrenFallaFecha,
        ReporteRolloCalidadResumenFallasArticulosFecha      :     ReporteRolloCalidadResumenFallasArticulosFecha,
        ReporteRolloAptoBLanco                              :     ReporteRolloAptoBLanco,
        ReporteRolloNoAptoBLanco                            :     ReporteRolloNoAptoBLanco,
        TablaArticulos                                      :     TablaArticulos,
        TablaDetalles                                       :     TablaDetalles,
        CargarArticulos                                     :     CargarArticulos,
        DatosAptosNoaptos                                   :     DatosAptosNoaptos,
        DatosAptosNoaptosMensual                            :     DatosAptosNoaptosMensual,
        TablaArticulosDetalles                              :     TablaArticulosDetalles,
        ReporteMetrosArticulos                              :     ReporteMetrosArticulos,
        TablaOperarios                                      :     TablaOperarios,
        TablaFallas                                         :     TablaFallas,
        RollosCreados                                       :     RollosCreados,
        DatosRollo                                          :     DatosRollo,
        DetalleRevisado                                     :     DetalleRevisado,
        RegistroDetallesRevisado                            :     RegistroDetallesRevisado,
        EliminarDetalle                                     :     EliminarDetalle,
        AgregarDetalleARevisado                             :     AgregarDetalleARevisado,
    },

  ];
  export default APIRoutes;