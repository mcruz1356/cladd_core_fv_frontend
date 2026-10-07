import React from 'react'
import { useState } from 'react';
import { Box, Tabs, Tab, Chip, Button, Typography } from '@mui/material/';
import Grid from '@mui/material/Unstable_Grid2';
import { Navigate, useNavigate } from 'react-router-dom'
import IntroduccionReporte from './assets/Images/ReporteQuimicos.jpg';
import StockCalidad from './components/StockCalidad.jsx';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import BuscadorRutina from './BuscadorRutina.jsx';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormularioEnsayos from './components/FormularioEnsayos.jsx'
import ReporteRutinas from './components/ReporteRutinas.jsx'
import { useAuth } from '../../AuthContext';
import ScienceIcon from '@mui/icons-material/Science';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HeaderYFooter from '../../components/Plantilla/HeaderYFooter';
import { tabsBand, tabsCapsule, tabsRootSx, colors, typography } from '../../styles/alpacladdFvDesignTokens';

const LOGIN_PATH = '/BuenosAires/FlorencioVarela/Laboratorio/Login';

export default function FVLaboratorio() {

    const [Tabvalue, setTabvalue] = useState('RutinasActivas');
    const [rutina, setRutina] = useState('');
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleTabsChange = (event, newValue, rutina = '') => {
        setTabvalue(newValue);
        setRutina(rutina);
    };

    const handleLogout = () => {
        logout();
        navigate(LOGIN_PATH, { replace: true });
    };

    const rolLabel = Array.isArray(auth?.rol) ? auth.rol.join(', ') : (auth?.rol || '');

    function renderSwitch(key) {
        switch (key) {
            case 'GENERAL':
                <Box sx={{ backgroundImage: `url(${IntroduccionReporte})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", opacity: '2' }}>
                    <div style={{ height: "90vh", position: 'relative' }}></div>
                </Box>

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
            <Box
                sx={{
                    ...tabsBand,
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.25,
                        flexWrap: 'wrap',
                        width: '100%',
                    }}
                >
                    <Chip
                        icon={<PersonIcon sx={{ fontSize: 18 }} />}
                        label={
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.75 }}>
                                <Typography
                                    component="span"
                                    sx={{
                                        fontFamily: typography.fontFamily,
                                        fontWeight: 700,
                                        fontSize: '0.78rem',
                                        color: colors.brand,
                                    }}
                                >
                                    {auth?.usuario || 'Sin usuario'}
                                </Typography>
                                {rolLabel ? (
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontFamily: typography.fontFamily,
                                            fontWeight: 500,
                                            fontSize: '0.7rem',
                                            color: colors.textMuted,
                                        }}
                                    >
                                        · {rolLabel}
                                    </Typography>
                                ) : null}
                            </Box>
                        }
                        sx={{
                            height: 36,
                            backgroundColor: '#fff',
                            border: '1px solid rgba(26,72,98,0.12)',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(26,72,98,0.06)',
                            '& .MuiChip-icon': { color: colors.brand, ml: 0.75 },
                            '& .MuiChip-label': { px: 1.25 },
                        }}
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            fontFamily: typography.fontFamily,
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: '10px',
                            color: colors.brand,
                            borderColor: 'rgba(26,72,98,0.35)',
                            px: 1.5,
                            py: 0.75,
                            backgroundColor: '#fff',
                            '&:hover': {
                                borderColor: colors.brand,
                                backgroundColor: 'rgba(26,72,98,0.04)',
                            },
                        }}
                    >
                        Cerrar sesión
                    </Button>
                </Box>

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
