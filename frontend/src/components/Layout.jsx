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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: darkMode ? "#0b0f19" : "#f8fafc", transition: "background-color 0.2s" }}>
      
      {/* ── MOBILE OVERLAY ── */}
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            display: { xs: "block", lg: "none" },
            position: "fixed",
            inset: 0,
            bgcolor: darkMode ? "rgba(3, 7, 18, 0.6)" : "rgba(15, 23, 42, 0.4)",
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
            ? "linear-gradient(180deg, #030712 0%, #0b0f19 100%)" 
            : "linear-gradient(180deg, #090d16 0%, #0f172a 100%)",
          borderRight: darkMode ? "1px solid #1f2937" : "1px solid rgba(255, 255, 255, 0.05)",
          transform: {
            xs: open ? "translateX(0)" : `translateX(-${drawerWidth}px)`,
            lg: "translateX(0)"
          },
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1200,
          color: "#fff",
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
            borderBottom: darkMode ? "1px solid #1f2937" : "1px solid rgba(255, 255, 255, 0.06)",
            bgcolor: "rgba(0, 0, 0, 0.15)"
          }}
        >
          <AutoAwesomeIcon sx={{ color: "#818cf8", fontSize: "1.4rem" }} />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.02em",
              color: "#fff"
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
                  color: isSelected ? "#fff" : "rgba(255,255,255,0.6)",
                  bgcolor: isSelected ? "rgba(79, 70, 229, 0.15)" : "transparent",
                  borderLeft: isSelected ? "3px solid #818cf8" : "3px solid transparent",
                  transition: "0.2s",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                    color: "#fff",
                    "& .MuiListItemIcon-root": { color: "#818cf8" }
                  },
                  "&.Mui-selected": {
                    bgcolor: "rgba(79, 70, 229, 0.2)",
                    color: "#fff"
                  },
                  "&.Mui-disabled": {
                    opacity: 0.38,
                    color: "rgba(255,255,255,0.4)"
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isSelected ? "#818cf8" : "rgba(255,255,255,0.4)",
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
                  <LockIcon sx={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.3)" }} />
                )}
              </ListItemButton>
            );
          })}
        </List>

        {/* Sidebar Footer Info */}
        <Box p={3} sx={{ borderTop: darkMode ? "1px solid #1f2937" : "1px solid rgba(255,255,255,0.06)", bgcolor: "rgba(0, 0, 0, 0.08)" }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace", fontSize: "0.65rem", display: "block" }}>
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
            bgcolor: darkMode ? "rgba(17, 24, 39, 0.85)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            webkitBackdropFilter: "blur(12px)",
            borderBottom: darkMode ? "1px solid #1f2937" : "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            px: 3,
            color: darkMode ? "#f9fafb" : "#0f172a",
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
              color: darkMode ? "#f9fafb" : "#0f172a",
              mr: 1.5,
              border: darkMode ? "1px solid #374151" : "1px solid #cbd5e1",
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
              color: darkMode ? "#f9fafb" : "#0f172a",
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
              color: darkMode ? "#fbbf24" : "#64748b",
              border: darkMode ? "1px solid #374151" : "1px solid #cbd5e1",
              borderRadius: "10px",
              p: 0.8,
              bgcolor: darkMode ? "rgba(251, 191, 36, 0.04)" : "transparent",
              transition: "color 0.2s, border-color 0.2s",
              "&:hover": {
                bgcolor: darkMode ? "rgba(251, 191, 36, 0.12)" : "#f1f5f9"
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