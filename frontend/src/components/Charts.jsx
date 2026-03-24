import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Typography, Grid, Box } from "@mui/material";

const Charts = ({ charts }) => {
  if (!charts || Object.keys(charts).length === 0) return null;

  return (
    <Grid container spacing={3}>
      {Object.entries(charts).map(([col, chart]) => {
        if (chart.type === "bar") {
          const data = chart.labels.map((label, i) => ({
            name: label,
            value: chart.values[i],
          }));

          return (
            <Grid item xs={12} sm={6} md={6} key={col}>
              <Card
                sx={{
                  borderRadius: 3,
                  p: 2,
                  height: "100%",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <Typography variant="h6" mb={2}>
                  {col}
                </Typography>

                <Box sx={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#6366f1"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          );
        }

        return null;
      })}
    </Grid>
  );
};

export default Charts;