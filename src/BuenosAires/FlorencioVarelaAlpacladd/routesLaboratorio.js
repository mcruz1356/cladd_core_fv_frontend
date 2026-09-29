export const laboratorioSubRoutes = [
  {
    name: "Ingreso de muestra a laboratorio",
    key: "INGRESOMUESTRA",
    route: "/BuenosAires/FlorencioVarela/Laboratorio/IngresoMuestra",
    target: "_self",
  },
  {
    name: "Ingreso a laboratorio",
    key: "INGRESOLAB",
    route: "/BuenosAires/FlorencioVarela/Laboratorio/Login",
    target: "_self",
  },
];

/** Rutas para el HeaderYFooter interno del módulo (incluye HOME Alpacladd). */
const routes = [
  {
    name: "HOME",
    key: "Home",
    route: "/BuenosAires/FlorencioVarela/AlpacladdHome",
    target: "_self",
  },
  ...laboratorioSubRoutes,
];

export default routes;
