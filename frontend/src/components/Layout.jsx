import React, { useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  ListItemIcon
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LockIcon from "@mui/icons-material/Lock";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const drawerWidth = 260;

const Layout = ({ children, activePage, onPageChange, hasData, darkMode, onToggleDarkMode }) => {
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      key: "upload",
      label: "Upload Dataset",
      icon: <CloudUploadIcon sx={{ fontSize: "1.2rem" }} />
    },
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon sx={{ fontSize: "1.2rem" }} />,
      locked: !hasData
    }
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: darkMode ? "#171717" : "#EAEAEA", transition: "background-color 0.2s" }}>
      
      {/* ── MOBILE OVERLAY ── */}
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            display: { xs: "block", lg: "none" },
            position: "fixed",
            inset: 0,
            bgcolor: darkMode ? "rgba(23, 23, 23, 0.6)" : "rgba(37, 42, 52, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 1100,
          }}
        />
      )}

      {/* ── SIDEBAR DRAWER ── */}
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: drawerWidth,
          background: darkMode 
            ? "linear-gradient(180deg, #171717 0%, #0d0d0d 100%)" 
            : "linear-gradient(180deg, #ffffff 0%, #EAEAEA 100%)",
          borderRight: darkMode ? "1px solid #444444" : "1px solid rgba(8, 217, 214, 0.3)",
          transform: {
            xs: open ? "translateX(0)" : `translateX(-${drawerWidth}px)`,
            lg: "translateX(0)"
          },
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s, border-right-color 0.2s, color 0.2s",
          zIndex: 1200,
          color: darkMode ? "#EDEDED" : "#252A34",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Brand Header */}
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          p={3}
          sx={{
            borderBottom: darkMode ? "1px solid #444444" : "1px solid rgba(8, 217, 214, 0.3)",
            bgcolor: darkMode ? "rgba(0, 0, 0, 0.25)" : "rgba(8, 217, 214, 0.05)",
            transition: "border-bottom-color 0.2s, background-color 0.2s"
          }}
        >
          <AutoAwesomeIcon sx={{ color: darkMode ? "#DA0037" : "#FF2E63", fontSize: "1.4rem" }} />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.02em",
              color: darkMode ? "#EDEDED" : "#252A34"
            }}
          >
            AI Data Analyst
          </Typography>
        </Box>

        {/* Navigation List */}
        <List sx={{ px: 2, py: 3, flex: 1 }}>
          {navItems.map((item) => {
            const isSelected = activePage === item.key;
            const isLocked = item.locked;

            return (
              <ListItemButton
                key={item.key}
                disabled={isLocked}
                onClick={() => {
                  onPageChange(item.key);
                  setOpen(false);
                }}
                sx={{
                  borderRadius: "10px",
                  mb: 1,
                  py: 1.2,
                  px: 2,
                  color: isSelected 
                    ? (darkMode ? "#DA0037" : "#FF2E63") 
                    : (darkMode ? "rgba(255,255,255,0.6)" : "rgba(37, 42, 52, 0.7)"),
                  bgcolor: isSelected 
                    ? (darkMode ? "rgba(218, 0, 55, 0.12)" : "rgba(255, 46, 99, 0.08)") 
                    : "transparent",
                  borderLeft: isSelected 
                    ? (darkMode ? "3px solid #DA0037" : "3px solid #FF2E63") 
                    : "3px solid transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: darkMode ? "rgba(218, 0, 55, 0.06)" : "rgba(8, 217, 214, 0.08)",
                    color: darkMode ? "#DA0037" : "#FF2E63",
                    "& .MuiListItemIcon-root": { color: darkMode ? "#DA0037" : "#FF2E63" }
                  },
                  "&.Mui-selected": {
                    bgcolor: darkMode ? "rgba(218, 0, 55, 0.18)" : "rgba(255, 46, 99, 0.12)",
                    color: darkMode ? "#DA0037" : "#FF2E63"
                  },
                  "&.Mui-disabled": {
                    opacity: 0.38,
                    color: darkMode ? "rgba(237, 237, 237, 0.4)" : "rgba(37, 42, 52, 0.4)"
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isSelected 
                      ? (darkMode ? "#DA0037" : "#FF2E63") 
                      : (darkMode ? "rgba(237, 237, 237, 0.4)" : "rgba(37, 42, 52, 0.5)"),
                    transition: "color 0.2s"
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: "0.85rem",
                      letterSpacing: "-0.01em"
                    }
                  }}
                />

                {isLocked && (
                  <LockIcon sx={{ fontSize: "0.95rem", color: darkMode ? "rgba(237, 237, 237, 0.3)" : "rgba(37, 42, 52, 0.3)" }} />
                )}
              </ListItemButton>
            );
          })}
        </List>

        {/* Sidebar Footer Info */}
        <Box p={3} sx={{ borderTop: darkMode ? "1px solid #444444" : "1px solid rgba(8, 217, 214, 0.3)", bgcolor: darkMode ? "rgba(0, 0, 0, 0.12)" : "rgba(8, 217, 214, 0.02)", transition: "border-top-color 0.2s, background-color 0.2s" }}>
          <Typography variant="caption" sx={{ color: darkMode ? "rgba(237, 237, 237, 0.4)" : "rgba(37, 42, 52, 0.5)", fontFamily: "monospace", fontSize: "0.65rem", display: "block", transition: "color 0.2s" }}>
            AGENT ENVIRONMENT v2.1
          </Typography>
        </Box>
      </Box>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, lg: `${drawerWidth}px` },
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh"
        }}
      >
        {/* Glassmorphic Topbar Navigation */}
        <Box
          sx={{
            height: 64,
            bgcolor: darkMode ? "rgba(23, 23, 23, 0.85)" : "rgba(234, 234, 234, 0.85)",
            backdropFilter: "blur(12px)",
            webkitBackdropFilter: "blur(12px)",
            borderBottom: darkMode ? "1px solid #444444" : "1px solid rgba(8, 217, 214, 0.3)",
            display: "flex",
            alignItems: "center",
            px: 3,
            color: darkMode ? "#EDEDED" : "#252A34",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            transition: "background-color 0.2s, border-bottom 0.2s"
          }}
        >
          {/* Menu Hamburger Trigger */}
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              display: { xs: "flex", lg: "none" },
              color: darkMode ? "#EDEDED" : "#252A34",
              mr: 1.5,
              border: darkMode ? "1px solid #444444" : "1px solid rgba(8, 217, 214, 0.5)",
              borderRadius: "10px",
              p: 0.8
            }}
          >
            <MenuIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>

          <Typography
            sx={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: darkMode ? "#EDEDED" : "#252A34",
              letterSpacing: "-0.02em"
            }}
          >
            {navItems.find((n) => n.key === activePage)?.label}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Theme Mode Toggle Button */}
          <IconButton
            onClick={onToggleDarkMode}
            sx={{
              color: darkMode ? "#DA0037" : "#FF2E63",
              border: darkMode ? "1px solid #444444" : "1px solid rgba(8, 217, 214, 0.5)",
              borderRadius: "10px",
              p: 0.8,
              bgcolor: darkMode ? "rgba(218, 0, 55, 0.04)" : "transparent",
              transition: "color 0.2s, border-color 0.2s",
              "&:hover": {
                bgcolor: darkMode ? "rgba(218, 0, 55, 0.12)" : "rgba(255, 46, 99, 0.08)"
              }
            }}
          >
            {darkMode ? <LightModeIcon sx={{ fontSize: "1.2rem" }} /> : <DarkModeIcon sx={{ fontSize: "1.2rem" }} />}
          </IconButton>
        </Box>

        {/* Content Body */}
        <Box sx={{ p: 4, flex: 1, overflowY: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;