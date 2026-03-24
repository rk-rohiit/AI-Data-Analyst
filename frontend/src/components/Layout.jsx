import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";

const drawerWidth = 240;

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "◈" },
  { key: "upload", label: "Upload Data", icon: "⊕" },
];

const Layout = ({ children, activePage, onPageChange, hasData }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* Overlay */}
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.3)",
            zIndex: 1100,
          }}
        />
      )}

      {/* Sidebar */}
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: drawerWidth,
          bgcolor: "#0f172a",
          transform: open ? "translateX(0)" : `translateX(-${drawerWidth}px)`,
          transition: "0.3s",
          zIndex: 1200,
          color: "#fff",
        }}
      >
        <Box p={2}>
          <Typography fontWeight={700}>AI Analyst</Typography>
        </Box>

        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.key}
              selected={activePage === item.key}
              onClick={() => {
                if (item.key === "dashboard" && !hasData) return;
                onPageChange(item.key);
                setOpen(false);
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Main */}
      <Box flex={1}>
        {/* Topbar */}
        <Box
          sx={{
            height: 56,
            bgcolor: "#0f172a",
            display: "flex",
            alignItems: "center",
            px: 2,
            color: "#fff",
          }}
        >
          <IconButton onClick={() => setOpen(!open)}>
            ☰
          </IconButton>

          <Typography ml={2}>
            {navItems.find((n) => n.key === activePage)?.label}
          </Typography>
        </Box>

        {/* Content */}
        <Box p={3} bgcolor="#f8fafc">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;