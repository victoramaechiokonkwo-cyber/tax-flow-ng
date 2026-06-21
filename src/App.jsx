import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import TaxCalculatorPage from './pages/TaxCalculatorPage';
import TaxModulesPage from './pages/TaxModulesPage';
import TransactionPage from './pages/TransactionPage';
import DataExtractionPage from './pages/DataExtractionPage';
import ReportsPage from './pages/ReportsPage';
import AuditTrail from './pages/AuditTrail';
import SettingsPage from './pages/SettingsPage';
import { useAuth } from './context/AuthContext';
import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tax-calculator" element={<TaxCalculatorPage />} />
                  <Route path="/tax-modules" element={<TaxModulesPage />} />
                  <Route path="/transactions" element={<TransactionPage />} />
                  <Route path="/data-extraction" element={<DataExtractionPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/audit-trail" element={<AuditTrail />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;