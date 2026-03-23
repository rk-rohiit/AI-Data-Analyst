import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadFile } from "../services/api";

const FileUpload = ({ setData }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadFile(formData);
      setData(res.data.analysis);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h5" mb={2}>
        Upload CSV File
      </Typography>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <Box mt={2}>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleUpload}
        >
          Upload & Analyze
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;