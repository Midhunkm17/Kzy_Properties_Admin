import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { House, Menu as MenuIcon } from "@mui/icons-material";
import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box display="flex" minHeight="100vh">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3 },
          py: 2,
          // On desktop the sidebar is permanent, so we don't need offset.
          // On mobile we add a top bar height offset so content isn't hidden.
          mt: { xs: "56px", md: 0 },
          width: { xs: "100%", md: "auto" },
          minWidth: 0, // prevent flex overflow
        }}
      >
        {children}
      </Box>

      {/* Mobile top app bar */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            display: "flex",
            alignItems: "center",
            px: 2,
            zIndex: theme.zIndex.drawer + 1,
            backgroundImage:
              "linear-gradient(90deg, rgb(255, 255, 255), rgb(227, 225, 225))",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          <IconButton onClick={() => setMobileOpen(true)} edge="start">
            <MenuIcon />
          </IconButton>{" "}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                flexShrink: 0,
                background: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: 1,
              }}
            >
              <House sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={13}>
                Skanda Constructions
              </Typography>
              <Typography fontSize={11} color="text.secondary">
                Admin Panel
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
