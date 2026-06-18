# 🎓 LPU TGPA & CGPA Calculator

A modern, high-performance, and visually stunning Academic GPA Console tailored to the standards of Lovely Professional University (LPU). Built with React 19, Vite, and custom Tailwind CSS utility styling, it features a responsive, premium glassmorphism dark-mode UI with animated background elements.

---

## ✨ Features

- **Dual Entry Modes**:
  - **By Marks (0-100)**: Estimate grade points from marks when you want a quick marks-based calculation.
  - **By Grade**: Estimate TGPA/CGPA from expected LPU letter grades, which best matches LPU's relative grading system.
  - **LPU Grade Points**: Supports O, A+, A, B+, B, C, D, E, F, G, and I with the official 10/9/8/7/6/5/4/0 point mapping.
- **Dynamic Semesters & Subjects**: Configure and generate up to 8 semesters and 1 to 10 subjects per semester dynamically.
- **Robust Custom Inputs**: Features custom text-based inputs with `inputMode="decimal"` to prevent annoying browser-native behaviors, such as unexpected value changes from scroll wheels, arrow keys, or native validation snapping to `1`.
- **Interactive Analytics Panels** (Chart.js):
  - **CGPA Progress**: Visualizes your semester-wise TGPA progress with a smooth, interactive line chart.
  - **Grade Distribution**: Displays a breakdown of your achieved grades in a modern doughnut chart.
- **Academic Summary Dashboard**: Tracks real-time statistics including *Total Credits*, *Total Subjects*, *Highest TGPA*, and *Lowest TGPA*.
- **Premium Glassmorphism Design**: High-fidelity dark mode with dynamic, floating backdrop glowing blobs and micro-animations.
- **Toast Alerts**: Built-in sleek toast notification console for calculations and errors.

## Calculation Notes

TGPA and CGPA are calculated from credit-weighted grade points:

```text
sum(grade point x subject credit) / sum(subject credit)
```

CGPA is calculated across all subjects and credits entered so far. It is not the average of semester TGPAs.

---

## 🛠️ Technology Stack

- **Core**: React 19 (Hooks, Context, State Management)
- **Bundler**: Vite
- **Styling**: Tailwind CSS (via Tailwind Play CDN config)
- **Charts**: Chart.js
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Outfit (display) & Inter (body) via Google Fonts

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v16.x or higher recommended).

### Running Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/amritraj006/CGPA-CALCULATOR-FOR-LPU.git
   cd CGPA-CALCULATOR-FOR-LPU
   ```

2. **Navigate to the Client Directory**:
   ```bash
   cd client
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open the App**:
   Navigate to the URL printed in the terminal (usually `http://localhost:5173/`).

---

## 🏗️ Production Build

To build the optimized static assets for production:

```bash
cd client
npm run build
```

This compiles your code and outputs optimized production assets in the `client/dist/` directory.

---

## ☁️ Deployment (Vercel)

This repository is optimized for quick hosting on [Vercel](https://vercel.com).

### Deployment Guide:
1. Push your repository fork to GitHub.
2. Link your GitHub account to Vercel.
3. Import the repository in Vercel.
4. **Important**: In the configuration panel, set the **Root Directory** to `client`.
5. Vercel will auto-detect **Vite** and configure the build settings.
6. Click **Deploy**.

*A `vercel.json` file is pre-configured in `client/` to handle single-page routing flawlessly.*
