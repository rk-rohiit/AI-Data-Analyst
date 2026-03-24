import { Grid, Typography, Box, TextField, InputAdornment } from "@mui/material";
import Charts from "../components/Charts";
import Insights from "../components/Insights";
import { useState } from "react";

/* ─── design tokens (light) ─────────────────────────────── */
const T = {
  bg: "#f0f4ff",
  surface: "#ffffff",
  surfaceHover: "#f8faff",
  border: "#e2e8f4",
  borderStrong: "#c7d2fe",
  accent: "#4f46e5",
  accentSoft: "#eef2ff",
  accentMid: "#818cf8",
  warm: "#f59e0b",
  warmSoft: "#fffbeb",
  green: "#059669",
  greenSoft: "#ecfdf5",
  sky: "#0284c7",
  skySoft: "#e0f2fe",
  rose: "#e11d48",
  text: "#0f172a",
  sub: "#334155",
  muted: "#94a3b8",
  faint: "#f8fafc",
};

const font = "'Plus Jakarta Sans', sans-serif";
const mono = "'IBM Plex Mono', monospace";

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
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px ${accent}18`,
          borderColor: `${accent}60`,
        },
      }}
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
          <Pill label="Mean" value={stats.mean} />
          <Pill label="Std" value={stats.std} />
          <Pill label="Min" value={stats.min} />
          <Pill label="Max" value={stats.max} />
        </Box>
      ) : (
        <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={1}>
          <Pill label="Unique" value={stats.unique} />
          <Pill label="Top" value={stats.top} />
          <Pill label="Freq" value={stats.freq} />
        </Box>
      )}
    </Box>
  );
};

/* ─── Dashboard ──────────────────────────────────────────── */
const Dashboard = ({ data }) => {
  const [search, setSearch] = useState("");
  if (!data) return null;

  const filteredPreview = data.preview?.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const numericCols = Object.entries(data.summary).filter(([, s]) => s.mean !== "").length;
  const catCols = Object.entries(data.summary).length - numericCols;

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
          background: `linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a21caf 100%)`,
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
        {/* decorative circles */}
        <Box sx={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -80, left: "30%", width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <Box sx={{ position: "relative", zIndex: 1 }}>
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
            {(data.rows ?? 0).toLocaleString()} rows &nbsp;·&nbsp; {data.columns} columns &nbsp;·&nbsp; {numericCols} numeric &nbsp;·&nbsp; {catCols} categorical
          </Typography>
        </Box>
      </Box>

      {/* ── STAT CARDS (overlap hero) ── */}
      <Box px={{ xs: 2, md: 6 }} mt={-4} mb={5} sx={{ position: "relative", zIndex: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <StatCard title="Total Rows" value={(data.rows ?? 0).toLocaleString()} color={T.accent} softColor={T.accentSoft} icon="⊞" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard title="Total Columns" value={data.columns} color={T.sky} softColor={T.skySoft} icon="⊟" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard title="Features" value={data.column_names.length} color={T.green} softColor={T.greenSoft} icon="◈" />
          </Grid>
        </Grid>
      </Box>

      {/* ── MAIN BODY: two-column layout ── */}
      <Box px={{ xs: 2, md: 6 }}>
        <Grid container spacing={3}>

          {/* LEFT COLUMN — table + column analysis */}
          <Grid item xs={12} lg={7}>
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
                <Grid container spacing={2}>
                  {Object.entries(data.summary).map(([col, stats]) => (
                    <Grid item xs={12} sm={6} key={col}>
                      <ColumnCard col={col} stats={stats} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT COLUMN — charts + insights */}
          <Grid item xs={12} lg={5}>
            <Box display="flex" flexDirection="column" gap={4} sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>

              {/* CHARTS */}
              <Box>
                <SectionLabel icon="📊">Visualizations</SectionLabel>
                <Box
                  sx={{
                    bgcolor: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: "16px",
                    p: { xs: 2, md: 3 },
                    boxShadow: "0 2px 12px rgba(15,23,42,0.07)",
                    "& canvas": { borderRadius: "8px" },
                  }}
                >
                  <Charts charts={data.charts} />
                </Box>
              </Box>

              {/* AI INSIGHTS */}
              {data.insights && (
                <Box>
                  <SectionLabel icon="🤖">AI Insights</SectionLabel>
                  <Box
                    sx={{
                      bgcolor: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 2px 12px rgba(15,23,42,0.07)",
                      position: "relative",
                    }}
                  >
                    {/* colored top strip */}
                    <Box sx={{ height: 3, background: `linear-gradient(90deg, ${T.accent}, ${T.accentMid}, #a78bfa)` }} />
                    <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                      {/* insight header badge */}
                      <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                        <Box sx={{ width: 32, height: 32, borderRadius: "10px", background: `linear-gradient(135deg, ${T.accent}, #7c3aed)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
                          ✦
                        </Box>
                        <Box>
                          <Typography sx={{ fontFamily: font, fontSize: "0.82rem", fontWeight: 700, color: T.text }}>
                            AI-Generated Analysis
                          </Typography>
                          <Typography sx={{ fontFamily: mono, fontSize: "0.6rem", color: T.muted }}>
                            Powered by Claude
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ "& *": { fontFamily: `${font} !important`, color: `${T.sub} !important`, fontSize: "0.875rem !important", lineHeight: "1.7 !important" } }}>
                        <Insights insights={data.insights} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

            </Box>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;