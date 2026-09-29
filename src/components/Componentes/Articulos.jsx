import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddIcon from '@mui/icons-material/Add';
import DvrIcon from '@mui/icons-material/Dvr';

import AlpaLogo from '../../assets/Images/alpaLogo.png';
import Navbar from '../Navbar/Navbar';
import HeaderYFooter from '../Plantilla/HeaderYFooter';
import Menu from '../Plantilla/Menu';
import CargarArticulos from './CargarArticulos';
import TablaArtDetalles from './TablaArtDetalles';
import DetallesArticulos from './DetallesArticulos';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { pageContainer, tabsBand, tabsCapsule, tabsRootSx } from '../../styles/alpacladdFvDesignTokens';

function CustomTabPanel({ children, value, index }) {
    if (value !== index) return null;
    return <Box sx={{ width: '100%', p: 2 }}>{children}</Box>;
}

export const Articulos = ({ rol = 'lr' }) => {
    const [value, setValue] = useState(1);
    const isFv = rol === 'fv';

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    const homeTarget = isFv
        ? '/BuenosAires/FlorencioVarela/AlpacladdHome'
        : '/LaRioja/Alpacladd/Productividad/Calidad/';

    const tabsConfig = useMemo(() => {
        const tabs = [
            {
                key: 'home',
                label: 'Home',
                icon: <HomeIcon />,
                component: <Navigate to={homeTarget} replace />,
            },
            {
                key: 'detalles',
                label: 'Detalles Articulos',
                icon: <ManageSearchIcon />,
                component: <DetallesArticulos />,
            },
            {
                key: 'registros',
                label: 'Registros',
                icon: <DvrIcon />,
                component: <TablaArtDetalles />,
            },
        ];
        if (!isFv) {
            tabs.push({
                key: 'agregar',
                label: 'Agregar Articulo',
                icon: <AddIcon />,
                component: <CargarArticulos />,
            });
        }
        return tabs;
    }, [homeTarget, isFv]);

    if (isFv) {
        return (
            <HeaderYFooter titulo="FICHA TECNICA" color="alpacladd" showMainMenu={false} routes={[]}>
                <Menu tabsConfig={tabsConfig} value={value} onChange={handleChange} />
            </HeaderYFooter>
        );
    }

    return (
        <Box sx={{ ...pageContainer, overflowX: 'hidden' }}>
            <div className="CladdHome" style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>
                <Navbar Titulo="FICHA TECNICA" color="alpacladd" plantaLogo={AlpaLogo} />
            </div>

            <Box sx={tabsBand}>
                <Box sx={tabsCapsule}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            ...tabsRootSx,
                            minHeight: 56,
                            '& .MuiTab-root': {
                                ...tabsRootSx['& .MuiTab-root'],
                                textTransform: 'uppercase',
                                fontSize: '0.62rem',
                            },
                        }}
                    >
                        <Tab label="Home" icon={<HomeIcon />} />
                        <Tab label="Detalles Articulos" icon={<ManageSearchIcon />} />
                        <Tab label="Registros" icon={<DvrIcon />} />
                        <Tab label="Agregar Articulo" icon={<AddIcon />} />
                    </Tabs>
                </Box>
            </Box>

            <CustomTabPanel value={value} index={0}>
                <Navigate to={homeTarget} replace />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <DetallesArticulos />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <TablaArtDetalles />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <CargarArticulos />
            </CustomTabPanel>

            <Box
                display="flex"
                flexDirection="column"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                }}
            >
                <Typography variant="caption" color="white">
                    © Automatización - La Rioja
                </Typography>
                <Typography variant="caption" color="white">
                    Dirección Industrial
                </Typography>
            </Box>
        </Box>
    );
};

export default Articulos;
