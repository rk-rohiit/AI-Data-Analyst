import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/upload', uploadRoutes);

// test route
app.get('/', (req, res) => {
    res.send("API is runing...");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is runing on port: ${PORT}`);
})