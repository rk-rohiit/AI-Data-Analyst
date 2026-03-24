import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";

const Dashboard = ({ data }) => {

  if (!data) return null;

  const Stat = ({ label, value }) => (
  <Box
    sx={{
      p: 1,
      borderRadius: 2,
      bgcolor: "#f8fafc",
      textAlign: "center",
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value ?? "N/A"}
    </Typography>
  </Box>
);

  return (
    <Box mt={4} px={{ xs: 2, md: 4 }}>
      <Grid container spacing={3}>

        {/* 🔥 Top Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Rows
              </Typography>
              <Typography variant="h3" color="primary">
                {data.rows}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Columns
              </Typography>
              <Typography variant="h3" color="primary">
                {data.columns}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 🧠 Column Insights */}
       <Grid item xs={12}>
  <Typography variant="h5" mb={2}>
    Column Insights
  </Typography>

  <Grid container spacing={3}>
    {Object.entries(data.summary).map(([col, stats]) => {
      const isNumeric = stats.mean !== "";

      return (
        <Grid item xs={12} sm={6} md={4} key={col}>
          <Card
            sx={{
              transition: "0.3s",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent>

              {/* 🔝 Column Name */}
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
              >
                {col}
              </Typography>

              {/* 🔹 Type Badge */}
              <Box mb={1}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "12px",
                    bgcolor: isNumeric ? "#e0f2fe" : "#fef3c7",
                    color: isNumeric ? "#0369a1" : "#92400e",
                    fontWeight: 500,
                  }}
                >
                  {isNumeric ? "Numeric" : "Categorical"}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* 🔢 Numeric Stats */}
              {isNumeric ? (
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                  <Stat label="Mean" value={stats.mean} />
                  <Stat label="Std" value={stats.std} />
                  <Stat label="Min" value={stats.min} />
                  <Stat label="Max" value={stats.max} />
                </Box>
              ) : (
                <Box>
                  <Stat label="Unique" value={stats.unique} />
                  <Stat label="Top" value={stats.top} />
                  <Stat label="Freq" value={stats.freq} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      );
    })}
  </Grid>
</Grid>

        {/* 📋 Column Names */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Column Names
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={1}>
                {data.column_names.map((col, i) => (
                  <Chip
                    key={i}
                    label={col}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;