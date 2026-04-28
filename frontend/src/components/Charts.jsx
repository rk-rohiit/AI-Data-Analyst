import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import { Grid, Box, Typography } from "@mui/material";

const Charts = ({ charts }) => {
  // 1. Debugging: Check your console to see if 'charts' is actually reaching this component
  console.log("Charts Component Received:", charts);

  if (!charts || Object.keys(charts).length === 0) {
    return (
      <Box p={4} textAlign="center" border="1px dashed #ccc" borderRadius={4}>
        <Typography color="text.secondary">No visualization data available.</Typography>
      </Box>
    );
  }

  const colors = ["#4f46e5", "#06b6d4", "#8b5cf6", "#ec4899", "#10b981"];

  return (
    <Grid container spacing={4}>
      {Object.entries(charts).map(([col, chart], index) => {
        // 2. Safety Check: Ensure labels and values exist
        const labels = chart?.labels || [];
        const values = chart?.values || [];

        // 3. Transform data for Recharts
        const data = labels.map((label, i) => ({
          name: String(label),
          value: Number(values[i]) || 0,
        }));

        // Skip rendering if there's no data for this specific column
        if (data.length === 0) return null;

        return (
          <Grid item xs={12} md={6} key={col}>
            <Box sx={{ width: "100%" }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: "block", 
                  mb: 1, 
                  fontWeight: 700, 
                  color: "#64748b", 
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}
              >
                {col.replace(/_/g, " ")}
              </Typography>
              
              {/* 4. KEY FIX: The parent of ResponsiveContainer MUST have a fixed height */}
              <Box sx={{ width: "100%", height: 300, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      interval={0} // Forces all labels to show
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 10 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{ 
                        borderRadius: "8px", 
                        border: "none", 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: "12px"
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]} 
                      barSize={Math.min(40, 200 / data.length)} // Adjusts bar width dynamically
                    >
                      {data.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Charts;