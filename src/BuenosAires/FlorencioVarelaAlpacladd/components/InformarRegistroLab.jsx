import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Grid, TextField, Button, Snackbar, Alert, Typography, Autocomplete } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import { putRegistroLaboratorio, getOperarios } from '../API/APIFunctions';
import { colors, typography } from '../../../styles/alpacladdFvDesignTokens';

const primaryBtnSx = {
  background: 'linear-gradient(145deg, #2c4356, #1e2c3a)',
  fontFamily: 'Poppins',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '10px',
  boxShadow: 'none',
  '&:hover': { background: '#1A4862' },
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: 'Poppins',
    borderRadius: '10px',
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Poppins',
  },
};

const InformarRegistroLab = ({ withChrome = false }) => {
  const [codigo, setCodigo] = useState('');
  const [operario, setOperario] = useState('');
  const [operarios, setOperarios] = useState([]);
  const [loadingOperarios, setLoadingOperarios] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const fetchOperarios = async () => {
      setLoadingOperarios(true);
      try {
        const respuesta = await getOperarios();
        const lista = Array.isArray(respuesta?.data) ? respuesta.data : [];
        setOperarios(lista);
        if (lista.length === 0) {
          showSnackbar('No se encontraron operarios (role Operador).', 'warning');
        }
      } catch (error) {
        console.error('Error al obtener operarios:', error);
        setOperarios([]);
        showSnackbar('Error al cargar operarios.', 'error');
      } finally {
        setLoadingOperarios(false);
      }
    };

    fetchOperarios();
  }, []);

  const nombresOperarios = useMemo(
    () => operarios.map((op) => op.usuario).filter(Boolean),
    [operarios]
  );

  const handleSearch = async () => {
    if (!codigo.trim()) {
      showSnackbar('Ingrese un codigo de muestra.', 'warning');
      return;
    }

    const operarioTrim = (operario || '').trim();
    if (!operarioTrim) {
      showSnackbar('Ingresá o seleccioná el operario responsable.', 'warning');
      return;
    }

    const operarioValido = nombresOperarios.find(
      (nombre) => nombre.toLowerCase() === operarioTrim.toLowerCase()
    );
    if (!operarioValido) {
      showSnackbar('El operario debe existir en la lista de Operadores.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const ahora = new Date();
      const fechaActual = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

      const body = {
        rutina: codigo.trim(),
        fecha_ingreso_laboratorio: fechaActual,
        usuario: operarioValido,
      };

      const respuesta = await putRegistroLaboratorio(body);

      if (respuesta?.success) {
        showSnackbar(
          `Rutina ${codigo.trim()} registrada (Entrada) — ${operarioValido} — ${fechaActual}`,
          'success'
        );
        setCodigo('');
      } else {
        showSnackbar(`No se encontró la rutina ${codigo.trim()}.`, 'warning');
      }
    } catch (error) {
      console.error('Error al registrar rutina:', error);
      showSnackbar('Error al conectar con el servidor.', 'error');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleDelete = () => {
    setCodigo('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        width: { xs: '100%', md: '60%' },
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        minHeight: '50vh',
        position: 'relative',
        px: 1,
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 2000, position: 'absolute', top: 0 }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <CardAlpa sx={{ width: '100%', mt: 0 }}>
        <Grid container spacing={2} padding={2.5}>
          <Grid item xs={12}>
            <Typography
              sx={{
                ...typography.cardTitle,
                mb: 0.5,
              }}
            >
              Ingreso de muestra a laboratorio
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: typography.fontFamily, color: colors.textMuted, mb: 1.5 }}
            >
              Escaneá o ingresá el código de rutina, escribí o elegí el operario y registrá la Entrada.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Código de muestra / rutina"
              variant="outlined"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={handleKeyPress}
              inputRef={inputRef}
              fullWidth
              autoFocus
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={nombresOperarios}
              value={operario}
              loading={loadingOperarios}
              onChange={(_, newValue) => setOperario(newValue || '')}
              onInputChange={(_, newInputValue) => setOperario(newInputValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Operario responsable"
                  variant="outlined"
                  required
                  helperText={loadingOperarios ? 'Cargando operarios…' : ''}
                  onKeyDown={handleKeyPress}
                  sx={fieldSx}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{
                  flex: 1,
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '10px',
                }}
              >
                Borrar código
              </Button>

              <LoadingButton
                loading={loading}
                variant="contained"
                onClick={handleSearch}
                sx={{ flex: 1, ...primaryBtnSx }}
              >
                Registrar entrada
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </CardAlpa>
    </Box>
  );

  if (withChrome) {
    return (
      <HeaderYFooter
        titulo="INGRESO MUESTRA LAB"
        routes={[
          {
            name: 'HOME',
            key: 'Home',
            route: '/BuenosAires/FlorencioVarela/AlpacladdHome',
            target: '_self',
          },
        ]}
        color="alpacladd"
        showMainMenu={false}
        showFooter={false}
      >
        {content}
      </HeaderYFooter>
    );
  }

  return content;
};

export default InformarRegistroLab;
