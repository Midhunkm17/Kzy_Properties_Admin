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
  Badge,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  KeyboardArrowRight as ArrowIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  House,
  AddHomeWork,
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

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Properties", icon: <House />, path: "/properties" },
    { text: "Add Property", icon: <AddHomeWork />, path: "/add-property" },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 72,
        flexShrink: 0,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 72,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          backgroundImage:
            "linear-gradient(112.5deg, rgb(214, 214, 214) 0%, rgb(214, 214, 214) 10%,rgb(195, 195, 195) 10%, rgb(195, 195, 195) 53%,rgb(176, 176, 176) 53%, rgb(176, 176, 176) 55%,rgb(157, 157, 157) 55%, rgb(157, 157, 157) 60%,rgb(137, 137, 137) 60%, rgb(137, 137, 137) 88%,rgb(118, 118, 118) 88%, rgb(118, 118, 118) 91%,rgb(99, 99, 99) 91%, rgb(99, 99, 99) 100%),linear-gradient(157.5deg, rgb(214, 214, 214) 0%, rgb(214, 214, 214) 10%,rgb(195, 195, 195) 10%, rgb(195, 195, 195) 53%,rgb(176, 176, 176) 53%, rgb(176, 176, 176) 55%,rgb(157, 157, 157) 55%, rgb(157, 157, 157) 60%,rgb(137, 137, 137) 60%, rgb(137, 137, 137) 88%,rgb(118, 118, 118) 88%, rgb(118, 118, 118) 91%,rgb(99, 99, 99) 91%, rgb(99, 99, 99) 100%),linear-gradient(135deg, rgb(214, 214, 214) 0%, rgb(214, 214, 214) 10%,rgb(195, 195, 195) 10%, rgb(195, 195, 195) 53%,rgb(176, 176, 176) 53%, rgb(176, 176, 176) 55%,rgb(157, 157, 157) 55%, rgb(157, 157, 157) 60%,rgb(137, 137, 137) 60%, rgb(137, 137, 137) 88%,rgb(118, 118, 118) 88%, rgb(118, 118, 118) 91%,rgb(99, 99, 99) 91%, rgb(99, 99, 99) 100%),linear-gradient(90deg, rgb(195, 195, 195),rgb(228, 228, 228)); background-blend-mode:overlay,overlay,overlay,normal;",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
          borderRight: "none",
          color: "black",
        },
      }}
    >
      <DrawerHeader>
        {open && (
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#1c1917", ml: 1 }}
          >
            Kozhencherry Real Estate Admin
          </Typography>
        )}
        <IconButton onClick={handleDrawerToggle} sx={{ ml: "auto" }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>

      <Box sx={{ px: open ? 2 : 0.5, mt: 1 }}>
        {open && (
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
        )}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                sx={{
                  minHeight: 50,
                  px: open ? 2 : 1,
                  borderRadius: 2,
                  position: "relative",
                  justifyContent: open ? "initial" : "center",
                  ...(currentPage === item.path && {
                    background: `linear-gradient(90deg, ${alpha(
                      theme.palette.primary.main,
                      0.12
                    )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
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
                  }),
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 1 : "auto",
                    justifyContent: "center",
                    color: currentPage === item.path
                      ? theme.palette.primary.main
                      : "black",
                  }}
                >
                  <StyledBadge>{item.icon}</StyledBadge>
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: currentPage === item.path ? 600 : 500,
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                )}
                {open && currentPage === item.path && (
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
    </Drawer>
  );
};

export default DashboardSidebar;
