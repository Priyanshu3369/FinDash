# FinDash - Modern Finance Dashboard

A comprehensive, fully responsive, and highly interactive finance dashboard web application built with modern React.

## 🚀 Overview of Approach

FinDash was developed with a focus on **Visual Excellence**, **Performance**, and **Maintainability**. 

### Architecture & Tech Stack
- **Framework**: Built with React 19 and Vite for blazingly fast HMR and optimized production builds.
- **State Management**: Uses the built-in React Context API along with `useReducer` to manage the global state (transactions, user roles, active filters, and theme preferences). State is automatically persisted to `localStorage`.
- **Styling Strategy**: 
  - Uses **Tailwind CSS v4** for utility classes where appropriate.
  - Implements a unified, central CSS variable system (`--c-*`) in `index.css`. This enables instant, CSS-only light/dark mode switching without relying on React element re-renders for color changes.
  - Component-specific scoped styling is injected via standard `<style>` blocks alongside the `.jsx` files, allowing components to remain highly portable and easy to maintain.
- **Routing**: `react-router-dom` handles client-side page transitions.
- **Data Visualization**: `recharts` is heavily utilized to present beautiful, theme-aware visualizations.

## ✨ Key Features

1. **Dashboard Overview**
   - High-level financial summaries (Net Balance, Income, Expenses).
   - "Balance Trend" area chart showing historical data.
   - "Expense Breakdown" donut chart showing category distribution.
   - Recent Transactions activity feed.

2. **Transaction Management (CRUD)**
   - Complete grid showing all financial activity.
   - **Search, Filter, and Sort**: Find transactions dynamically by text, category, or type.
   - **Role-based Access Control**: 
     - *Admin*: Can Add, Edit, and Delete transactions.
     - *Viewer*: Read-only access to data.
   - Export Data to CSV and JSON formats directly to your machine.

3. **Spending Insights**
   - Deep-dive metrics including Top Spending categories and Savings rate analysis.
   - Visual Month-over-Month comparison progress bars.
   - Bar chart breakdown of individual spending categories.
   - AI-style quick observations based on the current user data.

4. **Premium UI/UX**
   - **Full Responsiveness**: Adapts dynamically from ultra-wide monitors down to standard mobile phones. Complete with a retractable sliding sidebar and mobile hamburger menus.
   - **Flawless Theme Toggle**: Seamless transitioning between beautifully balanced Light and Dark modes.
   - **Micro-interactions**: Hover effects, smooth dropdowns (like the mock notification center), tooltips, and loading skeletons ensure the interface feels alive and engaging.

## 💻 Setup Instructions

To get the project running locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Install Dependencies
Clone the repository, open the project root in your terminal, and install the required NPM packages.

```bash
npm install
```

### 2. Start the Development Server
Run the Vite development server.

```bash
npm run dev
```

The app will typically be available at `http://localhost:5173`. Open this URL in your browser to view the application.

### 3. Build for Production
If you want to build the static, production-ready bundle:

```bash
npm run build
```
This will compile all assets and output them into the `dist` folder.
