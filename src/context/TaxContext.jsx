import React, { createContext, useContext, useState } from 'react';

const TaxContext = createContext();

export function TaxProvider({ children }) {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'VAT', amount: 125000, date: '2026-06-15', status: 'filed', taxpayer: 'ABC Ltd' },
    { id: 2, type: 'PAYE', amount: 450000, date: '2026-06-14', status: 'pending', taxpayer: 'XYZ Corp' },
    { id: 3, type: 'CIT', amount: 890000, date: '2026-06-12', status: 'filed', taxpayer: 'Delta Enterprises' },
    { id: 4, type: 'WHT', amount: 67000, date: '2026-06-10', status: 'overdue', taxpayer: 'Beta Services' },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'Tax Filing Submitted', user: 'Admin User', timestamp: '2026-06-21 14:30:22', ip: '192.168.1.45' },
    { id: 2, action: 'Data Extracted from Legacy DB', user: 'System', timestamp: '2026-06-21 13:15:00', ip: '192.168.1.1' },
    { id: 3, action: 'Report Generated', user: 'Admin User', timestamp: '2026-06-21 11:45:10', ip: '192.168.1.45' },
  ]);

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
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
    <TaxContext.Provider value={{ transactions, auditLogs, addTransaction, addAuditLog }}>
      {children}
    </TaxContext.Provider>
  );
}

export function useTax() {
  return useContext(TaxContext);
}