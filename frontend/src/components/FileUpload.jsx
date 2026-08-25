import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MemoryIcon from "@mui/icons-material/Memory";
import { uploadFile } from "../services/api";

const loadingTexts = [
  "Uploading dataset to server...",
  "Sniffing CSV structure and delimiter...",
  "Parsing columns & cleaning whitespace...",
  "Computing statistics (Mean, Std Dev, Min, Max)...",
  "Downsampling scatter plot coordinates...",
  "Calculating Pearson correlation matrix...",
  "Evaluating distribution ranges...",
  "Executing statistical AI insights engine...",
  "Compiling dashboard visualization payloads..."
];

const FileUpload = ({ setData, darkMode }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await uploadFile(formData);
      const analysisData = res.data.data ? res.data.data.analysis : res.data.analysis;
      setData(analysisData);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "24px",
        background: darkMode 
          ? "linear-gradient(135deg, #171717 0%, #0d0d0d 100%)" 
          : "linear-gradient(135deg, #EAEAEA 0%, #d8d8d8 100%)",
        px: 3,
        py: 6,
        transition: "background-color 0.2s"
      }}
    >
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-40px) rotate(180deg) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0px, 0px) scale(1.05); }
          50% { transform: translate(50px, -30px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0px, 0px) scale(0.95); }
          50% { transform: translate(-40px, 45px) scale(1.05); }
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: ${darkMode ? "0 0 15px rgba(218, 0, 55, 0.15)" : "0 0 15px rgba(255, 46, 99, 0.15)"}; }
          50% { box-shadow: ${darkMode ? "0 0 35px rgba(218, 0, 55, 0.45)" : "0 0 35px rgba(255, 46, 99, 0.3)"}; }
        }
      `}</style>

      {/* ── BACKGROUND ANIMATIONS ── */}
      {/* Network grid background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: darkMode
            ? `linear-gradient(rgba(218, 0, 55, 0.08) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(218, 0, 55, 0.08) 1px, transparent 1px)`
            : `linear-gradient(rgba(8, 217, 214, 0.18) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(8, 217, 214, 0.18) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          animation: "gridMove 12s linear infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Drifting glow spheres */}
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: darkMode
            ? "radial-gradient(circle, rgba(218, 0, 55, 0.18) 0%, rgba(218, 0, 55, 0) 70%)"
            : "radial-gradient(circle, rgba(8, 217, 214, 0.28) 0%, rgba(8, 217, 214, 0) 70%)",
          animation: "float2 14s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: darkMode
            ? "radial-gradient(circle, rgba(218, 0, 55, 0.14) 0%, rgba(218, 0, 55, 0) 70%)"
            : "radial-gradient(circle, rgba(255, 46, 99, 0.22) 0%, rgba(255, 46, 99, 0) 70%)",
          animation: "float3 18s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          right: "15%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: darkMode
            ? "radial-gradient(circle, rgba(218, 0, 55, 0.12) 0%, rgba(218, 0, 55, 0) 70%)"
            : "radial-gradient(circle, rgba(8, 217, 214, 0.24) 0%, rgba(8, 217, 214, 0) 70%)",
          animation: "float1 16s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Floating AI/ML Math Decors */}
      <Box sx={{ position: "absolute", top: "15%", left: "15%", opacity: darkMode ? 0.16 : 0.12, zIndex: 1, fontFamily: "monospace", fontSize: "1.2rem", fontWeight: 700, color: darkMode ? "#DA0037" : "#FF2E63", userSelect: "none" }}>y = wx + b</Box>
      <Box sx={{ position: "absolute", bottom: "25%", left: "20%", opacity: darkMode ? 0.12 : 0.08, zIndex: 1, fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 800, color: darkMode ? "#EDEDED" : "#252A34", userSelect: "none" }}>f(x) = σ(z)</Box>
      <Box sx={{ position: "absolute", top: "25%", right: "25%", opacity: darkMode ? 0.14 : 0.1, zIndex: 1, fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700, color: darkMode ? "#DA0037" : "#08D9D6", userSelect: "none" }}>[0, 1, 0, 1]</Box>
      <Box sx={{ position: "absolute", bottom: "15%", right: "20%", opacity: darkMode ? 0.15 : 0.12, zIndex: 1, fontFamily: "monospace", fontSize: "1.3rem", fontWeight: 700, color: darkMode ? "#EDEDED" : "#FF2E63", userSelect: "none" }}>R² = 0.985</Box>

      {/* ── GLASSMORPHIC UPLOAD CARD ── */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          p: { xs: 4, sm: 6 },
          width: "100%",
          maxWidth: 520,
          textAlign: "center",
          background: darkMode ? "rgba(23, 23, 23, 0.85)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          webkitBackdropFilter: "blur(20px)",
          border: darkMode ? "1px solid #444444" : "1px solid #08D9D6",
          borderRadius: "24px",
          boxShadow: darkMode ? "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(218, 0, 55, 0.08)" : "0 25px 60px rgba(37, 42, 52, 0.08), 0 0 30px rgba(8, 217, 214, 0.06)",
          zIndex: 10,
          overflow: "hidden",
          animation: loading ? "pulseGlow 3s ease-in-out infinite" : "none",
          transition: "background-color 0.2s, border-color 0.2s, box-shadow 0.2s"
        }}
      >
        {/* Scanning laser beam overlay on loading */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              width: "100%",
              height: "4px",
              background: darkMode 
                ? "linear-gradient(to right, transparent, #DA0037, #EDEDED, #DA0037, transparent)"
                : "linear-gradient(to right, transparent, #FF2E63, #08D9D6, #FF2E63, transparent)",
              animation: "scan 3s linear infinite",
              boxShadow: darkMode ? "0 0 12px #DA0037" : "0 0 12px #FF2E63",
              zIndex: 15,
            }}
          />
        )}

        {/* LOADING SCREEN */}
        {loading ? (
          <Box py={4}>
            <CircularProgress
              size={56}
              thickness={4}
              sx={{
                mb: 3,
                color: darkMode ? "#DA0037" : "#FF2E63",
                "& .MuiCircularProgress-circle": { strokeLinecap: "round" }
              }}
            />
            
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: darkMode ? "#EDEDED" : "#252A34",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "-0.01em",
                mb: 1
              }}
            >
              Analyzing Dataset
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: darkMode ? "#DA0037" : "#FF2E63",
                fontWeight: 600,
                fontSize: "0.78rem"
              }}
            >
              {loadingTexts[loadingStep]}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Header Icon */}
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 60,
                height: 60,
                borderRadius: "16px",
                background: darkMode ? "linear-gradient(135deg, #2a2a2a 0%, #171717 100%)" : "linear-gradient(135deg, #ffffff 0%, #EAEAEA 100%)",
                mb: 3,
                border: darkMode ? "1px solid #444444" : "1px solid #08D9D6"
              }}
            >
              <MemoryIcon sx={{ color: darkMode ? "#DA0037" : "#FF2E63", fontSize: "1.8rem" }} />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                color: darkMode ? "#EDEDED" : "#252A34",
                letterSpacing: "-0.02em",
                mb: 1
              }}
            >
              AI Data Analyst
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: darkMode ? "rgba(237, 237, 237, 0.7)" : "rgba(37, 42, 52, 0.75)",
                fontWeight: 500,
                lineHeight: 1.6,
                mb: 4
              }}
            >
              Upload your dataset file (CSV/TSV) to automatically clean columns, compute statistics, evaluate relationships, and generate AI data insights.
            </Typography>

            {/* Hidden Input */}
            <input
              type="file"
              accept=".csv,.tsv,.txt"
              id="file-upload"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />

            {/* Upload Area */}
            <label htmlFor="file-upload">
              <Box
                sx={{
                  cursor: "pointer",
                  p: 4,
                  borderRadius: "16px",
                  bgcolor: darkMode ? "rgba(23, 23, 23, 0.5)" : "rgba(255, 255, 255, 0.5)",
                  border: darkMode ? "2px dashed #444444" : "2px dashed #08D9D6",
                  transition: "background 0.2s, border-color 0.2s, transform 0.15s",
                  "&:hover": {
                    bgcolor: darkMode ? "rgba(68, 68, 68, 0.4)" : "rgba(8, 217, 214, 0.06)",
                    borderColor: darkMode ? "#DA0037" : "#FF2E63",
                    transform: "scale(1.01)"
                  },
                }}
              >
                <CloudUploadIcon sx={{ color: darkMode ? "#DA0037" : "#FF2E63", fontSize: 44, mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: darkMode ? "#EDEDED" : "#252A34"
                  }}
                >
                  Click to choose file
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.72rem",
                    color: darkMode ? "rgba(237, 237, 237, 0.6)" : "rgba(37, 42, 52, 0.6)",
                    mt: 0.5
                  }}
                >
                  Accepts CSV, TSV (Tab separated), or Text files
                </Typography>
              </Box>
            </label>

            {/* Selected File Card */}
            {file && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                mt={3}
                justifyContent="center"
                sx={{
                  py: 1.5,
                  px: 2,
                  bgcolor: darkMode ? "rgba(218, 0, 55, 0.08)" : "rgba(255, 46, 99, 0.06)",
                  borderRadius: "12px",
                  border: darkMode ? "1px solid rgba(218, 0, 55, 0.25)" : "1px solid rgba(255, 46, 99, 0.25)",
                  maxWidth: "100%",
                  overflow: "hidden"
                }}
              >
                <InsertDriveFileIcon sx={{ color: darkMode ? "#DA0037" : "#FF2E63", fontSize: "1.1rem" }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: darkMode ? "#EDEDED" : "#252A34",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap"
                  }}
                >
                  {file.name}
                </Typography>
              </Stack>
            )}

            {/* Action Trigger Button */}
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              fullWidth
              onClick={handleUpload}
              disabled={loading || !file}
              sx={{
                mt: 4,
                py: 1.4,
                borderRadius: "14px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.88rem",
                boxShadow: darkMode ? "0 8px 24px rgba(218, 0, 55, 0.3)" : "0 8px 24px rgba(255, 46, 99, 0.2)",
                background: darkMode ? "linear-gradient(135deg, #DA0037 0%, #aa0029 100%)" : "linear-gradient(135deg, #FF2E63 0%, #d61145 100%)",
                "&:hover": {
                  background: darkMode ? "linear-gradient(135deg, #b8002d 0%, #850020 100%)" : "linear-gradient(135deg, #d61145 0%, #a3002d 100%)",
                  boxShadow: darkMode ? "0 10px 28px rgba(218, 0, 55, 0.4)" : "0 10px 28px rgba(255, 46, 99, 0.3)"
                },
                "&.Mui-disabled": {
                  bgcolor: darkMode ? "#2a2a2a" : "#e0e0e0",
                  color: darkMode ? "#555555" : "#a0a0a0",
                  boxShadow: "none"
                }
              }}
            >
              Analyze Dataset
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default FileUpload;