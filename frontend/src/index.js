import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TaxProvider } from './context/TaxContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <TaxProvider>
        <App />
      </TaxProvider>
    </AuthProvider>
  </React.StrictMode>
);