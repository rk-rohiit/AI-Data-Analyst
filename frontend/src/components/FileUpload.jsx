import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { uploadFile } from "../services/api";

const FileUpload = ({ setData }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await uploadFile(formData);
      setData(res.data.analysis);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
          textAlign: "center",
          border: "2px dashed #e2e8f0",
          borderRadius: 4,
          bgcolor: "background.paper",
        }}
      >
        {/* Title */}
        <Typography variant="h5" gutterBottom>
          Upload Dataset
        </Typography>

        <Typography variant="body2" mb={3}>
          Upload your CSV file to analyze data and generate insights
        </Typography>

        {/* Hidden Input */}
        <input
          type="file"
          accept=".csv"
          id="file-upload"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Upload Area */}
        <label htmlFor="file-upload">
          <Box
            sx={{
              cursor: "pointer",
              p: 3,
              borderRadius: 3,
              bgcolor: "#f1f5f9",
              "&:hover": { bgcolor: "#e2e8f0" },
            }}
          >
            <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography mt={1}>
              Click to select CSV file
            </Typography>
          </Box>
        </label>

        {/* Selected File */}
        {file && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            mt={2}
            justifyContent="center"
          >
            <InsertDriveFileIcon color="primary" />
            <Typography variant="body2">{file.name}</Typography>
          </Stack>
        )}

        {/* Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          fullWidth
          onClick={handleUpload}
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Uploading..." : "Upload & Analyze"}
        </Button>
      </Paper>
    </Box>
  );
};

export default FileUpload;