# AI Data Analyst - Project Overview

An interactive, responsive, and robust data intelligence platform designed to clean, analyze, and visualize datasets (CSV/TSV) automatically. 

---

## 1. What is this Project?

The **AI Data Analyst** is a full-stack web application designed for instant data analysis. Users can upload raw tabular data files, and the platform automatically executes data cleaning, parses statistics, detects outliers and skewness, computes correlation matrices, and generates interactive charts (distributions, categorical breakdowns, scatter plots, and correlation matrices).

### Technology Stack
* **Frontend**: React (with Material-UI for design components, Recharts for responsive visualizations).
* **Backend**: Node.js + Express (for file uploads and routing/payload coordination).
* **AI & Data Engine**: Python (powered by Pandas, Numpy, and Scikit-Learn for separator sniffing, data cleaning, and statistical metrics).

---

## 2. The Problems We Are Solving

1. **Parsing Fragility (Delimiters)**: Standard CSV parsers assume comma separators. If a user uploads a tab-separated (TSV), semicolon-separated, or space-separated file, the parsing breaks and merges columns into a single string.
2. **Poor Data Cleanliness**: Raw datasets often contain leading/trailing whitespaces, numeric columns imported as strings (due to text cells or formatting errors), and missing values (`NaN`), which corrupt visualization render loops.
3. **Infinite Scrolling & Visual Overload**: Displaying a chart for every column on a single page causes browser lag and overwhelming vertical clutter.
4. **Heatmap & Table Layout Breakers**: Standard correlation heatmaps expand to massive horizontal sizes on large datasets, breaking the viewport and requiring horizontal scrolling.
5. **Basic Static Insights**: Traditional dashboards offer simple summaries (e.g., "average age is 41"). They lack deeper data science insights like skewness, outlier boundaries, correlation directions, and category dominance.
6. **Mobile Layout Constraints & Dark Mode**: Layout grids with negative margins bleed past the boundaries of mobile screens. Dashboards lack options to switch to a Dark mode for developer/analyst preference.

---

## 3. Features Implemented

### 📊 Delimiter Sniffing & Data Cleaning
* **Sniffing Parser**: The Python backend sniffs files using Python's raw CSV engine to detect commas, tabs, semicolons, and spaces.
* **Cell & Header Sanitization**: Trims whitespaces from headers and string cells while preserving `NaN` nulls.
* **Auto-Coercion**: Analyzes object/string columns; if a column contains $\ge 80\%$ numbers, it automatically coerces it back to a numeric datatype.

### 🧠 Advanced Statistical AI Insights
* **Outlier Sniffer**: Employs the **IQR (Interquartile Range) Method** to isolate outliers and lists their boundaries.
* **Correlation Evaluator**: Performs Pearson correlation coefficient calculations and highlights moderate-to-strong pairs.
* **Skewness Detector**: Identifies right-skewed and left-skewed distributions based on skew coefficients.
* **Category Dominance**: Flags categorical attributes where a single class represents $\ge 50\%$ of data.

### 🎨 Premium Visualization Tabs & Themes
* **Binned Histograms**: Aggregates continuous numeric columns into 10-bin intervals using `numpy.histogram` for Area/Bar charts.
* **Cardinality-Aware Categorical Charts**: Automatically displays Pie charts for classes with low cardinality (2-6 values) and Bar charts for others.
* **Relationships**: An interactive scatter plot with select dropdowns to compare any two numeric columns.
* **Correlation Heatmap**: Colored interactive grid showing coefficients from `-1` (blue) to `+1` (red) with micro-scale animations on cell hover.
* **Palette Switcher**: Instantly swaps themes between **Indigo**, **Emerald**, **Sky**, **Rose**, and **Sunset** palettes.
* **Export Controls**: Direct SVG exports for charts and CSV exports for binned data.

### 🌐 Scalability & Layout Optimizations
* **Heatmap Selector**: Restricts heatmap matrices to a toggled active checklist when there are more than 5 numeric variables, preserving mobile responsiveness.
* **Paging & Column Filters**: Dropdown variable filter tabs and search filters collapse pages containing large columns.
* **Formatted Statistics**: Truncates standard float numbers to 2 decimal places to avoid horizontal table overflows.

### ⚙️ SaaS Sidebar Layout & Light/Dark Mode
* **Light/Dark Theme Toggles**: A Sun/Moon icon in the top header transitions the entire app's backgrounds, typography, charts, and loaders into a dark color palette.
* **Lock Indicators**: Dashboard controls remain padlocked and inactive until a dataset is successfully processed.
* **Responsive Sidebar Drawer**: Sidebar remains permanently displayed on desktop viewports and transitions to a sliding overlay on mobile viewports.
* **Thematic Animated Upload Screen**: Particle glow backdrops, scanning laser sweep, neural grid animations, and multi-step loaders cycle through analysis milestones.
