import { Container, Typography } from "@mui/material";
import { useState } from "react";
import FileUpload from "./components/FileUpload";
import Dashboard from "./components/Dashboard";

function App() {
  const [data, setData] = useState(null);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" mt={4} textAlign="center">
        🤖 AI Data Analyst
      </Typography>

      <FileUpload setData={setData} />
      <Dashboard data={data} />
    </Container>
  );
}

export default App;