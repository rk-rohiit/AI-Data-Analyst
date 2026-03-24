import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#4f46e5", // Indigo (modern SaaS color)
    },

    secondary: {
      main: "#06b6d4", // Cyan accent
    },

    background: {
      default: "#f8fafc", // soft light background
      paper: "#ffffff",
    },

    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },

    divider: "#e2e8f0",
  },

  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    body2: {
      color: "#64748b",
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
          borderRadius: 16,
          padding: "8px",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
          padding: "10px 20px",
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: "0.3px",
        },
      },
    },
  },
});

export default theme;