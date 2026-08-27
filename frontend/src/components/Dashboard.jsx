import { Grid, Typography, Box, TextField, InputAdornment, Button, Tabs, Tab, Card, CardContent, Alert, AlertTitle, List, ListItem, ListItemIcon, ListItemText, Divider, CircularProgress, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import TableChartIcon from "@mui/icons-material/TableChart";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import BarChartIcon from "@mui/icons-material/BarChart";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Charts from "../components/Charts";
import Insights from "../components/Insights";
import { useState, useEffect } from "react";

/* ─── design tokens ─────────────────────────────── */
const getTokens = (darkMode) => ({
  bg: darkMode ? "#171717" : "#EAEAEA",
  surface: darkMode ? "#222222" : "#ffffff",
  surfaceHover: darkMode ? "#2e2e2e" : "rgba(8, 217, 214, 0.04)",
  border: darkMode ? "#444444" : "#cbd5e1",
  borderStrong: darkMode ? "#555555" : "#08D9D6",
  accent: darkMode ? "#DA0037" : "#FF2E63",
  accentSoft: darkMode ? "rgba(218, 0, 55, 0.15)" : "rgba(255, 46, 99, 0.08)",
  accentMid: darkMode ? "#DA0037" : "#FF2E63",
  warm: "#f59e0b",
  warmSoft: darkMode ? "rgba(245, 158, 11, 0.15)" : "#fffbeb",
  green: "#10b981",
  greenSoft: darkMode ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
  sky: "#0ea5e9",
  skySoft: darkMode ? "rgba(14, 165, 233, 0.15)" : "#e0f2fe",
  rose: "#f43f5e",
  text: darkMode ? "#EDEDED" : "#252A34",
  sub: darkMode ? "#dfdfdf" : "#444444",
  muted: darkMode ? "#999999" : "#666666",
  faint: darkMode ? "#2a2a2a" : "#f1f1f1",
});

const font = "'Plus Jakarta Sans', sans-serif";
const mono = "'IBM Plex Mono', monospace";

const formatValue = (val) => {
  if (val === "" || val === undefined || val === null) return "—";
  if (typeof val === "number") {
    return val % 1 === 0 ? val.toLocaleString() : val.toFixed(2);
  }
  const num = Number(val);
  if (!isNaN(num) && val !== "") {
    return num % 1 === 0 ? num.toLocaleString() : num.toFixed(2);
  }
  return String(val);
};

/* ─── Dashboard ──────────────────────────────────────────── */
const Dashboard = ({ data, darkMode, onToggleDarkMode }) => {
  const T = getTokens(darkMode);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [scaling, setScaling] = useState("standard");
  const [testSize, setTestSize] = useState(0.2);
  const [preprocessingResult, setPreprocessingResult] = useState(null);
  const [isPreprocessing, setIsPreprocessing] = useState(false);

  useEffect(() => {
    if (data && data.column_names) {
      const mlTargetInfo = data.ml_target || { recommended_target: "" };
      const recommended = mlTargetInfo.recommended_target;
      const target = selectedTarget || recommended || "";
      
      const features = data.column_names.filter(col => {
        if (col === target) return false;
        const colLower = col.toLowerCase();
        return !['id', 'uuid', 'key'].some(k => colLower.endsWith(k) || colLower === k);
      });
      
      setSelectedFeatures(features);
    }
  }, [data, selectedTarget]);

  /* ─── sub-components ─────────────────────────────────────── */
  const SectionLabel = ({ icon, children }) => (
    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
      {icon && (
        <Box sx={{ width: 28, height: 28, borderRadius: "8px", bgcolor: T.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>
          {icon}
        </Box>
      )}
      <Typography sx={{ fontFamily: font, fontSize: "0.95rem", fontWeight: 700, color: T.text, letterSpacing: "-0.01em" }}>
        {children}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${T.border}, transparent)` }} />
    </Box>
  );

  const StatCard = ({ title, value, color, softColor, icon }) => (
    <Box
      sx={{
        bgcolor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "16px",
        p: "20px 22px",
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: `0 8px 24px ${color}22`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: softColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.12em", color: T.muted, textTransform: "uppercase", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontFamily: font, fontWeight: 800, fontSize: "2rem", color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  const Pill = ({ label, value }) => (
    <Box sx={{ px: 1.5, py: 1, bgcolor: T.faint, border: `1px solid ${T.border}`, borderRadius: "8px", textAlign: "center" }}>
      <Typography sx={{ fontFamily: mono, fontSize: "0.5rem", color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: mono, fontSize: "0.78rem", fontWeight: 600, color: T.sub, mt: 0.25 }}>
        {value ?? "—"}
      </Typography>
    </Box>
  );

  const ColumnCard = ({ col, stats }) => {
    const [expanded, setExpanded] = useState(false);
    const isNumeric = stats.mean !== "";
    const accent = isNumeric ? T.accent : T.warm;
    const softBg = isNumeric ? T.accentSoft : T.warmSoft;
    return (
      <Box
        sx={{
          bgcolor: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "14px",
          p: 2.5,
          height: "100%",
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 8px 24px ${accent}18`,
            borderColor: `${accent}60`,
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography sx={{ fontFamily: mono, fontSize: "0.76rem", fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "72%" }}>
            {col}
          </Typography>
          <Box sx={{ px: 1, py: 0.3, borderRadius: "6px", bgcolor: softBg, border: `1px solid ${accent}30`, fontFamily: mono, fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.06em", color: accent }}>
            {isNumeric ? "NUM" : "CAT"}
          </Box>
        </Box>

        <Box sx={{ height: "1px", bgcolor: T.border, mb: 2 }} />

        {isNumeric ? (
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
            <Pill label="Mean" value={formatValue(stats.mean)} />
            <Pill label="Std Dev" value={formatValue(stats.std)} />
            <Pill label="Min" value={formatValue(stats.min)} />
            <Pill label="Max" value={formatValue(stats.max)} />
            {stats.missing !== undefined && (
              <Box sx={{ gridColumn: "span 2" }}>
                <Pill label="Missing Values" value={`${formatValue(stats.missing)} (${stats.missing_pct}%)`} />
              </Box>
            )}
          </Box>
        ) : (
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={1}>
            <Pill label="Unique" value={formatValue(stats.unique)} />
            <Pill label="Top Mode" value={formatValue(stats.top)} />
            <Pill label="Freq" value={formatValue(stats.freq)} />
            {stats.missing !== undefined && (
              <Box sx={{ gridColumn: "span 3" }}>
                <Pill label="Missing Values" value={`${formatValue(stats.missing)} (${stats.missing_pct}%)`} />
              </Box>
            )}
          </Box>
        )}

        {/* Collapsible Expanded Panel */}
        {expanded && (
          <Box mt={2} sx={{ animation: "fadeUp 0.2s ease both" }}>
            <Divider sx={{ borderColor: T.border, my: 1.5 }} />
            
            {isNumeric ? (
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                <Pill label="Median" value={formatValue(stats.median)} />
                <Pill label="Mode" value={formatValue(stats.mode)} />
                <Pill label="Variance" value={formatValue(stats.var)} />
                <Pill label="IQR" value={formatValue(stats.iqr)} />
                <Pill label="Skewness" value={formatValue(stats.skew)} />
                <Pill label="Kurtosis" value={formatValue(stats.kurt)} />
                <Box sx={{ gridColumn: "span 2", mt: 1 }}>
                  <Typography sx={{ fontFamily: mono, fontSize: "0.55rem", color: T.muted, textTransform: "uppercase", mb: 0.5, letterSpacing: "0.08em" }}>
                    Quartiles Summary
                  </Typography>
                  <Box display="flex" justifyContent="space-between" bgcolor={T.faint} p={1} borderRadius="8px" border={`1px solid ${T.border}`}>
                    <Typography sx={{ fontFamily: mono, fontSize: "0.72rem", color: T.sub }}>Q1: <strong>{formatValue(stats.q1)}</strong></Typography>
                    <Typography sx={{ fontFamily: mono, fontSize: "0.72rem", color: T.sub }}>Q2: <strong>{formatValue(stats.q2)}</strong></Typography>
                    <Typography sx={{ fontFamily: mono, fontSize: "0.72rem", color: T.sub }}>Q3: <strong>{formatValue(stats.q3)}</strong></Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography sx={{ fontFamily: font, fontSize: "0.62rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>
                  Top Category Distribution
                </Typography>
                {Object.entries(stats.percentage_distribution || {}).map(([category, percentage]) => (
                  <Box key={category}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.25}>
                      <Typography sx={{ fontFamily: font, fontSize: "0.7rem", color: T.sub, maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {category}
                      </Typography>
                      <Typography sx={{ fontFamily: mono, fontSize: "0.7rem", fontWeight: 700, color: T.text }}>
                        {percentage}%
                      </Typography>
                    </Box>
                    <Box sx={{ width: "100%", height: 4, bgcolor: T.faint, borderRadius: 2, overflow: "hidden" }}>
                      <Box sx={{ width: `${percentage}%`, height: "100%", bgcolor: T.warm, borderRadius: 2 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        <Box display="flex" justifyContent="center" mt={expanded ? 2 : 1}>
          <Typography sx={{ fontFamily: font, fontSize: "0.62rem", fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {expanded ? "Show Less ▲" : "Show More Stats ▼"}
          </Typography>
        </Box>
      </Box>
    );
  };

  const SubScoreRow = ({ label, score }) => {
    let iconColor = T.green;
    let icon = "✓";
    if (score < 60) {
      iconColor = T.rose;
      icon = "✗";
    } else if (score < 85) {
      iconColor = T.warm;
      icon = "⚠";
    }
    return (
      <Box display="flex" alignItems="center" justifyContent="space-between" py={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography sx={{ color: iconColor, fontWeight: 800, fontFamily: mono, fontSize: "0.95rem" }}>
            {icon}
          </Typography>
          <Typography sx={{ fontFamily: font, fontSize: "0.78rem", fontWeight: 600, color: T.sub }}>
            {label}
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: mono, fontSize: "0.78rem", fontWeight: 700, color: T.text }}>
          {score}%
        </Typography>
      </Box>
    );
  };

  const [search, setSearch] = useState("");
  const [colSearch, setColSearch] = useState("");
  const [showAllCols, setShowAllCols] = useState(false);

  const renderMLWorkspace = () => {
    const mlTargetInfo = data.ml_target || { possible_targets: [], recommended_target: "" };
    const recommended = mlTargetInfo.recommended_target;
    const currentTarget = selectedTarget || recommended || "";
    const activeCandidate = mlTargetInfo.possible_targets.find(t => t.column === currentTarget);
    const problemType = activeCandidate ? activeCandidate.problem_type : "classification";
    
    return (
      <Box display="flex" flexDirection="column" gap={4} sx={{ animation: "fadeUp 0.3s ease both" }}>
        <Box>
          <SectionLabel icon="🤖">Machine Learning Workspace</SectionLabel>
          <Grid container spacing={3}>
            {/* Target Select Card */}
            <Grid item xs={12} md={7}>
              <Card sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px", p: 3, boxShadow: "0 2px 12px rgba(15,23,42,0.06)", height: "100%" }}>
                <Typography variant="subtitle2" sx={{ fontFamily: font, fontWeight: 800, color: T.text, mb: 1 }}>
                  ML Target Identification
                </Typography>
                <Typography sx={{ fontFamily: font, fontSize: "0.82rem", color: T.muted, mb: 3 }}>
                  Select the column you want your machine learning model to predict. The system automatically inspects datatypes, cardinality, name semantics, and missing ratios to identify suitable candidates.
                </Typography>

                {recommended ? (
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box sx={{ p: 2, bgcolor: T.greenSoft, border: `1px solid ${T.green}40`, borderRadius: "12px", display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ fontSize: "1.5rem", color: T.green }}>✓</Box>
                      <Box>
                        <Typography sx={{ fontFamily: font, fontSize: "0.78rem", fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Recommended Target
                        </Typography>
                        <Typography sx={{ fontFamily: mono, fontSize: "0.95rem", fontWeight: 700, color: T.text, mt: 0.5 }}>
                          {recommended}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {currentTarget !== recommended && (
                      <Box sx={{ p: 2, bgcolor: T.warmSoft, border: `1px solid ${T.warm}40`, borderRadius: "12px", display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ fontSize: "1.5rem", color: T.warm }}>⚠</Box>
                        <Box>
                          <Typography sx={{ fontFamily: font, fontSize: "0.78rem", fontWeight: 700, color: T.warm, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Manual Override Active
                          </Typography>
                          <Typography sx={{ fontFamily: mono, fontSize: "0.95rem", fontWeight: 700, color: T.text, mt: 0.5 }}>
                            Selected Target: {currentTarget}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Alert severity="warning" sx={{ borderRadius: "12px", mb: 3 }}>
                    No clear target variable detected automatically. Please select one manually below.
                  </Alert>
                )}

                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ fontFamily: font, fontSize: "0.75rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.05em", mb: 1 }}>
                    Manually Override Target Variable
                  </Typography>
                  <FormControl size="small" fullWidth sx={{ maxWidth: 350 }}>
                    <Select
                      value={currentTarget}
                      onChange={(e) => setSelectedTarget(e.target.value)}
                      sx={{
                        fontFamily: mono,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: T.text,
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: T.border },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: T.accent },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: T.accent }
                      }}
                    >
                      <MenuItem value="" disabled sx={{ fontFamily: font, fontSize: "0.8rem" }}>
                        -- Choose a column --
                      </MenuItem>
                      {data.column_names.map((col) => {
                        const candidate = mlTargetInfo.possible_targets.find(t => t.column === col);
                        const scoreText = candidate ? `(Score: ${candidate.score}%)` : "(Not recommended)";
                        return (
                          <MenuItem key={col} value={col} sx={{ fontFamily: mono, fontSize: "0.8rem" }}>
                            {col} {scoreText}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
                
                {currentTarget && (
                  <Box sx={{ mt: 4, p: 2.5, bgcolor: T.faint, borderRadius: "12px", border: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontFamily: font, fontSize: "0.7rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.05em", mb: 1.5 }}>
                      Detected ML Task Type
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                      <Box sx={{ 
                        px: 1.5, 
                        py: 0.5, 
                        borderRadius: "8px", 
                        bgcolor: problemType === "classification" ? T.greenSoft : T.skySoft, 
                        border: `1px solid ${problemType === "classification" ? T.green : T.sky}30`, 
                        fontFamily: font, 
                        fontSize: "0.76rem", 
                        fontWeight: 800, 
                        color: problemType === "classification" ? T.green : T.sky,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em"
                      }}>
                        {problemType}
                      </Box>
                      <Typography sx={{ fontFamily: font, fontSize: "0.78rem", color: T.sub }}>
                        {problemType === "classification" 
                          ? "Task is to predict discrete classes or categories (e.g. yes/no, labels)." 
                          : "Task is to predict continuous numeric quantities (e.g. scales, prices)."
                        }
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Candidates Summary Card */}
            <Grid item xs={12} md={5}>
              <Card sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px", p: 3, boxShadow: "0 2px 12px rgba(15,23,42,0.06)", height: "100%" }}>
                <Typography variant="subtitle2" sx={{ fontFamily: font, fontWeight: 800, color: T.text, mb: 2 }}>
                  Possible Target Columns ({mlTargetInfo.possible_targets.length})
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={1.5} sx={{ maxHeight: 280, overflowY: "auto", pr: 0.5 }}>
                  {mlTargetInfo.possible_targets.map((cand) => {
                    const isSelected = cand.column === currentTarget;
                    const isRec = cand.column === recommended;
                    return (
                      <Box 
                        key={cand.column}
                        sx={{ 
                          p: 1.5, 
                          borderRadius: "12px", 
                          bgcolor: isSelected ? T.accentSoft : T.faint, 
                          border: `1px solid ${isSelected ? T.accent + "50" : T.border}`,
                          transition: "all 0.15s"
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontFamily: mono, fontSize: "0.82rem", fontWeight: 700, color: isSelected ? T.accent : T.text }}>
                            {cand.column}
                          </Typography>
                          <Box display="flex" gap={1} alignItems="center">
                            {isRec && (
                              <Box sx={{ px: 1, py: 0.25, bgcolor: T.greenSoft, border: `1px solid ${T.green}30`, borderRadius: "6px", fontFamily: font, fontSize: "0.55rem", fontWeight: 800, color: T.green, letterSpacing: "0.04em" }}>
                                REC
                              </Box>
                            )}
                            <Box sx={{ px: 1, py: 0.25, bgcolor: isSelected ? T.accentSoft : T.border, borderRadius: "6px", fontFamily: mono, fontSize: "0.55rem", fontWeight: 800, color: isSelected ? T.accent : T.muted }}>
                              SCORE: {cand.score}%
                            </Box>
                          </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt={1}>
                          <Typography sx={{ fontFamily: font, fontSize: "0.68rem", color: T.muted }}>
                            Type: <strong>{cand.dtype}</strong> &nbsp;·&nbsp; Uniques: <strong>{cand.unique_count}</strong>
                          </Typography>
                          <Typography sx={{ fontFamily: font, fontSize: "0.68rem", color: T.muted }}>
                            Missing: <strong>{cand.missing_count}</strong>
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                  {mlTargetInfo.possible_targets.length === 0 && (
                    <Typography color="text.secondary" sx={{ fontStyle: "italic", fontSize: "0.8rem", textAlign: "center", py: 4 }}>
                      No target candidates met confidence scoring threshold.
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>

            {/* Preprocessing Pipeline Config Card */}
            <Grid item xs={12} md={7}>
              <Card sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px", p: 3, boxShadow: "0 2px 12px rgba(15,23,42,0.06)", height: "100%" }}>
                <Typography variant="subtitle2" sx={{ fontFamily: font, fontWeight: 800, color: T.text, mb: 1 }}>
                  Configure Preprocessing Pipeline
                </Typography>
                <Typography sx={{ fontFamily: font, fontSize: "0.82rem", color: T.muted, mb: 3 }}>
                  Customize the data pipeline. Numeric features will be imputed with mean and scaled. Categorical features will be imputed with mode and one-hot encoded.
                </Typography>

                {/* Feature Selection Checklist */}
                <Typography sx={{ fontFamily: font, fontSize: "0.75rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.05em", mb: 1.5 }}>
                  Select Features to Include
                </Typography>
                <Box sx={{ maxHeight: 180, overflowY: "auto", border: `1px solid ${T.border}`, borderRadius: "12px", p: 2, bgcolor: T.faint, mb: 3 }}>
                  <Grid container spacing={1}>
                    {data.column_names.filter(col => col !== currentTarget).map((col) => {
                      const isChecked = selectedFeatures.includes(col);
                      return (
                        <Grid item xs={6} sm={4} key={col}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFeatures([...selectedFeatures, col]);
                                } else {
                                  setSelectedFeatures(selectedFeatures.filter(f => f !== col));
                                }
                              }}
                              style={{ accentColor: T.accent, cursor: "pointer" }}
                            />
                            <Typography sx={{ fontFamily: mono, fontSize: "0.76rem", color: T.text, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                              {col}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                <Grid container spacing={3} mb={3}>
                  {/* Scaling Selector */}
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontFamily: font, fontSize: "0.75rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.05em", mb: 1 }}>
                      Numeric Feature Scaling
                    </Typography>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={scaling}
                        onChange={(e) => setScaling(e.target.value)}
                        sx={{
                          fontFamily: font,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: T.text,
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: T.border }
                        }}
                      >
                        <MenuItem value="standard" sx={{ fontFamily: font, fontSize: "0.8rem" }}>Standard Scaler (μ=0, σ=1)</MenuItem>
                        <MenuItem value="minmax" sx={{ fontFamily: font, fontSize: "0.8rem" }}>MinMax Scaler (0 to 1)</MenuItem>
                        <MenuItem value="none" sx={{ fontFamily: font, fontSize: "0.8rem" }}>None (No scaling)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Split Ratio Slider */}
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontFamily: font, fontSize: "0.75rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.05em", mb: 1 }}>
                      Train/Test Split: {Math.round((1 - testSize) * 100)}% / {Math.round(testSize * 100)}%
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} sx={{ mt: 1 }}>
                      <input
                        type="range"
                        min="0.1"
                        max="0.4"
                        step="0.05"
                        value={testSize}
                        onChange={(e) => setTestSize(parseFloat(e.target.value))}
                        style={{ flex: 1, accentColor: T.accent, cursor: "pointer" }}
                      />
                      <Typography sx={{ fontFamily: mono, fontSize: "0.8rem", fontWeight: 700, color: T.text }}>
                        {Math.round(testSize * 100)}% test
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Preprocess Trigger Action */}
                <Button
                  variant="contained"
                  onClick={async () => {
                    if (!currentTarget) return;
                    setIsPreprocessing(true);
                    setPreprocessingResult(null);
                    try {
                      // Retrieve target file path
                      const fileToProcess = data.filePath || (report && report.cleaned_filename ? `uploads/${report.cleaned_filename}` : "");
                      const response = await fetch("http://localhost:8080/api/ml/preprocess", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          filePath: fileToProcess,
                          target: currentTarget,
                          features: selectedFeatures,
                          scaling: scaling,
                          testSize: testSize
                        })
                      });
                      const resJson = await response.json();
                      if (resJson.success) {
                        setPreprocessingResult(resJson.data);
                      } else {
                        alert("Error: " + (resJson.message || "Preprocessing failed"));
                      }
                    } catch (e) {
                      alert("Network Error: " + e.message);
                    } finally {
                      setIsPreprocessing(false);
                    }
                  }}
                  disabled={isPreprocessing || selectedFeatures.length === 0 || !currentTarget}
                  sx={{
                    background: `linear-gradient(135deg, ${T.accent} 0%, ${T.accentMid} 100%)`,
                    fontWeight: 700,
                    fontFamily: font,
                    textTransform: "none",
                    borderRadius: "12px",
                    px: 3,
                    py: 1.2,
                    boxShadow: `0 4px 12px ${T.accent}30`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${T.accent} 20%, #a20027 100%)`,
                    }
                  }}
                >
                  {isPreprocessing ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={16} color="inherit" />
                      Building Preprocessing Pipeline...
                    </Box>
                  ) : (
                    "Build Preprocessing Pipeline"
                  )}
                </Button>
              </Card>
            </Grid>

            {/* Preprocessing Summary Outputs */}
            {preprocessingResult ? (
              <Grid item xs={12} md={5}>
                <Card sx={{ bgcolor: T.surface, border: `1px solid ${T.green}40`, borderRadius: "16px", p: 3, boxShadow: "0 2px 12px rgba(15,23,42,0.06)", height: "100%" }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: T.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", color: T.green, fontSize: "0.85rem", fontWeight: 900 }}>
                      ✓
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontFamily: font, fontWeight: 800, color: T.text }}>
                      Pipeline Generated Successfully
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ borderColor: T.border, mb: 2 }} />
                  
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography sx={{ fontFamily: font, fontSize: "0.76rem", color: T.muted }}>Train Shape:</Typography>
                      <Typography sx={{ fontFamily: mono, fontSize: "0.78rem", fontWeight: 700, color: T.text }}>
                        {preprocessingResult.train_shape[0]} rows × {preprocessingResult.train_shape[1]} features
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography sx={{ fontFamily: font, fontSize: "0.76rem", color: T.muted }}>Test Shape:</Typography>
                      <Typography sx={{ fontFamily: mono, fontSize: "0.78rem", fontWeight: 700, color: T.text }}>
                        {preprocessingResult.test_shape[0]} rows × {preprocessingResult.test_shape[1]} features
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography sx={{ fontFamily: font, fontSize: "0.76rem", color: T.muted }}>Task Type:</Typography>
                      <Typography sx={{ fontFamily: font, fontSize: "0.78rem", fontWeight: 700, color: T.text, textTransform: "capitalize" }}>
                        {preprocessingResult.is_classification ? "Classification" : "Regression"}
                      </Typography>
                    </Box>
                    
                    {preprocessingResult.is_classification && preprocessingResult.classes && (
                      <Box>
                        <Typography sx={{ fontFamily: font, fontSize: "0.76rem", color: T.muted, mb: 0.5 }}>Target Classes encoded:</Typography>
                        <Box display="flex" gap={0.5} flexWrap="wrap">
                          {preprocessingResult.classes.map((cls, idx) => (
                            <Box key={cls} sx={{ px: 1, py: 0.25, bgcolor: T.faint, border: `1px solid ${T.border}`, borderRadius: "6px", fontFamily: mono, fontSize: "0.62rem", color: T.sub }}>
                              {idx} : {cls}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    <Box>
                      <Typography sx={{ fontFamily: font, fontSize: "0.76rem", color: T.muted, mb: 0.5 }}>Pipeline Artifacts Stored:</Typography>
                      <Box sx={{ p: 1, bgcolor: T.faint, borderRadius: "8px", border: `1px solid ${T.border}` }}>
                        <Typography sx={{ fontFamily: mono, fontSize: "0.62rem", color: T.muted, wordBreak: "break-all" }}>
                          · preprocessor: <strong>{preprocessingResult.preprocessor_file}</strong><br/>
                          {preprocessingResult.label_encoder_file && (
                            <>· label_encoder: <strong>{preprocessingResult.label_encoder_file}</strong></>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ) : (
              <Grid item xs={12} md={5}>
                <Card sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderStyle: "dashed", borderRadius: "16px", p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", height: "100%", minHeight: 250 }}>
                  <Typography sx={{ fontFamily: font, fontSize: "0.82rem", color: T.muted }}>
                    Configure the preprocessing parameters and click <strong>Build Preprocessing Pipeline</strong> to fit transformations and generate train/test splits.
                  </Typography>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    );
  };

  if (!data) return null;

  const filteredPreview = data.preview?.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const numericCols = Object.entries(data.summary).filter(([, s]) => s.mean !== "").length;
  const catCols = Object.entries(data.summary).length - numericCols;

  // Extract cleaning report & quality score
  const report = data.cleaning_report || {};
  const qScore = data.quality_score || { overall_score: 100, missing_score: 100, duplicate_score: 100, datatype_score: 100, outlier_score: 100, consistency_score: 100, warnings: [] };
  
  const constantCols = report.constant_columns || [];
  const emptyCols = report.empty_columns || [];
  const suspiciousCols = Object.entries(report.suspicious_columns || {});
  const trimmedCols = report.trimmed_columns || [];
  const coercedCols = report.coerced_columns || [];
  const filledSummary = Object.entries(report.filled_missing_summary || {});
  const hasCleaningStats = !!report.rows_before;
  const cleanedDownloadUrl = report.cleaned_filename 
    ? `http://localhost:8080/api/upload/download/${report.cleaned_filename}` 
    : "";

  // Dynamic Gauge colors
  let gaugeColor = T.green;
  let statusText = "Healthy";
  if (qScore.overall_score < 60) {
    gaugeColor = T.rose;
    statusText = "Poor Quality";
  } else if (qScore.overall_score < 85) {
    gaugeColor = T.warm;
    statusText = "Fair Quality";
  }

  return (
    <Box sx={{ bgcolor: T.bg, minHeight: "100vh", fontFamily: font, pb: 10 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${T.faint}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 99px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
      `}</style>

      {/* ── HERO HEADER ── */}
      <Box
        sx={{
          background: darkMode
            ? "linear-gradient(135deg, #171717 0%, #444444 50%, #DA0037 100%)"
            : "linear-gradient(135deg, #252A34 0%, #FF2E63 65%, #08D9D6 100%)",
          px: { xs: 3, md: 6 },
          pt: { xs: 5, md: 6 },
          pb: { xs: 7, md: 8 },
          position: "relative",
          overflow: "hidden",
          animation: "fadeUp 0.5s ease both",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
          },
        }}
      >
        <Box sx={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -80, left: "30%", width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <Box sx={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "rgba(255,255,255,0.15)", borderRadius: "8px", px: 1.5, py: 0.6, mb: 3, backdropFilter: "blur(8px)" }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#4ade80", animation: "shimmer 2s infinite" }} />
              <Typography sx={{ fontFamily: mono, fontSize: "0.6rem", color: "#fff", fontWeight: 600, letterSpacing: "0.14em" }}>
                DATASET LOADED
              </Typography>
            </Box>

            <Typography sx={{ fontFamily: font, fontWeight: 800, fontSize: { xs: "2rem", md: "2.8rem" }, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05, mb: 1.5 }}>
              Dataset Dashboard
            </Typography>
            <Typography sx={{ fontFamily: mono, fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}>
              {hasCleaningStats ? (
                <>
                  {(report.rows_before ?? 0).toLocaleString()} original rows &nbsp;·&nbsp; {(report.rows_after ?? 0).toLocaleString()} cleaned rows &nbsp;·&nbsp; {data.columns} columns
                </>
              ) : (
                <>
                  {(data.rows ?? 0).toLocaleString()} rows &nbsp;·&nbsp; {data.columns} columns &nbsp;·&nbsp; {numericCols} numeric &nbsp;·&nbsp; {catCols} categorical
                </>
              )}
            </Typography>
          </Box>

          {onToggleDarkMode && (
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1.2, 
                bgcolor: "rgba(255,255,255,0.12)", 
                backdropFilter: "blur(8px)", 
                border: "1px solid rgba(255,255,255,0.2)", 
                borderRadius: "12px", 
                p: "8px 16px", 
                cursor: "pointer", 
                userSelect: "none",
                transition: "all 0.2s", 
                "&:hover": { 
                  bgcolor: "rgba(255,255,255,0.2)",
                  transform: "translateY(-1px)"
                },
                "&:active": {
                  transform: "translateY(0)"
                }
              }} 
              onClick={onToggleDarkMode}
            >
              <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: "0.75rem", color: "#fff", letterSpacing: "0.02em" }}>
                {darkMode ? "LIGHT MODE" : "DARK MODE"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", color: "#fff" }}>
                {darkMode ? (
                  <LightModeIcon sx={{ fontSize: "1.1rem", color: "#FF2E63" }} />
                ) : (
                  <DarkModeIcon sx={{ fontSize: "1.1rem", color: "#08D9D6" }} />
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── STAT CARDS (overlap hero) ── */}
      <Box px={{ xs: 2, md: 6 }} mt={-4} mb={4} sx={{ position: "relative", zIndex: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <StatCard title="Cleaned Rows" value={hasCleaningStats ? (report.rows_after ?? 0).toLocaleString() : (data.rows ?? 0).toLocaleString()} color={T.accent} softColor={T.accentSoft} icon="⊞" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard title="Total Columns" value={data.columns} color={T.sky} softColor={T.skySoft} icon="⊟" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard title="Features" value={data.column_names.length} color={T.green} softColor={T.greenSoft} icon="◈" />
          </Grid>
        </Grid>
      </Box>

      {/* ── TABS NAVIGATION ── */}
      <Box sx={{ borderBottom: `1px solid ${T.border}`, bgcolor: T.surface, px: { xs: 2, md: 6 }, mb: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontFamily: font,
              fontWeight: 700,
              fontSize: "0.82rem",
              textTransform: "none",
              minHeight: 52,
              px: 3,
              color: T.muted,
              transition: "color 0.2s",
              "&.Mui-selected": {
                color: T.accent,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: T.accent,
              height: "3px",
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab icon={<TableChartIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Overview & Preview" />
          <Tab icon={<CleaningServicesIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Data Cleaning Engine" />
          <Tab icon={<BarChartIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Visualizations" />
          <Tab icon={<AutoAwesomeIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="AI Insights" />
          <Tab icon={<AutoAwesomeIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Machine Learning" />
        </Tabs>
      </Box>

      {/* ── TABS CONTENT WORKSPACE ── */}
      <Box px={{ xs: 2, md: 6 }}>
        
        {/* ── TAB 0: OVERVIEW & PREVIEW ── */}
        {tabIndex === 0 && (
          <Grid container spacing={3} sx={{ animation: "fadeUp 0.3s ease both" }}>
            
            {/* MAIN MAIN CONTENT: Data Preview & Column Analysis */}
            <Grid item xs={12} md={8.3}>
              <Box display="flex" flexDirection="column" gap={4}>
                
                {/* DATA PREVIEW */}
                {data.preview && (
                  <Box>
                    <SectionLabel icon="🗂">Data Preview</SectionLabel>

                    <TextField
                      placeholder="Filter rows…"
                      size="small"
                      fullWidth
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontFamily: mono, fontSize: "1rem", color: T.muted, lineHeight: 1 }}>⌕</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          bgcolor: T.surface,
                          borderRadius: "10px",
                          fontFamily: mono,
                          fontSize: "0.82rem",
                          "& fieldset": { borderColor: T.border },
                          "&:hover fieldset": { borderColor: T.borderStrong },
                          "&.Mui-focused fieldset": { borderColor: T.accent },
                        },
                      }}
                    />

                    <Box sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(15,23,42,0.06)" }}>
                      <Box sx={{ overflowX: "auto", maxHeight: 360, overflowY: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: mono, fontSize: "0.78rem" }}>
                          <thead>
                            <tr>
                              {data.column_names.map((col) => (
                                <th key={col} style={{ padding: "11px 16px", background: T.accentSoft, color: T.accent, textAlign: "left", fontWeight: 600, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", position: "sticky", top: 0, zIndex: 1, borderBottom: `1px solid ${T.borderStrong}` }}>
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(filteredPreview ?? []).map((row, i) => (
                              <tr
                                key={i}
                                style={{ background: i % 2 === 0 ? T.surface : T.faint, borderBottom: `1px solid ${T.border}`, transition: "background 0.1s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = T.accentSoft)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? T.surface : T.faint)}
                              >
                                {data.column_names.map((col) => (
                                  <td key={col} style={{ padding: "9px 16px", color: T.sub, whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {row[col]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            {filteredPreview?.length === 0 && (
                              <tr>
                                <td colSpan={data.column_names.length} style={{ padding: "36px", textAlign: "center", color: T.muted, fontFamily: mono, fontSize: "0.8rem" }}>
                                  No rows match "{search}"
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </Box>
                      <Box sx={{ px: 2.5, py: 1, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "flex-end", bgcolor: T.faint }}>
                        <Typography sx={{ fontFamily: mono, fontSize: "0.6rem", color: T.muted }}>
                          {filteredPreview?.length ?? 0} / {data.preview.length} rows
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* COLUMN ANALYSIS */}
                <Box>
                  <SectionLabel icon="📐">Column Analysis</SectionLabel>
                  
                  {Object.keys(data.summary).length > 6 && (
                    <Typography sx={{ display: "none" }} /> // Spacer or placeholder
                  )}

                  {(() => {
                    const filteredSummary = Object.entries(data.summary).filter(([col]) =>
                      col.toLowerCase().includes(colSearch.toLowerCase())
                    );

                    return (
                      <Box>
                        <Grid container spacing={2}>
                          {filteredSummary
                            .slice(0, showAllCols ? undefined : 6)
                            .map(([col, stats]) => (
                              <Grid item xs={12} sm={6} key={col}>
                                <ColumnCard col={col} stats={stats} />
                              </Grid>
                            ))}
                        </Grid>

                        {filteredSummary.length > 6 && (
                          <Box display="flex" justifyContent="center" mt={3}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setShowAllCols(!showAllCols)}
                              sx={{
                                fontFamily: font,
                                fontWeight: 700,
                                textTransform: "none",
                                color: T.accent,
                                borderColor: T.accent,
                                borderRadius: "8px",
                                px: 3,
                                py: 0.8,
                                "&:hover": {
                                  borderColor: T.accentMid,
                                  bgcolor: T.accentSoft,
                                }
                              }}
                            >
                              {showAllCols ? "Show Less" : `Show All (${filteredSummary.length} columns)`}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    );
                  })()}
                </Box>
              </Box>
            </Grid>

            {/* SIDEBAR: STICKY DATA QUALITY SCORE GAUGE */}
            <Grid item xs={12} md={3.7}>
              <Card sx={{ 
                bgcolor: T.surface, 
                border: `1px solid ${T.border}`, 
                borderRadius: "18px", 
                p: 3.5, 
                position: "sticky", 
                top: 88,
                boxShadow: "0 4px 18px rgba(15,23,42,0.04)"
              }}>
                <Typography sx={{ fontFamily: font, fontWeight: 800, fontSize: "0.95rem", color: T.text, mb: 3 }}>
                  Data Health Index
                </Typography>

                {/* Circular Gauge */}
                <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                  <Box position="relative" display="inline-flex" justifyContent="center" alignItems="center" mb={2}>
                    <CircularProgress
                      variant="determinate"
                      value={qScore.overall_score}
                      size={110}
                      thickness={5.5}
                      sx={{ 
                        color: gaugeColor,
                        "& .MuiCircularProgress-circle": { strokeLinecap: "round" }
                      }}
                    />
                    <Box
                      position="absolute"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: mono, color: T.text, lineHeight: 1 }}>
                        {qScore.overall_score}
                      </Typography>
                      <Typography sx={{ fontSize: "0.52rem", fontWeight: 700, fontFamily: font, color: T.muted, textTransform: "uppercase", mt: 0.25, letterSpacing: "0.08em" }}>
                        GRADE
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ px: 1.5, py: 0.4, borderRadius: "6px", bgcolor: `${gaugeColor}15`, border: `1px solid ${gaugeColor}30` }}>
                    <Typography sx={{ fontFamily: font, fontSize: "0.68rem", fontWeight: 700, color: gaugeColor, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {statusText}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: T.border, mb: 3 }} />

                {/* Sub Scores list Checklist */}
                <Typography sx={{ fontFamily: font, fontSize: "0.72rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", mb: 1.5, letterSpacing: "0.05em" }}>
                  Dataset Diagnostics
                </Typography>

                <Box display="flex" flexDirection="column" gap={0.5}>
                  <SubScoreRow label="Populated Cells (Non-Null)" score={qScore.missing_score} />
                  <SubScoreRow label="Unique Rows (Non-Duplicates)" score={qScore.duplicate_score} />
                  <SubScoreRow label="Datatype Cleanliness" score={qScore.datatype_score} />
                  <SubScoreRow label="Distribution Consistency" score={qScore.consistency_score} />
                  <SubScoreRow label="Statistical Outliers Audit" score={qScore.outlier_score} />
                </Box>

                {/* Scorer Warnings List */}
                {qScore.warnings && qScore.warnings.length > 0 && (
                  <Box mt={3.5}>
                    <Typography sx={{ fontFamily: font, fontSize: "0.72rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", mb: 1.5, letterSpacing: "0.05em" }}>
                      Audit Details ({qScore.warnings.length})
                    </Typography>
                    <Box sx={{ maxHeight: 160, overflowY: "auto", pr: 0.5, display: "flex", flexDirection: "column", gap: 1.2 }}>
                      {qScore.warnings.map((w, idx) => {
                        let badgeColor = T.green;
                        if (w.severity === "high") badgeColor = T.rose;
                        else if (w.severity === "medium") badgeColor = T.warm;
                        else badgeColor = T.sky;
                        return (
                          <Box key={idx} sx={{ p: 1.2, bgcolor: T.faint, borderRadius: "10px", borderLeft: `3px solid ${badgeColor}` }}>
                            <Typography sx={{ fontFamily: font, fontSize: "0.7rem", color: T.sub, lineHeight: 1.45 }}>
                              {w.message}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        )}

        {/* ── TAB 1: DATA CLEANING ENGINE ── */}
        {tabIndex === 1 && (
          <Box display="flex" flexDirection="column" gap={4} sx={{ animation: "fadeUp 0.3s ease both" }}>
            
            {hasCleaningStats ? (
              <>
                {/* A. Statistics Cards Grid */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px", boxShadow: "none" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                          <TableChartIcon sx={{ color: T.accent }} />
                          <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: "0.85rem", color: T.muted }}>
                            Rows Comparison
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1.5} my={1.5}>
                          <Typography variant="h5" sx={{ fontFamily: mono, fontWeight: 800, color: T.text }}>
                            {report.rows_before}
                          </Typography>
                          <ArrowForwardIcon sx={{ color: T.muted, fontSize: "1.1rem" }} />
                          <Typography variant="h5" sx={{ fontFamily: mono, fontWeight: 800, color: T.green }}>
                            {report.rows_after}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: font, fontSize: "0.74rem", color: T.muted }}>
                          Dropped {report.rows_before - report.rows_after} row(s) containing duplicates or issues.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px", boxShadow: "none" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                          <CleaningServicesIcon sx={{ color: T.sky }} />
                          <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: "0.85rem", color: T.muted }}>
                            Null Values Handled
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontFamily: mono, fontWeight: 800, color: report.total_missing_before > 0 ? T.warm : T.green, my: 1.5 }}>
                          {report.total_missing_before} nulls ({report.missing_percentage}%)
                        </Typography>
                        <Typography sx={{ fontFamily: font, fontSize: "0.74rem", color: T.muted }}>
                          Automatically imputed using mathematical statistics (Mean/Mode).
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px", boxShadow: "none" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                          <CheckCircleIcon sx={{ color: T.green }} />
                          <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: "0.85rem", color: T.muted }}>
                            Cleaned Schema Audit
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontFamily: mono, fontWeight: 800, color: T.text, my: 1.5 }}>
                          {report.numeric_columns_detected} Num / {report.categorical_columns_detected} Cat
                        </Typography>
                        <Typography sx={{ fontFamily: font, fontSize: "0.74rem", color: T.muted }}>
                          All whitespace trimmed. Standardized text encodings resolved.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* B. Warnings and Critical Data Quality Items */}
                {(constantCols.length > 0 || emptyCols.length > 0 || suspiciousCols.length > 0) && (
                  <Box>
                    <SectionLabel icon="⚠️">Integrity Alerts</SectionLabel>
                    
                    {constantCols.length > 0 && (
                      <Alert icon={<WarningIcon />} severity="warning" variant="outlined" sx={{ borderRadius: "12px", mb: 2, bgcolor: darkMode ? "rgba(245, 158, 11, 0.04)" : "#fffbeb", borderColor: `${T.warm}40`, color: T.text }}>
                        <AlertTitle sx={{ fontFamily: font, fontWeight: 700 }}>Constant Columns Detected</AlertTitle>
                        The following columns contain only a single value across the entire dataset: <strong>{constantCols.join(", ")}</strong>. These columns provide no mathematical variance for modeling.
                      </Alert>
                    )}

                    {emptyCols.length > 0 && (
                      <Alert icon={<ErrorIcon />} severity="error" variant="outlined" sx={{ borderRadius: "12px", mb: 2, bgcolor: darkMode ? "rgba(244, 63, 94, 0.04)" : "#fff5f5", borderColor: `${T.rose}40`, color: T.text }}>
                        <AlertTitle sx={{ fontFamily: font, fontWeight: 700 }}>Empty Columns Detected</AlertTitle>
                        The following columns are completely empty (all rows are null/missing): <strong>{emptyCols.join(", ")}</strong>.
                      </Alert>
                    )}

                    {suspiciousCols.length > 0 && (
                      <Alert icon={<InfoIcon />} severity="info" variant="outlined" sx={{ borderRadius: "12px", mb: 2, bgcolor: darkMode ? "rgba(14, 165, 233, 0.04)" : "#f0f9ff", borderColor: `${T.sky}40`, color: T.text }}>
                        <AlertTitle sx={{ fontFamily: font, fontWeight: 700 }}>Suspicious Datatypes Flagged</AlertTitle>
                        <Box component="ul" sx={{ m: 0, pl: 2, fontFamily: font, fontSize: "0.82rem" }}>
                          {suspiciousCols.map(([col, reason]) => (
                            <li key={col}>
                              <strong>{col}</strong>: {reason}
                            </li>
                          ))}
                        </Box>
                      </Alert>
                    )}
                  </Box>
                )}

                {/* C. Modification Log details */}
                <Box>
                  <SectionLabel icon="📋">Engine Processing Logs</SectionLabel>
                  <Card sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px", boxShadow: "none" }}>
                    <CardContent sx={{ p: 0 }}>
                      <List sx={{ p: 0 }}>
                        
                        {/* Trim logs */}
                        <ListItem sx={{ py: 2.5, px: 3 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}><CheckCircleIcon sx={{ color: T.green, fontSize: "1.2rem" }} /></ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>
                                Cell & Header Sanitization
                              </Typography>
                            }
                            secondary={
                              <Typography sx={{ fontFamily: font, fontSize: "0.78rem", color: T.muted, mt: 0.5 }}>
                                {trimmedCols.length > 0 ? (
                                  <>Stripped leading and trailing whitespace characters from column headers or generic text cells: <strong>{trimmedCols.join(", ")}</strong>.</>
                                ) : (
                                  <>Headers and generic text values were already cleanly trimmed.</>
                                )}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider sx={{ borderColor: T.border }} />

                        {/* Coerce logs */}
                        <ListItem sx={{ py: 2.5, px: 3 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}><CheckCircleIcon sx={{ color: T.green, fontSize: "1.2rem" }} /></ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>
                                Datatype Coercion
                              </Typography>
                            }
                            secondary={
                              <Typography sx={{ fontFamily: font, fontSize: "0.78rem", color: T.muted, mt: 0.5 }}>
                                {coercedCols.length > 0 ? (
                                  <>Automatically converted generic text columns containing number characters into true numeric datatypes (since &ge;80% values were numbers): <strong>{coercedCols.join(", ")}</strong>.</>
                                ) : (
                                  <>No text columns were identified as qualifying for numeric coercion (requires &ge;80% numeric strings).</>
                                )}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider sx={{ borderColor: T.border }} />

                        {/* Missing values logs */}
                        <ListItem sx={{ py: 2.5, px: 3 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}><CheckCircleIcon sx={{ color: T.green, fontSize: "1.2rem" }} /></ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: "0.85rem", color: T.text }}>
                                Missing Values Imputation
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                {filledSummary.length > 0 ? (
                                  <Box display="flex" flexDirection="column" gap={0.5}>
                                    {filledSummary.map(([col, action]) => (
                                      <Typography key={col} sx={{ fontFamily: font, fontSize: "0.78rem", color: T.muted }}>
                                        · <strong>{col}</strong>: {action}
                                      </Typography>
                                    ))}
                                  </Box>
                                ) : (
                                  <Typography sx={{ fontFamily: font, fontSize: "0.78rem", color: T.muted }}>
                                    No missing null values found in the uploaded dataset.
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Box>

                {/* D. Preserved Raw dataset separate & download cleaned dataset */}
                <Box sx={{ mt: 2 }}>
                  <Card sx={{ 
                    bgcolor: T.accentSoft, 
                    border: `1px solid ${T.accent}30`, 
                    borderRadius: "16px", 
                    boxShadow: "none",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                  }}>
                    <DownloadIcon sx={{ color: T.accent, fontSize: "2.4rem", mb: 1.5 }} />
                    <Typography sx={{ fontFamily: font, fontWeight: 800, fontSize: "1.1rem", color: T.text, mb: 1 }}>
                      Cleaned Dataset Ready
                    </Typography>
                    <Typography sx={{ fontFamily: font, fontSize: "0.82rem", color: T.sub, maxWidth: 600, mb: 3 }}>
                      The system successfully processed your data and saved a cleaned file in the platform's workspace uploads. Your original file has been preserved untouched separately. Click below to download the cleaned copy.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      size="large"
                      href={cleanedDownloadUrl}
                      disabled={!cleanedDownloadUrl}
                      target="_blank"
                      sx={{
                        background: `linear-gradient(135deg, ${T.accent} 0%, ${T.accentMid} 100%)`,
                        fontWeight: 700,
                        fontFamily: font,
                        textTransform: "none",
                        borderRadius: "12px",
                        px: 4,
                        py: 1.5,
                        boxShadow: `0 8px 20px ${T.accent}40`,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${T.accent} 20%, #a20027 100%)`,
                          boxShadow: `0 10px 24px ${T.accent}60`,
                        }
                      }}
                    >
                      Download Cleaned Dataset (CSV)
                    </Button>
                  </Card>
                </Box>
              </>
            ) : (
              <Box py={6} textAlign="center">
                <CleaningServicesIcon sx={{ color: T.muted, fontSize: "3rem", mb: 2 }} />
                <Typography sx={{ fontFamily: font, fontWeight: 700, color: T.text, mb: 1 }}>
                  No Cleaning Metrics Found
                </Typography>
                <Typography sx={{ fontFamily: font, fontSize: "0.82rem", color: T.muted }}>
                  The dataset metadata does not contain a cleaning report. Please re-upload your file to generate cleaning diagnostics.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* ── TAB 2: VISUALIZATIONS ── */}
        {tabIndex === 2 && (
          <Box display="flex" flexDirection="column" gap={4} sx={{ animation: "fadeUp 0.3s ease both" }}>
            <Box>
              <SectionLabel icon="📊">Visualizations Dashboard</SectionLabel>
              <Box
                sx={{
                  bgcolor: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: "16px",
                  p: { xs: 2, md: 4 },
                  boxShadow: "0 2px 12px rgba(15,23,42,0.07)",
                  width: "100%",
                }}
              >
                <Charts charts={data.charts} darkMode={darkMode} />
              </Box>
            </Box>
          </Box>
        )}

        {/* ── TAB 3: AI INSIGHTS ── */}
        {tabIndex === 3 && (
          <Box display="flex" flexDirection="column" gap={4} sx={{ animation: "fadeUp 0.3s ease both" }}>
            {data.insights && (
              <Box>
                <SectionLabel icon="🪄">AI-Generated Analysis Insights</SectionLabel>
                <Box
                  sx={{
                    bgcolor: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(15,23,42,0.07)",
                  }}
                >
                  <Box sx={{ height: 3, background: `linear-gradient(90deg, ${T.accent}, ${T.accentMid}, #a78bfa)` }} />
                  <Box sx={{ p: { xs: 3, md: 4 } }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                      <Box sx={{ width: 32, height: 32, borderRadius: "10px", background: `linear-gradient(135deg, ${T.accent}, #7c3aed)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        ✦
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: font, fontSize: "0.85rem", fontWeight: 700, color: T.text }}>
                          Statistical Intelligence Report
                        </Typography>
                      </Box>
                    </Box>
                    <Insights insights={data.insights} darkMode={darkMode} />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* ── TAB 4: MACHINE LEARNING WORKSPACE ── */}
        {tabIndex === 4 && renderMLWorkspace()}

      </Box>
    </Box>
  );
};

export default Dashboard;