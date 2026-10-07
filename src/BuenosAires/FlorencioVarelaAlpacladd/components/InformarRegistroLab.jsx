import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CardAlpa from '../../../components/Plantilla/CardAlpa';
import HeaderYFooter from '../../../components/Plantilla/HeaderYFooter';
import { putRegistroLaboratorio } from '../API/APIFunctions';
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
  const [loading, setLoading] = useState(false);
  const [rutinaEnProceso, setRutinaEnProceso] = useState('');
  const inputRef = useRef(null);
  const processingRef = useRef(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const registrarEntrada = async (codigoEscaneado) => {
    const rutina = (codigoEscaneado || '').trim();
    if (!rutina) {
      showSnackbar('Escaneá o ingresá un código de muestra / rutina.', 'warning');
      return;
    }

    if (processingRef.current) return;
    processingRef.current = true;
    setLoading(true);
    setRutinaEnProceso(rutina);
    setSnackbarOpen(false);

    try {
      const ahora = new Date();
      const fechaActual = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

      const body = {
        rutina,
        fecha_ingreso_laboratorio: fechaActual,
        usuario: '',
      };

      const respuesta = await putRegistroLaboratorio(body);

      if (respuesta?.success) {
        setCodigo('');
        showSnackbar(
          `Estado actualizado: rutina ${rutina} → Entrada`,
          'success'
        );
      } else {
        showSnackbar(
          `No se pudo registrar: no se encontró la rutina ${rutina}.`,
          'warning'
        );
      }
    } catch (error) {
      console.error('Error al registrar rutina:', error);
      const msg =
        error?.response?.data?.message ||
        'Error al conectar con el servidor. Intentá de nuevo.';
      showSnackbar(msg, 'error');
    } finally {
      setLoading(false);
      setRutinaEnProceso('');
      processingRef.current = false;
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleDelete = () => {
    if (loading) return;
    setCodigo('');
    inputRef.current?.focus();
  };

  /** El lector de códigos envía Enter al terminar el escaneo → registra y cambia estado. */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!loading) registrarEntrada(codigo);
    }
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
        autoHideDuration={snackbarSeverity === 'success' ? 5000 : 4500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 2000 }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          icon={
            snackbarSeverity === 'success' ? (
              <CheckCircleOutlineIcon fontSize="inherit" />
            ) : undefined
          }
          sx={{
            width: '100%',
            maxWidth: 480,
            fontFamily: typography.fontFamily,
            fontWeight: 600,
            alignItems: 'center',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <CardAlpa sx={{ width: '100%', mt: 0 }}>
        <Grid container spacing={2} padding={2.5}>
          <Grid item xs={12}>
            <Typography sx={{ ...typography.cardTitle, mb: 0.5 }}>
              Ingreso de muestra a laboratorio
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: typography.fontFamily, color: colors.textMuted, mb: 1.5 }}
            >
              Escaneá el código de rutina o muestra. Al escanear se registra la entrada y el estado pasa a Entrada automáticamente.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Código de muestra / rutina"
              variant="outlined"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={handleKeyDown}
              inputRef={inputRef}
              fullWidth
              autoFocus
              disabled={loading}
              placeholder="Esperando escaneo…"
              sx={fieldSx}
              InputProps={{
                endAdornment: loading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={22} sx={{ color: colors.brand }} />
                  </InputAdornment>
                ) : null,
              }}
            />
          </Grid>

          {loading && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  px: 1.5,
                  py: 1.25,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(26, 72, 98, 0.06)',
                  border: '1px solid rgba(26, 72, 98, 0.12)',
                }}
              >
                <CircularProgress size={20} sx={{ color: colors.brand }} />
                <HourglassTopIcon sx={{ color: colors.brand, fontSize: 20 }} />
                <Typography
                  sx={{
                    fontFamily: typography.fontFamily,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: colors.brand,
                  }}
                >
                  Registrando rutina {rutinaEnProceso}… cambiando estado a Entrada
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={loading}
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
                onClick={() => registrarEntrada(codigo)}
                disabled={loading}
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
