import { useEffect } from 'react';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import Menu from '../../../components/Plantilla/Menu';
import DvrIcon from '@mui/icons-material/Dvr';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BalanceLaboratorio from './Components/BalanceLaboratorio';
import RutinasTerminadas, { prefetchRutinasTerminadas } from './Components/RutinasTerminadas';
import GraficosEnsayos from './Components/GraficosEnsayos';
import TiemposLaboratorio from './Components/TiemposLaboratorio';

function ReportesTerminacion() {
  // Al entrar a Reportes, calienta la cache de Rutinas Terminadas en background
  useEffect(() => {
    prefetchRutinasTerminadas();
  }, []);

  const tabsConfig = [
    { label: 'Balance Laboratorio', icon: <AssessmentIcon />, component: <BalanceLaboratorio /> },
    { label: 'Rutinas Terminadas', icon: <CheckCircleOutlineIcon />, component: <RutinasTerminadas /> },
    { label: 'Ensayos por fecha', icon: <DvrIcon />, component: <GraficosEnsayos /> },
    { label: 'Tiempos de Laboratorio', icon: <TimelineIcon />, component: <TiemposLaboratorio /> },
  ];

  return (
    <HeaderYFooter titulo="REPORTES" routes={[]} color="alpacladd" showMainMenu={false}>
      <Menu tabsConfig={tabsConfig} defaultTab={0} />
    </HeaderYFooter>
  );
}

export default ReportesTerminacion;
