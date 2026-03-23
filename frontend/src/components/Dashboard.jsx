import { Grid, Card, CardContent, Typography } from "@mui/material";

const Dashboard = ({ data }) => {
  if (!data) return null;

  return (
    <Grid container spacing={3} mt={2}>

      {/* Rows Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6">Total Rows</Typography>
            <Typography variant="h4">{data.rows}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Columns Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6">Total Columns</Typography>
            <Typography variant="h4">{data.columns}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Column Names */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6">Column Names</Typography>
            {data.column_names.map((col, i) => (
              <Typography key={i}>• {col}</Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
};

export default Dashboard;