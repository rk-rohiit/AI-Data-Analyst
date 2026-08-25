
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-68A063?style=for-the-badge&logo=express)
![Pandas](https://img.shields.io/badge/Pandas-2.x-0D28A6?style=for-the-badge&logo=pandas)
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python)
![Docker](https://img.shields.io/badge/Docker-Community-2496ED?style=for-the-badge&logo=docker)

## 🚀 Executive Summary

**AI Data Analyst** is a cutting-edge, containerized data science platform that transforms complex datasets into actionable business intelligence using Artificial Intelligence. It eliminates the traditional barriers between data analysis and software engineering by providing a seamless, end-to-end workflow: from raw CSV upload to interactive visualizations, all powered by a production-grade FastAPI backend and a state-of-the-art AI analysis pipeline.

### 🔹 What It Does

This application solves the critical challenge of **data accessibility** and **interpretation**. Users can:
- Upload large CSV datasets (or simulate data for testing)
- Instantly generate comprehensive statistical summaries
- Receive intelligent, human-readable insights derived from data patterns
- Explore complex data through automated visualizations (histograms, scatter plots, correlation matrices)
- Collaborate with AI agents that automate tedious data wrangling tasks

---

## 📋 Key Features

### 🎯 Intelligent Data Processing
- **Auto-Detection Engine**: Automatically identifies column types (Numeric/Categorical) and infers optimal parsing strategies (delimiters, encodings).
- **Smart Cleaning Pipeline**: Eliminates duplicate rows, normalizes whitespace, and handles missing values using predictive imputation strategies.
- **Correlation Intelligence**: Calculates the Pearson Correlation Matrix and identifies significant relationships between variables using statistical thresholds.

### 🤖 AI-Powered Insights Engine
- **Natural Language Generation**: Converts complex statistical outputs into clear, concise business insights using large language models.
- **Distribution Analysis**: Automatically detects skewness and kurtosis to understand data distribution shapes.
- **Anomaly Detection**: Identifies outliers in numerical columns that deviate significantly from the mean.

### 🎨 Advanced Data Visualization
- **Dynamic Chart Generation**: Creates professional-grade charts (Histograms, Box Plots, Scatter Plots) tailored to the dataset's structure.
- **Theme Synchronization**: All visualizations automatically adapt to the user's selected theme (Dark/Light Mode).
- **Interactive Charts**: Powered by `react-chartjs-2`, enabling smooth animations and interactive tooltips.

### 🚢 Enterprise Deployment
- **Docker Containerization**: Packaged as a production-ready Docker image for consistent deployment across any environment.
- **Multi-Container Architecture**: Separates the frontend, backend, and AI services for scalability and maintainability.
- **Dev-Ready Setup**: Includes a `docker-compose.yml` file for instantaneous local development with a single command.

---

## 🛠️ Tech Stack

### Frontend (Client Side)
- **Framework**: [React](https://reactjs.org/) (v18+)
- **Language**: [JavaScript (ES6+)](https://www.javascript.com/)
- **UI Library**: [Material UI (MUI)](https://mui.com/) v5 (Customized Theme)
- **Styling**: Styled Components with Emotion, Custom "Glassmorphism" Design System
- **Visualization**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`)

### Backend (Server Side)
- **Runtime**: [Node.js](https://nodejs.org/) (v20+)
- **Framework**: [Express.js](https://expressjs.com/) (v5+)
- **Database**: [MongoDB](https://www.mongodb.com/) (Atlas)
- **File Handling**: [Multer](https://github.com/expressjs/multer)
- **Security**: JWT-based Authentication, Password Hashing (Bcrypt)
- **Validation**: Joi (Schema Validation)

### AI & Data Science (Core Logic)
- **Language**: [Python](https://www.python.org/) (v3.10+)
- **Core Libraries**:
  - [Pandas](https://pandas.pydata.org/): Data manipulation and analysis
  - [NumPy](https://numpy.org/): Numerical operations and arrays
  - [Scikit-learn](https://scikit-learn.org/): Statistical models and algorithms
- **Communication**: RESTful API via HTTP (JSON payload exchange)

### Infrastructure
- **Containerization**: [Docker](https://www.docker.com/)
- **Orchestration**: Docker Compose
- **Cloud**: MongoDB Atlas (External Database-as-a-Service)
- **Deployment**: Single-container deployment with Docker

---

## 🧩 Architecture

The system follows a **Microservices-inspired Monolithic Architecture** where the Frontend and Backend run as separate services but communicate via a well-defined REST API. The Python AI service acts as a specialized microservice invoked by the Backend.

### 📂 Project Structure

```
data-analytics-platform/
├── frontend/               # React Application
│   ├── src/components/     # Reusable UI Components (Charts, Dashboard, Layout)
│   ├── src/services/       # API Client (axios)
│   └── ...
├── backend/                # Node.js + Express Server
│   ├── config/             # Database & Env Config
│   ├── middlewares/        # Authentication, Error Handling
│   ├── routes/             # API Endpoints (/api/auth, /api/data)
│   ├── services/           # Business Logic & AI Invocation
│   └── ...
├── ai/                     # Python AI Service (Pandas/Scikit-learn)
│   ├── ai_processor.py     # Core statistical logic
│   ├── preprocessor.py     # Data cleaning & transformation
│   └── utilities/          # Helper functions
├── docker/                 # Docker configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── Dockerfile.ai
│   └── docker-compose.yml
└── README.md               # Project Documentation (This File)
```

### 🔌 API Integration Flow

1.  **Upload**: User uploads CSV via React Frontend.
2.  **Transfer**: Frontend sends POST request to `/api/data/upload`.
3.  **Processing**:
    - Backend saves the file.
    - Backend calls Python `ai_processor` with file path.
4.  **AI Analysis**:
    - Python reads CSV using Pandas.
    - Runs statistical analysis & generates insights.
    - Returns JSON results to Backend.
5.  **Response**: Backend saves results to MongoDB and returns JSON to Frontend.
6.  **Visualization**: Frontend renders charts using Chart.js.

---

## 💻 Installation & Setup

### Prerequisites
- [Docker](https://www.docker.com/get-started/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.
- MongoDB Atlas Account (if using cloud database).

### Quick Start (Docker Compose)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/AI-Data-Analyst.git
    cd AI-Data-Analyst
    ```

2.  **Update Environment Variables:**
    Copy the example environment file and fill in your credentials:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` with your MongoDB URI, JWT secrets, and backend ports.

3.  **Start the Application:**
    Build and start all services with a single command:
    ```bash
    docker-compose up --build
    ```

4.  **Access the Application:**
    - Open [http://localhost:3000](http://localhost:3000) in your browser.
    - The application will automatically detect the backend on [http://localhost:8000](http://localhost:8000).

### Development (Manual Setup)

**Frontend:**
```bash
cd frontend
npm install
npm start
```
