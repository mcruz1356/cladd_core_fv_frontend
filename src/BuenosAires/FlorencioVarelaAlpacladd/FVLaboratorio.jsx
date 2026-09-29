import React from 'react'
import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material/';
import Grid from '@mui/material/Unstable_Grid2';
import { Navigate } from 'react-router-dom'
import IntroduccionReporte from './assets/Images/ReporteQuimicos.jpg';
import StockCalidad from './components/StockCalidad.jsx';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import BuscadorRutina from './BuscadorRutina.jsx';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormularioEnsayos from './components/FormularioEnsayos.jsx'
import ReporteRutinas from './components/ReporteRutinas.jsx'
import { useAuth } from '../../AuthContext';
import ScienceIcon from '@mui/icons-material/Science';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HeaderYFooter from '../../components/Plantilla/HeaderYFooter';
import { tabsBand, tabsCapsule, tabsRootSx } from '../../styles/alpacladdFvDesignTokens';

export default function FVLaboratorio() {

    const [Tabvalue, setTabvalue] = useState('RutinasActivas');
    const [rutina, setRutina] = useState('');
    const { auth } = useAuth();
    const handleTabsChange = (event, newValue, rutina = '') => {
        setTabvalue(newValue);
        setRutina(rutina);

    };

    function renderSwitch(key) {
        switch (key) {
            case 'GENERAL':
                <Box sx={{ backgroundImage: `url(${IntroduccionReporte})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", opacity: '2' }}>
                    <div style={{ height: "90vh", position: 'relative' }}></div>
                </Box>

            case 'info':
                return auth?.usuario
            case 'HOME':
                return <Navigate to={"/BuenosAires/FlorencioVarela/AlpacladdHome"} replace />;
            case 'RutinasActivas':
                return <BuscadorRutina handleTabChange={handleTabsChange} />;
            case 'FormularioRegistro':
                return <FormularioEnsayos rutina={rutina} handleTabChange={handleTabsChange}/>;
            case 'ReporteRutinas':
                return <ReporteRutinas />;
            case 'StockCalidad':
                return <StockCalidad />;
            default:
                return (
                    <Box sx={{ backgroundImage: `url(${IntroduccionReporte})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", opacity: '2' }}>
                        <div style={{ height: "90vh", position: 'relative' }}></div>
                    </Box>
                );
        }
    }


    return (
        <HeaderYFooter titulo="LABORATORIO" routes={[]} color="alpacladd" showMainMenu={false} showFooter={false}>
            <Box sx={tabsBand}>
                <Box sx={tabsCapsule}>
                    <Tabs
                        value={Tabvalue}
                        onChange={handleTabsChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={tabsRootSx}
                    >
                        <Tab icon={<HomeIcon />} value="HOME" label="Home" />
                        <Tab
                          icon={<FormatListNumberedIcon />}
                          value="RutinasActivas"
                          label="Rutinas activas"
                          sx={{ borderLeft: "1px solid rgba(15, 23, 42, 0.12)" }}
                        />
                        <Tab icon={<ScienceIcon />} value="FormularioRegistro" label="Formulario" />
                        <Tab icon={<AssessmentIcon />} value="ReporteRutinas" label="Reporte rutinas" />
                        <Tab value="info" disabled label={auth?.usuario} icon={<PersonIcon />} />
                    </Tabs>
                </Box>
            </Box>

            <Grid container width={'100%'} sx={{ boxSizing: 'border-box' }}>
                <Grid xs={12} md={12} lg={12} mt={1} p={1} >
                    {renderSwitch(Tabvalue)}
                </Grid>
            </Grid>
        </HeaderYFooter>
    )
}
