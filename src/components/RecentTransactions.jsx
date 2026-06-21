import React from 'react';
import { useTax } from '../context/TaxContext';
import { Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import './RecentTransactions.css';

function RecentTransactions() {
  const { transactions } = useTax();

  const getStatusIcon = (status) => {
    switch(status) {
      case 'filed': return <CheckCircle size={16} className="status-icon filed" />;
      case 'pending': return <Clock size={16} className="status-icon pending" />;
      case 'overdue': return <AlertCircle size={16} className="status-icon overdue" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      filed: 'badge-success',
      pending: 'badge-warning',
      overdue: 'badge-danger'
    };
    return <span className={`badge ${classes[status]}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="recent-transactions card">
      <div className="section-header">
        <h3>Recent Transactions</h3>
        <button className="btn btn-primary btn-sm">View All</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Taxpayer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map((tx) => (
              <tr key={tx.id}>
                <td>
                  <div className="taxpayer-cell">
                    <div className="taxpayer-avatar">{tx.taxpayer.charAt(0)}</div>
                    <span>{tx.taxpayer}</span>
                  </div>
                </td>
                <td>
                  <span className="tax-type">{tx.type}</span>
                </td>
                <td className="amount">₦{tx.amount.toLocaleString()}</td>
                <td>{tx.date}</td>
                <td>{getStatusBadge(tx.status)}</td>
                <td>
                  <button className="action-btn">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentTransactions;