import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Dashboard     from './pages/Dashboard';
import DailyRegister from './pages/DailyRegister';
import MonthlyStats  from './pages/MonthlyStats';
import AnnualStats   from './pages/AnnualStats';
import Assets        from './pages/Assets';
import Settings      from './pages/Settings';

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <div className="layout">
          <Sidebar />
          <main className="main">
            <Routes>
              <Route path="/"        element={<Dashboard />}     />
              <Route path="/daily"   element={<DailyRegister />} />
              <Route path="/monthly" element={<MonthlyStats />}  />
              <Route path="/annual"  element={<AnnualStats />}   />
              <Route path="/assets"  element={<Assets />}        />
              <Route path="/settings"element={<Settings />}      />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </FinanceProvider>
  );
}
