import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import InventoryIcon from '@mui/icons-material/Inventory';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PrintIcon from '@mui/icons-material/Print';
import BlockIcon from '@mui/icons-material/Block';

import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import ProductividadAccesoCard from '../Productividad/components/ProductividadAccesoCard';
import routes from './routesTerminacion.js';
import LogoFinal from './Images/alpaLogoHOME.png';
import {
  colors,
  gradients,
  shadows,
  typography,
} from '../../../styles/alpacladdFvDesignTokens';

const MODULOS = [
  {
    title: 'Registrar muestra',
    description: 'Alta de muestras e ingresos a laboratorio.',
    icon: ScienceIcon,
    route: '/BuenosAires/FlorencioVarela/Terminacion/RegistrarMuestra',
  },
  {
    title: 'Stock calidad',
    description: 'Seguimiento de rutinas y estados de calidad.',
    icon: InventoryIcon,
    route: '/BuenosAires/FlorencioVarela/Terminacion/StockCalidad',
  },
  {
    title: 'Etiqueta',
    description: 'Generación de etiquetas de calidad.',
    icon: QrCodeIcon,
    route: '/BuenosAires/FlorencioVarela/Terminacion/Etiqueta',
  },
  {
    title: 'Reportes',
    description: 'Balance, rutinas y gráficos de laboratorio.',
    icon: AssessmentIcon,
    route: '/BuenosAires/FlorencioVarela/Terminacion/Reportes',
  },
  {
    title: 'Reimprimir etiquetas',
    description: 'Reimpresión de etiquetas por código de rollo.',
    icon: PrintIcon,
    route: '/BuenosAires/FlorencioVarelaAlpacladd/Terminacion/ReimpresionEtiquetas',
  },
  {
    title: 'Rechazos',
    description: 'Registro de rechazos de producción y calidad.',
    icon: BlockIcon,
    route: '/BuenosAires/FlorencioVarelaAlpacladd/Terminacion/RechazosRegistro',
  },
];

function Terminacion() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Terminación - Florencio Varela';
  }, []);

  return (
    <HeaderYFooter titulo="TERMINACION" routes={routes} color="alpacladd">
      <Box
        sx={{
          width: '100%',
          maxWidth: 1700,
          mx: 'auto',
          boxSizing: 'border-box',
          px: { xs: 1.6, md: 2.8, lg: 3.4 },
          py: { xs: 1.6, md: 2.2 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: '14px',
            overflow: 'hidden',
            border: `1px solid ${colors.borderSlate08}`,
            boxShadow: shadows.dashboardLg,
            mb: { xs: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              background: gradients.kpiHeader,
              px: { xs: 2, md: 3 },
              py: { xs: 1.4, md: 1.8 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                sx={{
                  ...typography.titleApp,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  color: colors.white,
                }}
              >
                Panel de Terminación
              </Typography>
              <Typography
                sx={{
                  fontFamily: typography.fontFamily,
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: { xs: '0.78rem', md: '0.88rem' },
                  mt: 0.5,
                }}
              >
                Accesos a calidad, etiquetas, reportes y rechazos
              </Typography>
            </Box>
            <Box
              component="img"
              src={LogoFinal}
              alt="Alpacladd"
              sx={{ width: { xs: 120, sm: 150, md: 180 }, height: 'auto' }}
            />
          </Box>
        </Paper>

        <Grid container spacing={1.75}>
          {MODULOS.map((modulo) => (
            <Grid item xs={12} sm={6} md={4} key={modulo.route}>
              <ProductividadAccesoCard
                title={modulo.title}
                description={modulo.description}
                icon={modulo.icon}
                onClick={() => navigate(modulo.route)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </HeaderYFooter>
  );
}

export default Terminacion;
