import { Routes, Route, Navigate } from "react-router-dom";

/* BUENOS AIRES - FLORENCIO VARELA */
import ReportesProductividad from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/components/ReportesProductividad";
import ReportesTerminacion from "./BuenosAires/FlorencioVarelaAlpacladd/Terminacion/ReportesTerminacion";
import PaginaEtiqueta from "./BuenosAires/FlorencioVarelaAlpacladd/Terminacion/PaginaEtiqueta";
import AlpacladdHomeFV from "./BuenosAires/FlorencioVarelaAlpacladd/AlpacladdHomeFV";
import GanProgramacionFV from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/PCP/components/GantProgramacionFV";
import GraficoGantFV from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/PCP/components/GraficoGantPcp";
import FormularioEnsayos from './BuenosAires/FlorencioVarelaAlpacladd/components/FormularioEnsayos.jsx';

import FVLaboratorio from "./BuenosAires/FlorencioVarelaAlpacladd/FVLaboratorio";
import LoginLabFV from "./BuenosAires/FlorencioVarelaAlpacladd/Login/Login";
import FormularioRegistrarMuestra from "./BuenosAires/FlorencioVarelaAlpacladd/components/RegistrarMuestra";
import AgregarRolloFV from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/AgregarRolloFV";
import StockRollos from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/StockDeRollos";
import StockPlanta from "./BuenosAires/FlorencioVarelaAlpacladd/components/StockPlanta";
import SubProducto from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/components/SubProducto";
import VerRutina from "./BuenosAires/FlorencioVarelaAlpacladd/VerRutina.jsx";

import ProduccionFV from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/ProduccionFV";
import GraficoGiroLento from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/PCP/components/GraficoGiroLento.jsx";

import StockDeQuimicos from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/StockDeQuimicos";
import ActulizarQuimico from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/components/FormStockQuimicos";

import RegistroDatosOEE from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/RegistroOEE/RegistroOEE/RegistroDatosOEE.jsx";
import ModuloOEE from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/RegistroOEE/ModuloOEE.jsx";
import MonitoreoMaquinas from "./BuenosAires/FlorencioVarelaAlpacladd/Monitoreo/MonitoreoMaquinas.jsx";
import FormularioReprocesos from "./BuenosAires/FlorencioVarelaAlpacladd/Productividad/PCP/components/FormularioReprocesos.jsx";
import InformarRegistroLab from "./BuenosAires/FlorencioVarelaAlpacladd/components/InformarRegistroLab.jsx";
/* BUENOS AIRES - FLORENCIO VARELA  - TERMINACIÓN*/
import Terminacion from "./BuenosAires/FlorencioVarelaAlpacladd/Terminacion/Terminacion";
import StockCalidad from "./BuenosAires/FlorencioVarelaAlpacladd/components/StockCalidad";
import ReimpresionEtiquetas from "./BuenosAires/FlorencioVarelaAlpacladd/Terminacion/ReimpresionEtiquetas.jsx"
import RechazosRegistro from "./BuenosAires/FlorencioVarelaAlpacladd/Terminacion/RechazosRegistro.jsx";

import RequireAuth from "./BuenosAires/FlorencioVarelaAlpacladd/components/RequireAuth";
import Articulos from "./components/Componentes/Articulos";

function App() {
  return (
    <Routes>
      {/* Ruta raíz */}
      <Route path="/" element={<Navigate to="/BuenosAires/FlorencioVarela/AlpacladdHome" replace />} />

      {/* BuenosAires SanMartin */}
      {/* <Route path="/BuenosAires/CladdSanMartin" element={<CladdSanMartin />} /> */}

      {/* TINTORERIA */}
      {/* <Route
        path="/BuenosAires/CladdSanMartin/TintoreriaSalon"
        element={<SalonTintoreria />}
      />
      <Route
        path="/BuenosAires/CladdSanMartin/Tintoreria/TintoreriaReportes"
        element={<TintoreriaReportes />}
      /> */}

      {/* BUENOS AIRES - FLORENCIO VARELA */}
      <Route
        path="/BuenosAires/FlorencioVarela/AlpacladdHome"
        element={<AlpacladdHomeFV />}
      />

      {/* PRODUCTIVIDAD */}
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad"
        element={<Navigate to="/BuenosAires/FlorencioVarela/AlpacladdHome" replace />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/PCP"
        element={<GanProgramacionFV />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/PCP/GraficoGantFV"
        element={<GraficoGantFV />}
      />

      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/StockDeRollos"
        element={<StockRollos />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/AgregarRolloFV"
        element={<AgregarRolloFV />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/StockPlanta"
        element={<StockPlanta />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/ReportesProductividad"
        element={<ReportesProductividad />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/Subproducto"
        element={<SubProducto />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/StockDeQuimicos"
        element={<StockDeQuimicos />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/ActualizarQuimicoFV"
        element={<ActulizarQuimico />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/RegistroOEE/ModuloOEE"
        element={<ModuloOEE />}
      />
      <Route
        path="/BuenosAires/FlorencioVarelaAlpacladd/Monitoreo/MonitoreoMaquinas"
        element={<MonitoreoMaquinas />}
      />
      <Route
        path="/BuenosAires/FlorencioVarelaAlpacladd/Productividad/PCP/components/FormularioReprocesos"
        element={<FormularioReprocesos />}
      />

      {/* TERMINACION */}
      <Route
        path="/BuenosAires/FlorencioVarela/Terminacion"
        element={<Terminacion />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Terminacion/Reportes"
        element={<ReportesTerminacion />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Terminacion/Etiqueta"
        element={<PaginaEtiqueta />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Terminacion/FichaTecnica"
        element={<Articulos rol={"fv"} />}
      />
      <Route
        path="/BuenosAires/FlorencioVarelaAlpacladd/Terminacion/ReimpresionEtiquetas"
        element={<ReimpresionEtiquetas />}
      />
      <Route
        path="/BuenosAires/FlorencioVarelaAlpacladd/Terminacion/RechazosRegistro"
        element={<RechazosRegistro/>}/>


      {/* RegistrarMuestra: accesible sin login */}
      <Route
        path="/BuenosAires/FlorencioVarela/Terminacion/RegistrarMuestra"
        element={<FormularioRegistrarMuestra />}
      />

      {/* LABORATORIO — sin panel hub; ingreso públicos */}
      <Route
        path="/BuenosAires/FlorencioVarela/Laboratorio"
        element={<Navigate to="/BuenosAires/FlorencioVarela/AlpacladdHome" replace />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Laboratorio/IngresoMuestra"
        element={<InformarRegistroLab withChrome />}
      />
      <Route
        path="/BuenosAires/FlorencioVarelaAlpacladd/components/InformarRegistroLab"
        element={<InformarRegistroLab withChrome />}
      />
      <Route
        path="/BuenosAires/FlorencioVarela/Laboratorio/Login"
        element={
          <LoginLabFV
            subtitle="Iniciar sesión para acceder al módulo de laboratorio"
            dashboardPath="/BuenosAires/FlorencioVarela/AlpacladdHome"
          />
        }
      />

      {/* LABORATORIO / STOCK CALIDAD - rutas protegidas */}
      <Route
        element={
          <RequireAuth
            allowedRoles={["Administrador", "Operador", "Supervisor"]}
          />
        }
      >
        <Route
          path="/BuenosAires/FlorencioVarela/Laboratorio/App"
          element={<FVLaboratorio />}
        />
        <Route
          path="/BuenosAires/FlorencioVarela/Terminacion/StockCalidad"
          element={<StockCalidad withChrome />}
        />
      </Route>

      <Route path="/formulario-ensayos/:rutinaId" element={<FormularioEnsayos />} />
      <Route path="/ver-rutina/:rutinaId" element={<VerRutina />} />

      <Route path="/BuenosAires/FlorencioVarela/Productividad/PCP/GraficoGiroLento" element={<GraficoGiroLento />} />


      {/* PRODUCCIÓN */}
      <Route
        path="/BuenosAires/FlorencioVarela/Productividad/Produccion"
        element={<ProduccionFV />}
      />
    </Routes>
  );
}

export default App;
