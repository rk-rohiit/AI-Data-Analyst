import { Container, Typography, Box, Divider } from "@mui/material";
import { useState } from "react";
import FileUpload from "./components/FileUpload";
import Dashboard from "./components/Dashboard";

function App() {
  const [data, setData] = useState(null);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      
      <Container maxWidth="lg">

        {/* 🔝 Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={600}>
            AI Data Analyst
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Upload your dataset and get instant insights
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 📂 Upload Section */}
        <FileUpload setData={setData} />

        {/* 📊 Dashboard Section */}
        {data && (
          <>
            <Divider sx={{ my: 4 }} />
            <Dashboard data={data} />
          </>
        )}

      </Container>
    </Box>
  );
}

export default App;