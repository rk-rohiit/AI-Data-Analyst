import { Card, CardContent, Typography, Grid } from "@mui/material";

const Insights = ({ insights }) => {
  if (!insights) return null;

  return (
    <Grid container spacing={2} mt={2}>
      {insights.map((text, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card>
            <CardContent>
              <Typography variant="body1">
                💡 {text}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Insights;