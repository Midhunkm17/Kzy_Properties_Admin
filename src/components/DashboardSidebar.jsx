import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  KeyboardArrowRight as ArrowIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  House,
  AddHomeWork,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 260;
const collapsedWidth = 72;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Properties", icon: <House />, path: "/properties" },
  { text: "Add Property", icon: <AddHomeWork />, path: "/add-property" },
];

// ── Logo / Brand ─────────────────────────────────────────────────────────────
const Brand = ({ open }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: open ? 2.5 : 1,
      py: 2,
      minHeight: 64,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 2,
        flexShrink: 0,
        background: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <House sx={{ color: "#fff", fontSize: 20 }} />
    </Box>
    {open && (
      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={700} fontSize={13} noWrap>
          Skanda Constructions
        </Typography>
        <Typography fontSize={11} color="text.secondary" noWrap>
          Admin Panel
        </Typography>
      </Box>
    )}
  </Box>
);

// ── Menu Items ────────────────────────────────────────────────────────────────
const MenuContent = ({ open, onNavigate }) => {
  const theme = useTheme();
  const location = useLocation();

  return (
    <Box sx={{ px: open ? 1.5 : 1, mt: 1, flex: 1 }}>
      {open && (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "text.disabled",
            px: 1,
            mb: 1,
            display: "block",
            letterSpacing: 0.8,
          }}
        >
          MAIN MENU
        </Typography>
      )}

      <List sx={{ p: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <Tooltip title={!open ? item.text : ""} placement="right">
                <ListItemButton
                  onClick={() => onNavigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    height: 46,
                    px: open ? 1.5 : 0,
                    justifyContent: open ? "flex-start" : "center",
                    gap: 1.5,
                    transition: "all 0.2s ease",
                    position: "relative",
                    bgcolor: active
                      ? alpha(theme.palette.primary.main, 0.1)
                      : "transparent",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.07),
                    },
                    // active left bar indicator
                    "&::before": active
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "20%",
                          bottom: "20%",
                          width: 3,
                          borderRadius: 4,
                          bgcolor: "primary.main",
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      color: active ? "primary.main" : "text.secondary",
                      transition: "color 0.2s",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {open && (
                    <>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: active ? 700 : 500,
                          color: active ? "primary.main" : "text.primary",
                        }}
                      />
                      {active && (
                        <ArrowIcon
                          fontSize="small"
                          sx={{ color: "primary.main", opacity: 0.7 }}
                        />
                      )}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
const DashboardSidebar = ({ mobileOpen, onMobileClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(true);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onMobileClose();
  };

  const paperStyles = (width) => ({
    width,
    boxSizing: "border-box",
    borderRight: "1px solid",
    borderColor: "divider",
    display: "flex",
    flexDirection: "column",
    bgcolor: "background.paper",
    transition: "width 0.3s ease",
    overflowX: "hidden",
  });

  const drawerContent = (isExpanded) => (
    <>
      {/* Brand */}
      <Brand open={isExpanded} />
      <Divider />

      {/* Menu */}
      <MenuContent open={isExpanded} onNavigate={handleNavigate} />

      {/* Footer */}
      {isExpanded && (
        <Box sx={{ p: 2, mt: "auto" }}>
          <Box
            sx={{
              borderRadius: 2,
              p: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            }}
          >
            <Typography fontSize={12} fontWeight={600} color="primary.main">
              Skanda Constructions
            </Typography>
            <Typography fontSize={11} color="text.secondary">
              Real Estate Admin v1.0
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );

  // ── Mobile ──
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": paperStyles(drawerWidth) }}
      >
        {/* Mobile header with close */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            minHeight: 64,
            flexShrink: 0,
          }}
        >
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
          <IconButton onClick={onMobileClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider />
        <MenuContent open={true} onNavigate={handleNavigate} />
      </Drawer>
    );
  }

  // ── Desktop ──
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": paperStyles(open ? drawerWidth : collapsedWidth),
      }}
    >
      {/* Header row with toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          px: open ? 1 : 0,
          minHeight: 64,
        }}
      >
        {open && <Brand open={true} />}
        <IconButton
          onClick={() => setOpen(!open)}
          size="small"
          sx={{
            mr: open ? 1 : 0,
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.12) },
          }}
        >
          {open ? (
            <ChevronLeftIcon fontSize="small" />
          ) : (
            <MenuIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Divider />
      <MenuContent open={open} onNavigate={handleNavigate} />

      {/* Footer only when expanded */}
      {open && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              borderRadius: 2,
              p: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            }}
          >
            <Typography fontSize={12} fontWeight={600} color="primary.main">
              Skanda Constructions
            </Typography>
            <Typography fontSize={11} color="text.secondary">
              Real Estate Admin v1.0
            </Typography>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default DashboardSidebar;
