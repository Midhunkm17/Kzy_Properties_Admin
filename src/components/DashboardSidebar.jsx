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
  Avatar,
  useTheme,
  Badge,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  BarChart as AnalyticsIcon,
  Logout as LogoutIcon,
  KeyboardArrowRight as ArrowIcon,
  House,
  AddHomeWork
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 260;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(3, 2),
  ...theme.mixins.toolbar,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const DashboardSidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const currentPage = window.location.pathname;

  // Define a gradient background
  const gradientBg = `linear-gradient(180deg, ${alpha(
    theme.palette.primary.main,
    0.05
  )} 0%, ${alpha(theme.palette.background.default, 0.0)} 100%)`;

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Properties", icon: <House />, path: "/properties" },
    { text: "Add Property", icon: <AddHomeWork />, path: "/add-property" },
    // { text: 'Notifications', icon: <NotificationsIcon />, badge: 5, status: null },
    // { text: 'Settings', icon: <SettingsIcon />, badge: null, status: null },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundImage:
            " linear-gradient(112.5deg, rgb(214, 214, 214) 0%, rgb(214, 214, 214) 10%,rgb(195, 195, 195) 10%, rgb(195, 195, 195) 53%,rgb(176, 176, 176) 53%, rgb(176, 176, 176) 55%,rgb(157, 157, 157) 55%, rgb(157, 157, 157) 60%,rgb(137, 137, 137) 60%, rgb(137, 137, 137) 88%,rgb(118, 118, 118) 88%, rgb(118, 118, 118) 91%,rgb(99, 99, 99) 91%, rgb(99, 99, 99) 100%),linear-gradient(157.5deg, rgb(214, 214, 214) 0%, rgb(214, 214, 214) 10%,rgb(195, 195, 195) 10%, rgb(195, 195, 195) 53%,rgb(176, 176, 176) 53%, rgb(176, 176, 176) 55%,rgb(157, 157, 157) 55%, rgb(157, 157, 157) 60%,rgb(137, 137, 137) 60%, rgb(137, 137, 137) 88%,rgb(118, 118, 118) 88%, rgb(118, 118, 118) 91%,rgb(99, 99, 99) 91%, rgb(99, 99, 99) 100%),linear-gradient(135deg, rgb(214, 214, 214) 0%, rgb(214, 214, 214) 10%,rgb(195, 195, 195) 10%, rgb(195, 195, 195) 53%,rgb(176, 176, 176) 53%, rgb(176, 176, 176) 55%,rgb(157, 157, 157) 55%, rgb(157, 157, 157) 60%,rgb(137, 137, 137) 60%, rgb(137, 137, 137) 88%,rgb(118, 118, 118) 88%, rgb(118, 118, 118) 91%,rgb(99, 99, 99) 91%, rgb(99, 99, 99) 100%),linear-gradient(90deg, rgb(195, 195, 195),rgb(228, 228, 228)); background-blend-mode:overlay,overlay,overlay,normal;",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
          borderRight: "none",
          color: "black",
        },
      }}
    >
      <DrawerHeader>
        <Box sx={{ display: "flex", justifyContent: "center", ml: 1 }}>

          <Typography
            variant="h5" // closest to Tailwind's text-4xl
            sx={{
              fontWeight: "bold",
              color: "#1c1917",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: 1,
              mt: 1,
            }}
          >
            Kozhencherry Real Estate Admin
          </Typography>
        </Box>
      </DrawerHeader>
      <Box sx={{ px: 2, mt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
            px: 1,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "block",
            mb: 1,
          }}
        >
          Main Menu
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                sx={{
                  minHeight: 50,
                  px: 2,
                  borderRadius: 2,
                  position: "relative",
                  ...(currentPage === item.path
                    ? {
                        background: `linear-gradient(90deg, ${alpha(
                          theme.palette.primary.main,
                          0.12
                        )} 0%, ${alpha(
                          theme.palette.primary.main,
                          0.05
                        )} 100%)`,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 4,
                          height: "60%",
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: "0 4px 4px 0",
                        },
                        "& .MuiListItemIcon-root": {
                          color: theme.palette.primary.main,
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        },
                      }
                    : {
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.04
                          ),
                        },
                      }),
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon sx={{ color: "black" }}>
                  <StyledBadge>{item.icon}</StyledBadge>
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: currentPage === item.path ? 600 : 500,
                      fontSize: "0.95rem",
                    },
                  }}
                />
                {currentPage === item.path && (
                  <ArrowIcon
                    fontSize="small"
                    sx={{
                      ml: 1,
                      opacity: 0.7,
                      color: theme.palette.primary.main,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ mx: 2, opacity: 0.2 }} />
      <Box sx={{ p: 2, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 2,
            p: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              border: `2px solid black`,
              color:"black"
            }}
            alt="#"
            src="/api/placeholder/40/40"
          />
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Admin
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: theme.palette.success.main,
                  borderRadius: "50%",
                  mr: 0.7,
                  boxShadow: `0 0 0 2px ${alpha(
                    theme.palette.success.main,
                    0.2
                  )}`,
                }}
              />
              <Typography variant="caption" color="black">
                Online
              </Typography>
            </Box>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <IconButton
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                },
                width: 28,
                height: 28,
                color: "black",
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DashboardSidebar;
