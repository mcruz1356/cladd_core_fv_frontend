import { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  CssBaseline,
  Typography,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { colors, typography } from "../../../styles/alpacladdFvDesignTokens";

const NAVY = "#1A4862";
const NAVY_DEEP = "#122f42";

const fieldSx = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontFamily: typography.fontFamily,
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "rgba(15, 23, 42, 0.18)",
    },
    "&:hover fieldset": {
      borderColor: NAVY,
    },
    "&.Mui-focused fieldset": {
      borderColor: NAVY,
      borderWidth: "1.5px",
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
    "&.Mui-focused": { color: NAVY },
  },
};

/**
 * Login de acceso FV — diseño Acceso (card blanca sobre navy).
 * @param {string} [subtitle] Texto bajo el título Acceso
 * @param {string} [dashboardPath] Destino del botón Volver
 */
const LoginLabFV = ({
  subtitle = "Iniciar sesión para acceder al módulo",
  dashboardPath = "/BuenosAires/FlorencioVarela/AlpacladdHome",
}) => {
  const { login, isAuthenticated, auth } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/BuenosAires/FlorencioVarela/Laboratorio/App";
  const [body, setBody] = useState({ legajo: "", password: "" });

  // Si ya hay sesión en localStorage / contexto, no mostrar login
  if (isAuthenticated && auth) {
    return <Navigate to={from} replace />;
  }

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const inputChange = ({ target }) => {
    const { name, value } = target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    if (!body.legajo?.trim() || !body.password?.trim()) {
      setSnackbarMessage("Completá usuario y contraseña");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("http://192.168.0.18:4300/auth/login", body);
      const token = data.tokenSession;
      const rol = data.data.role;
      const usuario = data.data.usuario;
      const contrasenia = data.data.contrasenia;

      login({ usuario, contrasenia, rol, token });
      navigate(from, { replace: true });
    } catch (error) {
      console.log("ERROR", error);
      if (!error.response) {
        setSnackbarMessage("Error de conexión con el servidor");
      } else if (error.response?.status === 401) {
        setSnackbarMessage("Usuario inautorizado");
      } else {
        setSnackbarMessage("Fallo en el login");
      }
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") onSubmit();
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        boxSizing: "border-box",
        background: `radial-gradient(ellipse at center, #2c5570 0%, ${NAVY} 48%, ${NAVY_DEEP} 100%)`,
      }}
    >
      <CssBaseline />

      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1.5,
          }}
        >
          <LockOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
        </Box>

        <Typography
          sx={{
            fontFamily: typography.fontFamily,
            fontWeight: 700,
            fontSize: { xs: "1.75rem", sm: "2rem" },
            color: "#fff",
            letterSpacing: "0.02em",
            mb: 0.75,
          }}
        >
          Acceso
        </Typography>

        <Typography
          sx={{
            fontFamily: typography.fontFamily,
            fontWeight: 400,
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.88)",
            textAlign: "center",
            mb: 3,
            maxWidth: 340,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 3, sm: 3.5 },
          }}
        >
          <TextField
            required
            fullWidth
            id="legajo"
            label="Usuario"
            name="legajo"
            autoComplete="username"
            autoFocus
            value={body.legajo}
            onChange={inputChange}
            onKeyDown={handleKeyDown}
            sx={fieldSx}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={body.password}
            onChange={inputChange}
            onKeyDown={handleKeyDown}
            sx={{ ...fieldSx, mb: 2.5 }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LoginIcon />}
            sx={{
              backgroundColor: NAVY,
              color: "#fff",
              fontFamily: typography.fontFamily,
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: "10px",
              py: 1.35,
              boxShadow: "none",
              mb: 1.5,
              "&:hover": {
                backgroundColor: NAVY_DEEP,
                boxShadow: "none",
              },
            }}
          >
            Iniciar sesión
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(dashboardPath)}
            sx={{
              fontFamily: typography.fontFamily,
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              borderRadius: "10px",
              py: 1.2,
              color: NAVY,
              borderColor: "rgba(26, 72, 98, 0.35)",
              backgroundColor: "#fff",
              "&:hover": {
                borderColor: NAVY,
                backgroundColor: "rgba(26, 72, 98, 0.04)",
              },
            }}
          >
            Volver al dashboard
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default LoginLabFV;
