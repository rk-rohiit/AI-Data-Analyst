import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import StarIcon from "@mui/icons-material/Star";
import TimelineIcon from "@mui/icons-material/Timeline";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const getCategoryMeta = (darkMode) => ({
  overview: { 
    color: darkMode ? "#38bdf8" : "#0284c7", 
    bg: darkMode ? "rgba(2, 132, 199, 0.18)" : "#e0f2fe", 
    icon: <InfoIcon sx={{ fontSize: "0.9rem" }} /> 
  },
  outliers: { 
    color: darkMode ? "#fb7185" : "#e11d48", 
    bg: darkMode ? "rgba(225, 29, 72, 0.18)" : "#ffe4e6", 
    icon: <WarningIcon sx={{ fontSize: "0.9rem" }} /> 
  },
  skewness: { 
    color: darkMode ? "#fb923c" : "#ea580c", 
    bg: darkMode ? "rgba(234, 88, 12, 0.18)" : "#ffedd5", 
    icon: <TimelineIcon sx={{ fontSize: "0.9rem" }} /> 
  },
  correlation: { 
    color: darkMode ? "#34d399" : "#059669", 
    bg: darkMode ? "rgba(5, 150, 105, 0.18)" : "#ecfdf5", 
    icon: <CompareArrowsIcon sx={{ fontSize: "0.9rem" }} /> 
  },
  dominance: { 
    color: darkMode ? "#c084fc" : "#7c3aed", 
    bg: darkMode ? "rgba(124, 58, 237, 0.18)" : "#f3e8ff", 
    icon: <StarIcon sx={{ fontSize: "0.9rem" }} /> 
  },
  default: { 
    color: darkMode ? "#9ca3af" : "#4b5563", 
    bg: darkMode ? "rgba(75, 85, 99, 0.18)" : "#f3f4f6", 
    icon: <LightbulbIcon sx={{ fontSize: "0.9rem" }} /> 
  }
});

const Insights = ({ insights, darkMode }) => {
  if (!insights || insights.length === 0) return null;

  const categoryMeta = getCategoryMeta(darkMode);

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {insights.map((text, index) => {
        const parts = text.split(":");
        let category = "default";
        let description = text;

        if (parts.length > 1) {
          const catName = parts[0].trim().toLowerCase();
          if (categoryMeta[catName]) {
            category = catName;
            description = parts.slice(1).join(":").trim();
          }
        }

        const meta = categoryMeta[category] || categoryMeta.default;

        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              p: 2,
              borderRadius: "12px",
              bgcolor: darkMode ? "#1f2937" : "#f8fafc",
              border: darkMode ? "1px solid #374151" : "1px solid #e2e8f0",
              transition: "transform 0.18s ease, box-shadow 0.18s ease, background-color 0.2s, border-color 0.2s",
              "&:hover": {
                transform: "translateX(4px)",
                boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.25)" : "0 2px 8px rgba(15,23,42,0.05)",
                borderColor: darkMode ? "#4b5563" : "#cbd5e1"
              }
            }}
          >
            {/* Category badge */}
            <Chip
              icon={meta.icon}
              label={category.toUpperCase()}
              sx={{
                fontSize: "0.62rem",
                fontWeight: 800,
                color: meta.color,
                backgroundColor: meta.bg,
                border: `1px solid ${meta.color}25`,
                letterSpacing: "0.08em",
                borderRadius: "8px",
                px: 0.5,
                height: 24,
                width: 130,
                justifyContent: "flex-start",
                "& .MuiChip-icon": { color: meta.color, marginLeft: "4px" }
              }}
            />

            {/* Description */}
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: darkMode ? "#d1d5db" : "#334155",
                fontWeight: 500,
                lineHeight: 1.5,
                "& strong": {
                  color: darkMode ? "#ffffff" : "#0f172a",
                  fontWeight: 700
                }
              }}
            >
              {/* Simple parser to handle single quotes as bold highlight */}
              {description.split(/'([^']+)'/).map((chunk, i) => {
                // Odd elements are matches inside single quotes
                return i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk;
              })}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
};

export default Insights;