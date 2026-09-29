import  Navbar  from '../Navbar/Navbar';
import AlpaLogo from '../../assets/Images/alpaLogo.png';
import { Box, Typography } from "@mui/material";

import { pageContainer } from "../../styles/alpacladdFvDesignTokens";
import AlpacladdFvMainMenu from "../../BuenosAires/FlorencioVarelaAlpacladd/components/AlpacladdFvMainMenu";

function HeaderYFooter({ children, titulo, color, routes, showMainMenu = true, showFooter = true }) {
  const contentStyle = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  };

  const capsuleMenu = showMainMenu && Array.isArray(routes) && routes.length > 0;

  return (
    <Box sx={{ ...pageContainer, overflowX: 'hidden' }}>
      {/* Navbar */}
      <div 
        className="CladdHome" 
        style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}
      >
        <Navbar
          Titulo={titulo ? titulo : ""}
          color={color === "enod" ? "enod" : "alpacladd"}
          plantaLogo={AlpaLogo}
          Routes={routes ?? []}
          showDesktopRoutes={!capsuleMenu && showMainMenu}
        />
      </div>

      {capsuleMenu ? <AlpacladdFvMainMenu routes={routes} /> : null}



      {/* Main content */}
      <div style={contentStyle}>
        {children}
      </div>

      {/* Logo en la Esquina */}
      {/* <Box
        sx={{
          position: "fixed",
          bottom: 65,
          right: 45,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        <img src={LogoImage} alt="Logo" style={{ width: "100px", height: "auto" }} />
      </Box> */}

      {/* Footer */}
      {showFooter ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          <Typography variant="caption" color="white">© Automatización - La Rioja</Typography>
          <Typography variant="caption" color="white">Dirección Industrial</Typography>
        </Box>
      ) : null}
    </Box>
  );
}

export default HeaderYFooter;
