# 💎 KFT — Khalid Finance Tracker

A personal finance dashboard built with React + Vite. Track daily expenses, monitor monthly trends, visualize annual performance, and stay on course for your **House Loan Break-Even** goal.

---

## ✨ Features

| Page | What it does |
|---|---|
| **Dashboard** | Goal progress, KPI cards, 30-day trend, recent transactions |
| **Daily Register** | Log & delete transactions by day, budget status |
| **Monthly Stats** | Category bar chart, daily line, expense pie, full transaction list |
| **Annual Stats** | Performance score, income vs expense bar, cumulative savings, goal timeline |
| **Assets** | Full CRUD for all investments & assets, allocation pie, type breakdown |
| **Settings** | Configure income, goal, house loan, add/remove categories |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/khalid-finance-tracker.git
cd khalid-finance-tracker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# App runs at http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output is in ./dist — ready to deploy to GitHub Pages, Netlify, etc.
```

---

## 🎨 Design

- **Black background** with **neon pink** (`#FF2D78`) and **sky blue** (`#00D4FF`) LED accents
- **Orbitron** font for numbers and headings
- **Inter** for UI text
- Glass-morphism cards with glowing neon borders
- All data persists in **localStorage** — no backend needed

---

## 📊 Pre-loaded Data

The app comes pre-populated with a real financial profile:

| Item | Value |
|---|---|
| Monthly Salary | 31,100 SAR |
| Villa Rental Income | 6,667 SAR/mo |
| House Loan Installment | 6,981.54 SAR/mo |
| Car Loan | 3,477.35 SAR/mo |
| Total Assets Tracked | 683,310 SAR |
| Goal | House Loan Break-Even (2,024,647 SAR) |

---

## 🗂️ Project Structure

```
src/
├── context/
│   └── FinanceContext.jsx   # Global state + localStorage
├── data/
│   └── seedData.js          # Pre-loaded profile data
├── utils/
│   └── helpers.js           # Formatters, constants
├── components/
│   ├── Sidebar.jsx
│   └── Modal.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── DailyRegister.jsx
│   ├── MonthlyStats.jsx
│   ├── AnnualStats.jsx
│   ├── Assets.jsx
│   └── Settings.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## 📦 Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

---

*Built for personal financial clarity — track, understand, grow.* 💪
