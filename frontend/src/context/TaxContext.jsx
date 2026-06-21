import React, { createContext, useContext, useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';

const TaxContext = createContext();

export function TaxProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'Tax Filing Submitted', user: 'Admin User', timestamp: '2026-06-21 14:30:22', ip: '192.168.1.45' },
    { id: 2, action: 'Data Extracted from Legacy DB', user: 'System', timestamp: '2026-06-21 13:15:00', ip: '192.168.1.1' },
    { id: 3, action: 'Report Generated', user: 'Admin User', timestamp: '2026-06-21 11:45:10', ip: '192.168.1.45' },
  ]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  const fetchTransactions = async () => {
    const res = await transactionAPI.getAll();
    if (res.status === 'success') {
      setTransactions(res.data);
    }
  };

  const fetchStats = async () => {
    const res = await transactionAPI.getStats();
    if (res.status === 'success') {
      setStats(res.data);
    }
  };

  const addTransaction = async (transaction) => {
    const res = await transactionAPI.create(transaction);
    if (res.status === 'success') {
      setTransactions([res.data, ...transactions]);
      return true;
    }
    return false;
  };

  const addAuditLog = (action, user, ip = '192.168.1.45') => {
    const log = {
      id: Date.now(),
      action,
      user,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ip
    };
    setAuditLogs([log, ...auditLogs]);
  };

  return (
    <TaxContext.Provider value={{ transactions, auditLogs, stats, addTransaction, addAuditLog, fetchTransactions }}>
      {children}
    </TaxContext.Provider>
  );
}

export function useTax() {
  return useContext(TaxContext);
}