import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie, Legend, AreaChart, Area, ScatterChart, Scatter
} from "recharts";
import {
  Grid, Box, Typography, Tabs, Tab, Card, CardContent, CardActions,
  FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton, Tooltip as MuiTooltip, Button
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import GridOnIcon from "@mui/icons-material/GridOn";
import PaletteIcon from "@mui/icons-material/Palette";

const PALETTES = {
  indigo: ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"],
  emerald: ["#10b981", "#059669", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"],
  sky: ["#0ea5e9", "#0284c7", "#38bdf8", "#7dd3fc", "#bae6fd", "#e0f2fe"],
  rose: ["#f43f5e", "#e11d48", "#fb7185", "#fda4af", "#fecdd3", "#ffe4e6"],
  sunset: ["#f97316", "#ea580c", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"],
  crimson: ["#DA0037", "#ff3366", "#ff6688", "#ff99aa", "#ffcccc", "#ffeef0"],
  neon: ["#FF2E63", "#08D9D6", "#252A34", "#EAEAEA", "#ff6688", "#5cd6d4"]
};

// 📦 BoxPlot Custom Component
const BoxPlot = ({ box, label, color, darkMode }) => {
  const { min, q1, median, q3, max } = box;
  const range = max - min;
  const scale = (val) => {
    if (range === 0) return 50;
    return ((val - min) / range) * 80 + 10; // Scale from 10% to 90% for padding margins
  };

  const q1Pos = `${scale(q1)}%`;
  const medianPos = `${scale(median)}%`;
  const q3Pos = `${scale(q3)}%`;
  const minPos = `${scale(min)}%`;
  const maxPos = `${scale(max)}%`;

  const labelStyle = {
    fontSize: "9px",
    fontFamily: "'IBM Plex Mono', monospace",
    fill: darkMode ? "#9ca3af" : "#64748b",
    fontWeight: 600
  };

  return (
    <Box sx={{ p: 2, bgcolor: darkMode ? "#181818" : "#f8fafc", borderRadius: "10px", border: `1px solid ${darkMode ? "#2d2d2d" : "#e2e8f0"}`, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* 5-number Stats Grid */}
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={0.5} mb={3.5} textAlign="center">
        <Box>
          <Typography variant="caption" sx={{ fontSize: "0.58rem", fontWeight: 700, color: "text.secondary", display: "block" }}>MIN</Typography>
          <Typography sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", fontWeight: 700 }}>{min.toFixed(2)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontSize: "0.58rem", fontWeight: 700, color: "text.secondary", display: "block" }}>Q1 (25%)</Typography>
          <Typography sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", fontWeight: 700 }}>{q1.toFixed(2)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontSize: "0.58rem", fontWeight: 700, color: color, display: "block" }}>MEDIAN</Typography>
          <Typography sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", fontWeight: 800, color: color }}>{median.toFixed(2)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontSize: "0.58rem", fontWeight: 700, color: "text.secondary", display: "block" }}>Q3 (75%)</Typography>
          <Typography sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", fontWeight: 700 }}>{q3.toFixed(2)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontSize: "0.58rem", fontWeight: 700, color: "text.secondary", display: "block" }}>MAX</Typography>
          <Typography sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", fontWeight: 700 }}>{max.toFixed(2)}</Typography>
        </Box>
      </Box>

      {/* SVG Box whisker */}
      <svg width="100%" height="70" style={{ overflow: "visible" }}>
        {/* Whiskers */}
        <line x1={minPos} y1="35" x2={maxPos} y2="35" stroke={darkMode ? "#4b5563" : "#cbd5e1"} strokeWidth="2" strokeDasharray="3 3" />
        <line x1={minPos} y1="20" x2={minPos} y2="50" stroke={color} strokeWidth="2.5" />
        <line x1={maxPos} y1="20" x2={maxPos} y2="50" stroke={color} strokeWidth="2.5" />

        {/* Box (IQR) */}
        <rect x={q1Pos} y="15" width={`${scale(q3) - scale(q1)}%`} height="40" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" rx="2" />

        {/* Median Line */}
        <line x1={medianPos} y1="15" x2={medianPos} y2="55" stroke={color} strokeWidth="3.5" />

        {/* Value markings */}
        <text x={minPos} y="10" textAnchor="middle" style={labelStyle}>{min.toFixed(1)}</text>
        <text x={q1Pos} y="68" textAnchor="middle" style={labelStyle}>{q1.toFixed(1)}</text>
        <text x={medianPos} y="10" textAnchor="middle" style={{ ...labelStyle, fill: color, fontWeight: 800 }}>{median.toFixed(1)}</text>
        <text x={q3Pos} y="68" textAnchor="middle" style={labelStyle}>{q3.toFixed(1)}</text>
        <text x={maxPos} y="10" textAnchor="middle" style={labelStyle}>{max.toFixed(1)}</text>
      </svg>
    </Box>
  );
};

const Charts = ({ charts, darkMode }) => {
  const [tabValue, setTabValue] = useState(0);
  const [paletteName, setPaletteName] = useState(darkMode ? "crimson" : "indigo");
  const [chartTypes, setChartTypes] = useState({});
  const [distFilter, setDistFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [selectedCorrCols, setSelectedCorrCols] = useState(null);

  if (!charts || Object.keys(charts).length === 0) {
    return (
      <Box p={4} textAlign="center" border="1px dashed #ccc" borderRadius={4}>
        <Typography color="text.secondary">No visualization data available.</Typography>
      </Box>
    );
  }

  const palette = PALETTES[paletteName] || PALETTES[darkMode ? "crimson" : "indigo"];
  const hasLineChart = !!charts._line;

  // Dynamic Theme Colors
  const C = {
    cardBg: darkMode ? "#222222" : "#ffffff",
    cardBorder: darkMode ? "1px solid #444444" : "1px solid rgba(8, 217, 214, 0.3)",
    actionsBg: darkMode ? "#171717" : "#EAEAEA",
    actionsBorder: darkMode ? "1px solid #444444" : "1px solid rgba(8, 217, 214, 0.3)",
    textTitle: darkMode ? "#EDEDED" : "#252A34",
    textSub: darkMode ? "#999999" : "#555555",
    gridStroke: darkMode ? "#444444" : "#e0e0e0",
    axisFill: darkMode ? "#999999" : "#666666",
    tooltipBg: darkMode ? "#222222" : "#ffffff",
    tooltipBorder: darkMode ? "1px solid #444444" : "1px solid #08D9D6",
    tooltipColor: darkMode ? "#EDEDED" : "#252A34",
    pillBg: darkMode ? "#171717" : "#ffffff",
    pillBorder: darkMode ? "#444444" : "1px solid rgba(8, 217, 214, 0.3)",
    tableHeaderBorder: darkMode ? "2px solid #444444" : "2px solid #08D9D6",
    tableRowBorder: darkMode ? "2px solid #444444" : "1px solid #cbd5e1",
    tableText: darkMode ? "#dfdfdf" : "#252A34",
    inputLabelColor: darkMode ? "#999999" : "#555555"
  };

  // Helper: Download SVG
  const downloadSVG = (chartId, name) => {
    const container = document.getElementById(chartId);
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+ xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    source = '<?xml version="1.0" encoding="utf-8"?>\n' + source;
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    const trigger = document.createElement("a");
    trigger.href = url;
    trigger.download = `${name.toLowerCase()}_chart.svg`;
    document.body.appendChild(trigger);
    trigger.click();
    document.body.removeChild(trigger);
  };

  // Helper: Download CSV
  const downloadCSV = (data, name) => {
    const headers = ["Label", "Value"];
    const rows = data.map(item => [item.name, item.value]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${name.toLowerCase()}_chart_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Distributions Tab (Histogram & Box Plot)
  const renderDistributions = () => {
    const numericEntries = Object.entries(charts).filter(
      ([col, chart]) => chart?.type === "histogram" && !col.startsWith("_")
    );

    if (numericEntries.length === 0) {
      return (
        <Typography color="text.secondary" align="center" py={4}>
          No numeric variables found in dataset.
        </Typography>
      );
    }

    const filteredEntries = distFilter === "all" 
      ? numericEntries 
      : numericEntries.filter(([col]) => col === distFilter);

    return (
      <Box>
        {numericEntries.length > 2 && (
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: C.textSub }}>
              Filter Variable:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={distFilter}
                onChange={(e) => setDistFilter(e.target.value)}
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: C.textTitle,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#374151" : "#cbd5e1" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: palette[0] },
                }}
              >
                <MenuItem value="all">All Variables</MenuItem>
                {numericEntries.map(([col]) => (
                  <MenuItem key={col} value={col}>{col.replace(/_/g, " ")}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {filteredEntries.map(([col, chart]) => {
            const labels = chart?.labels || [];
            const values = chart?.values || [];
            const data = labels.map((label, i) => ({
              name: String(label),
              value: Number(values[i]) || 0,
            }));

            if (data.length === 0) return null;
            const chartId = `chart-dist-${col}`;
            const currentType = chartTypes[col] || "bar";

            return (
              <Grid item xs={12} md={6} key={col}>
                <Card variant="outlined" sx={{ borderRadius: "12px", border: C.cardBorder, bgcolor: C.cardBg }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: C.textTitle, textTransform: "capitalize" }}>
                        {chart.title || `${col.replace(/_/g, " ")} Distribution`}
                      </Typography>
                      
                      <Box display="flex" gap={1} alignItems="center">
                        <ToggleButtonGroup
                          size="small"
                          value={currentType}
                          exclusive
                          onChange={(e, val) => val && setChartTypes({ ...chartTypes, [col]: val })}
                          sx={{
                            border: darkMode ? "1px solid #374151" : "1px solid #e2e8f0",
                            "& .MuiToggleButton-root": {
                              color: darkMode ? "#9ca3af" : "#64748b",
                              borderColor: darkMode ? "#374151" : "#e2e8f0",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              py: 0.3,
                              px: 1.2,
                              "&.Mui-selected": {
                                color: palette[0],
                                bgcolor: darkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.05)"
                              }
                            }
                          }}
                        >
                          <ToggleButton value="bar">
                            <MuiTooltip title="Histogram" arrow><BarChartIcon fontSize="small" /></MuiTooltip>
                          </ToggleButton>
                          <ToggleButton value="area">
                            <MuiTooltip title="Area Chart" arrow><ShowChartIcon fontSize="small" /></MuiTooltip>
                          </ToggleButton>
                          {chart.boxplot && (
                            <ToggleButton value="boxplot" sx={{ fontSize: "0.58rem" }}>
                              BOX
                            </ToggleButton>
                          )}
                        </ToggleButtonGroup>
                      </Box>
                    </Box>

                    <Box id={chartId} sx={{ width: "100%", height: 260, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      {currentType === "boxplot" && chart.boxplot ? (
                        <BoxPlot box={chart.boxplot} label={col} color={palette[0]} darkMode={darkMode} />
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          {currentType === "area" ? (
                            <AreaChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 15 }}>
                              <defs>
                                <linearGradient id={`color-${col}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={palette[0]} stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor={palette[0]} stopOpacity={0.0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.gridStroke} />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: chart.x_label || col, position: "insideBottom", offset: -5, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: chart.y_label || "Frequency", angle: -90, position: "insideLeft", offset: -5, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                              <Tooltip contentStyle={{ borderRadius: "8px", border: C.tooltipBorder, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontSize: "12px", backgroundColor: C.tooltipBg, color: C.tooltipColor }} />
                              <Area type="monotone" dataKey="value" stroke={palette[0]} strokeWidth={2} fillOpacity={1} fill={`url(#color-${col})`} />
                            </AreaChart>
                          ) : (
                            <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 15 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.gridStroke} />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: chart.x_label || col, position: "insideBottom", offset: -5, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: chart.y_label || "Frequency", angle: -90, position: "insideLeft", offset: -5, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                              <Tooltip cursor={{ fill: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc" }} contentStyle={{ borderRadius: "8px", border: C.tooltipBorder, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontSize: "12px", backgroundColor: C.tooltipBg, color: C.tooltipColor }} />
                              <Bar dataKey="value" fill={palette[0]} radius={[4, 4, 0, 0]} barSize={Math.max(10, Math.min(35, 180 / data.length))} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", bgcolor: C.actionsBg, px: 2, py: 1, borderTop: C.actionsBorder }}>
                    {currentType !== "boxplot" && (
                      <Button size="small" startIcon={<DownloadIcon />} onClick={() => downloadCSV(data, col)} sx={{ textTransform: "none", fontSize: "0.72rem" }}>Data (CSV)</Button>
                    )}
                    <Button size="small" startIcon={<DownloadIcon />} onClick={() => downloadSVG(chartId, col)} sx={{ textTransform: "none", fontSize: "0.72rem" }}>Chart (SVG)</Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  // 2. Categorical Analysis Tab (Bar vs Pie)
  const renderCategorical = () => {
    const catEntries = Object.entries(charts).filter(
      ([col, chart]) => (chart?.type === "bar" || chart?.type === "pie") && !col.startsWith("_")
    );

    if (catEntries.length === 0) {
      return (
        <Typography color="text.secondary" align="center" py={4}>
          No categorical variables found in dataset.
        </Typography>
      );
    }

    const filteredEntries = catFilter === "all" 
      ? catEntries 
      : catEntries.filter(([col]) => col === catFilter);

    return (
      <Box>
        {catEntries.length > 2 && (
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: C.textSub }}>
              Filter Variable:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: C.textTitle,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#374151" : "#cbd5e1" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: palette[0] },
                }}
              >
                <MenuItem value="all">All Variables</MenuItem>
                {catEntries.map(([col]) => (
                  <MenuItem key={col} value={col}>{col.replace(/_/g, " ")}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {filteredEntries.map(([col, chart]) => {
            const labels = chart?.labels || [];
            const values = chart?.values || [];
            const data = labels.map((label, i) => ({
              name: String(label),
              value: Number(values[i]) || 0,
            }));

            if (data.length === 0) return null;
            const chartId = `chart-cat-${col}`;
            const currentType = chartTypes[col] || chart.type;

            return (
              <Grid item xs={12} md={6} key={col}>
                <Card variant="outlined" sx={{ borderRadius: "12px", border: C.cardBorder, bgcolor: C.cardBg }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: C.textTitle, textTransform: "capitalize" }}>
                        {chart.title || `${col.replace(/_/g, " ")} Breakdown`}
                      </Typography>
                      
                      <Box display="flex" gap={1} alignItems="center">
                        <ToggleButtonGroup
                          size="small"
                          value={currentType}
                          exclusive
                          onChange={(e, val) => val && setChartTypes({ ...chartTypes, [col]: val })}
                          sx={{
                            border: darkMode ? "1px solid #374151" : "1px solid #e2e8f0",
                            "& .MuiToggleButton-root": {
                              color: darkMode ? "#9ca3af" : "#64748b",
                              borderColor: darkMode ? "#374151" : "#e2e8f0",
                              "&.Mui-selected": {
                                color: palette[0],
                                bgcolor: darkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.05)"
                              }
                            }
                          }}
                        >
                          <ToggleButton value="bar">
                            <BarChartIcon fontSize="small" />
                          </ToggleButton>
                          <ToggleButton value="pie">
                            <PieChartIcon fontSize="small" />
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                    </Box>

                    <Box id={chartId} sx={{ width: "100%", height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        {currentType === "pie" ? (
                          <PieChart>
                            <Pie
                              data={data}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="45%"
                              innerRadius={55}
                              outerRadius={85}
                              paddingAngle={2}
                            >
                              {data.map((entry, i) => (
                                <Cell key={`cell-${i}`} fill={palette[i % palette.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: "8px", border: C.tooltipBorder, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontSize: "12px", backgroundColor: C.tooltipBg, color: C.tooltipColor }} />
                            <Legend verticalAlign="bottom" height={36} iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "10px", marginTop: "10px", color: C.textTitle }} />
                          </PieChart>
                        ) : (
                          <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 15 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.gridStroke} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: chart.x_label || col, position: "insideBottom", offset: -5, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: chart.y_label || "Count", angle: -90, position: "insideLeft", offset: -5, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                            <Tooltip cursor={{ fill: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc" }} contentStyle={{ borderRadius: "8px", border: C.tooltipBorder, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontSize: "12px", backgroundColor: C.tooltipBg, color: C.tooltipColor }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={Math.max(12, Math.min(45, 200 / data.length))}>
                              {data.map((entry, i) => (
                                <Cell key={`cell-${i}`} fill={palette[i % palette.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", bgcolor: C.actionsBg, px: 2, py: 1, borderTop: C.actionsBorder }}>
                    <Button size="small" startIcon={<DownloadIcon />} onClick={() => downloadCSV(data, col)} sx={{ textTransform: "none", fontSize: "0.72rem" }}>Data (CSV)</Button>
                    <Button size="small" startIcon={<DownloadIcon />} onClick={() => downloadSVG(chartId, col)} sx={{ textTransform: "none", fontSize: "0.72rem" }}>Chart (SVG)</Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  // 3. Chronological Trends Tab (Line Chart)
  const renderTrends = () => {
    const lineChart = charts._line;
    if (!lineChart) return null;
    const data = lineChart.data.map(d => ({ name: d.x, value: d.y }));
    const chartId = "chart-line-trend";

    return (
      <Box>
        <Card variant="outlined" sx={{ borderRadius: "12px", border: C.cardBorder, bgcolor: C.cardBg, mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: C.textTitle, mb: 1 }}>
              {lineChart.title}
            </Typography>
            <Typography variant="caption" sx={{ color: C.textSub, mb: 2, display: "block" }}>
              Time-series line chart depicting trend of numeric attribute <strong>{lineChart.y_axis}</strong> sorted chronologically by date/time variable <strong>{lineChart.x_axis}</strong>.
            </Typography>
            <Box id={chartId} sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={palette[0]} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={palette[0]} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.gridStroke} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: lineChart.x_axis, position: "insideBottom", offset: -5, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: lineChart.y_axis, angle: -90, position: "insideLeft", offset: 0, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: C.tooltipBorder, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontSize: "12px", backgroundColor: C.tooltipBg, color: C.tooltipColor }} />
                  <Area type="monotone" dataKey="value" stroke={palette[0]} strokeWidth={2.5} fillOpacity={1} fill="url(#trendGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", bgcolor: C.actionsBg, px: 2, py: 1, borderTop: C.actionsBorder }}>
            <Button size="small" startIcon={<DownloadIcon />} onClick={() => downloadCSV(data, "trend")} sx={{ textTransform: "none", fontSize: "0.72rem" }}>Data (CSV)</Button>
            <Button size="small" startIcon={<DownloadIcon />} onClick={() => downloadSVG(chartId, "trend")} sx={{ textTransform: "none", fontSize: "0.72rem" }}>Chart (SVG)</Button>
          </CardActions>
        </Card>
      </Box>
    );
  };

  // 4. Relationships Tab (Scatter plot)
  const [xAxisCol, setXAxisCol] = useState("");
  const [yAxisCol, setYAxisCol] = useState("");

  const renderRelationships = () => {
    const scatterData = charts._scatter;
    if (!scatterData || !scatterData.data || scatterData.data.length === 0) {
      return (
        <Typography color="text.secondary" align="center" py={4}>
          At least 2 numeric variables are required to draw scatter relationship.
        </Typography>
      );
    }

    const cols = scatterData.columns || [];
    const activeX = xAxisCol || cols[0] || "";
    const activeY = yAxisCol || cols[1] || cols[0] || "";

    if (!xAxisCol && cols[0]) setXAxisCol(cols[0]);
    if (!yAxisCol && cols[1]) setYAxisCol(cols[1]);

    const chartId = "relationship-scatter-chart";

    const downloadScatterCSV = () => {
      const headers = [activeX, activeY];
      const rows = scatterData.data.map(item => [item[activeX], item[activeY]]);
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `scatter_${activeX}_vs_${activeY}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <Box>
        <Grid container spacing={2} mb={3} alignItems="center">
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="x-axis-label" sx={{ color: C.inputLabelColor }}>X Axis (Numeric)</InputLabel>
              <Select
                labelId="x-axis-label"
                value={activeX}
                label="X Axis (Numeric)"
                onChange={(e) => setXAxisCol(e.target.value)}
                sx={{
                  color: C.textTitle,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#374151" : "#cbd5e1" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: palette[0] },
                }}
              >
                {cols.map(c => (
                  <MenuItem key={c} value={c}>{c.replace(/_/g, " ")}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="y-axis-label" sx={{ color: C.inputLabelColor }}>Y Axis (Numeric)</InputLabel>
              <Select
                labelId="y-axis-label"
                value={activeY}
                label="Y Axis (Numeric)"
                onChange={(e) => setYAxisCol(e.target.value)}
                sx={{
                  color: C.textTitle,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: darkMode ? "#374151" : "#cbd5e1" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: palette[0] },
                }}
              >
                {cols.map(c => (
                  <MenuItem key={c} value={c}>{c.replace(/_/g, " ")}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent={{ xs: "flex-start", sm: "flex-end" }} gap={1}>
            <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={downloadScatterCSV} sx={{ textTransform: "none", fontSize: "0.72rem", color: palette[0], borderColor: palette[0] }}>CSV</Button>
            <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={() => downloadSVG(chartId, `scatter_${activeX}_vs_${activeY}`)} sx={{ textTransform: "none", fontSize: "0.72rem", color: palette[0], borderColor: palette[0] }}>SVG</Button>
          </Grid>
        </Grid>

        <Card variant="outlined" sx={{ borderRadius: "12px", border: C.cardBorder, bgcolor: C.cardBg }}>
          <CardContent>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: C.textSub }}>
              {scatterData.title || `Scatter Plot: ${activeX.toUpperCase()} vs ${activeY.toUpperCase()}`}
            </Typography>
            <Box id={chartId} sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 15, right: 20, bottom: 20, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.gridStroke} />
                  <XAxis type="number" dataKey={activeX} name={activeX} axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: activeX, position: "insideBottom", offset: -5, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                  <YAxis type="number" dataKey={activeY} name={activeY} axisLine={false} tickLine={false} tick={{ fill: C.axisFill, fontSize: 9 }} label={{ value: activeY, angle: -90, position: "insideLeft", offset: 0, fill: C.textSub, fontSize: 10, fontWeight: 600 }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: "8px", border: C.tooltipBorder, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontSize: "12px", backgroundColor: C.tooltipBg, color: C.tooltipColor }} />
                  <Scatter name="Data Points" data={scatterData.data} fill={palette[0]} opacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  // 5. Correlation Heatmap Tab
  const renderHeatmap = () => {
    const corrData = charts._correlation;
    if (!corrData || !corrData.matrix) {
      return (
        <Typography color="text.secondary" align="center" py={4}>
          At least 2 numeric variables are required to generate a correlation heatmap.
        </Typography>
      );
    }

    const { columns, matrix } = corrData;

    let activeCols = selectedCorrCols;
    if (!activeCols) {
      activeCols = columns.slice(0, 6);
    }

    const toggleCol = (col) => {
      let nextCols;
      if (activeCols.includes(col)) {
        if (activeCols.length <= 2) return;
        nextCols = activeCols.filter(c => c !== col);
      } else {
        nextCols = [...activeCols, col];
      }
      setSelectedCorrCols(nextCols);
    };

    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 2, color: C.textSub, fontStyle: "italic" }}>
          Values range from -1 (perfect negative correlation, shown in 🔵 blue) to +1 (perfect positive correlation, shown in 🔴 red).
        </Typography>
        
        {columns.length > 5 && (
          <Box mb={3} p={2} sx={{ bgcolor: C.pillBg, borderRadius: "10px", border: `1px solid ${C.pillBorder}` }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: C.textSub, display: "block", mb: 1.5 }}>
              Choose variables to compare (keep under 6 recommended for mobile layout responsiveness):
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {columns.map(col => {
                const isSelected = activeCols.includes(col);
                return (
                  <Button
                    key={col}
                    size="small"
                    variant={isSelected ? "contained" : "outlined"}
                    onClick={() => toggleCol(col)}
                    sx={{
                      fontSize: "0.68rem",
                      textTransform: "none",
                      borderRadius: "20px",
                      py: 0.25,
                      px: 1.5,
                      fontWeight: 600,
                      backgroundColor: isSelected ? palette[0] : "transparent",
                      borderColor: isSelected ? palette[0] : (darkMode ? "#374151" : "#e2e8f0"),
                      color: isSelected ? "#fff" : C.textSub,
                      "&:hover": {
                        backgroundColor: isSelected ? palette[1] : (darkMode ? "#1f2937" : "#f1f5f9"),
                        borderColor: isSelected ? palette[1] : (darkMode ? "#4b5563" : "#cbd5e1")
                      }
                    }}
                  >
                    {col.replace(/_/g, " ")}
                  </Button>
                );
              })}
            </Box>
          </Box>
        )}
        
        <Box sx={{ overflowX: "auto", mt: 2, pb: 2 }}>
          <table style={{ borderCollapse: "collapse", margin: "auto", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.82rem" }}>
            <thead>
              <tr>
                <th></th>
                {activeCols.map(col => (
                  <th key={col} style={{ padding: "10px 14px", borderBottom: C.tableHeaderBorder, textTransform: "uppercase", fontWeight: 700, color: C.tableText, fontSize: "0.7rem", letterSpacing: "0.05em", textAlign: "center" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeCols.map(rowCol => (
                <tr key={rowCol}>
                  <td style={{ padding: "10px 14px", borderRight: C.tableRowBorder, textTransform: "uppercase", fontWeight: 700, color: C.tableText, fontSize: "0.7rem", letterSpacing: "0.05em", textAlign: "right", whiteSpace: "nowrap" }}>
                    {rowCol}
                  </td>
                  {activeCols.map(colCol => {
                    const r = Number(matrix[rowCol]?.[colCol] ?? 0);
                    
                    let bg = darkMode ? "rgba(31, 41, 55, 0.4)" : "rgba(241, 245, 249, 0.8)";
                    let color = darkMode ? "#f9fafb" : "#0f172a";
                    if (r > 0) {
                      bg = `rgba(239, 68, 68, ${r * 0.95})`;
                      color = r > 0.4 ? "#fff" : (darkMode ? "#f9fafb" : "#0f172a");
                    } else if (r < 0) {
                      const absR = Math.abs(r);
                      bg = `rgba(59, 130, 246, ${absR * 0.95})`;
                      color = absR > 0.4 ? "#fff" : (darkMode ? "#f9fafb" : "#0f172a");
                    }

                    return (
                      <MuiTooltip key={colCol} title={`Correlation [${rowCol} × ${colCol}]: ${r.toFixed(4)}`} arrow>
                        <td style={{
                          padding: "18px",
                          textAlign: "center",
                          backgroundColor: bg,
                          color: color,
                          border: darkMode ? "1px solid #1f2937" : "1px solid #e2e8f0",
                          fontWeight: 700,
                          cursor: "default",
                          transition: "transform 0.15s, box-shadow 0.15s",
                          minWidth: "75px"
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "scale(1.08)";
                          e.currentTarget.style.zIndex = "10";
                          e.currentTarget.style.position = "relative";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.position = "static";
                        }}
                        >
                          {r.toFixed(2)}
                        </td>
                      </MuiTooltip>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      {/* Visualizations Card Header Tools */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2} mb={3}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: palette[0] },
            "& .MuiTab-root": {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "none",
              color: C.textSub,
              "&.Mui-selected": { color: palette[0] }
            }
          }}
        >
          <Tab icon={<BarChartIcon fontSize="small" />} iconPosition="start" label="Distributions" />
          <Tab icon={<PieChartIcon fontSize="small" />} iconPosition="start" label="Categorical" />
          {hasLineChart && (
            <Tab icon={<ShowChartIcon fontSize="small" />} iconPosition="start" label="Trends" />
          )}
          <Tab icon={<BubbleChartIcon fontSize="small" />} iconPosition="start" label="Relationships" />
          <Tab icon={<GridOnIcon fontSize="small" />} iconPosition="start" label="Correlations" />
        </Tabs>

        {/* Theme Palette Switcher */}
        <Box display="flex" alignItems="center" gap={1} alignSelf={{ xs: "flex-end", sm: "auto" }}>
          <PaletteIcon sx={{ color: C.textSub, fontSize: "1.1rem" }} />
          <FormControl size="small" variant="standard" sx={{ minWidth: 100 }}>
            <Select
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              sx={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: palette[0],
                "&:before, &:after": { borderBottomColor: palette[0] },
                "& .MuiSelect-icon": { color: palette[0] }
              }}
            >
              <MenuItem value="indigo">Indigo Theme</MenuItem>
              <MenuItem value="emerald">Emerald Theme</MenuItem>
              <MenuItem value="sky">Sky Theme</MenuItem>
              <MenuItem value="rose">Rose Theme</MenuItem>
              <MenuItem value="sunset">Sunset Theme</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Rendering Active Tab Content */}
      <Box sx={{ mt: 1 }}>
        {tabValue === 0 && renderDistributions()}
        {tabValue === 1 && renderCategorical()}
        {hasLineChart && tabValue === 2 && renderTrends()}
        {tabValue === (hasLineChart ? 3 : 2) && renderRelationships()}
        {tabValue === (hasLineChart ? 4 : 3) && renderHeatmap()}
      </Box>
    </Box>
  );
};

export default Charts;