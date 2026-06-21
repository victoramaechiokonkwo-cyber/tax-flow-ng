import React, { useState, useEffect } from 'react';
import { useTax } from '../context/TaxContext';
import { Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { transactionAPI } from '../services/api';
import './TransactionPage.css';

function TransactionPage() {
  const { transactions, fetchTransactions } = useTax();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newTx, setNewTx] = useState({ type: 'VAT', amount: '', taxpayer: '', status: 'pending', taxpayerTIN: '1234567890' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.status === filter);

  const handleAdd = async () => {
    setLoading(true);
    const success = await addTransaction({
      ...newTx,
      amount: parseFloat(newTx.amount),
      taxLiability: parseFloat(newTx.amount) * 0.075,
      taxRate: 7.5,
      assessmentYear: 2026,
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2026-06-30'),
      dueDate: new Date('2026-07-21')
    });
    setLoading(false);
    if (success) {
      setShowModal(false);
      setNewTx({ type: 'VAT', amount: '', taxpayer: '', status: 'pending', taxpayerTIN: '1234567890' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Transactions</h1>
        <p>View and manage all tax transactions and filings</p>
      </div>

      <div className="tx-toolbar">
        <div className="tx-search">
          <Search size={18} />
          <input type="text" placeholder="Search by taxpayer or ID..." />
        </div>
        <div className="tx-filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'filed' ? 'active' : ''}`} onClick={() => setFilter('filed')}>Filed</button>
          <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
          <button className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`} onClick={() => setFilter('overdue')}>Overdue</button>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Transaction
        </button>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Taxpayer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx._id || tx.id}>
                <td>#{tx.transactionId || tx.id?.toString().padStart(5, '0')}</td>
                <td className="fw-bold">{tx.taxpayer}</td>
                <td><span className="tax-type-badge">{tx.taxType || tx.type}</span></td>
                <td className="fw-bold">₦{(tx.amount || 0).toLocaleString()}</td>
                <td>{new Date(tx.createdAt || tx.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-pill ${tx.status}`}>{tx.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn view"><Eye size={16} /></button>
                    <button className="icon-btn edit"><Edit size={16} /></button>
                    <button className="icon-btn delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>New Transaction</h3>
            <div className="form-group">
              <label>Tax Type</label>
              <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value})}>
                <option>VAT</option>
                <option>CIT</option>
                <option>PAYE</option>
                <option>WHT</option>
              </select>
            </div>
            <div className="form-group">
              <label>Taxpayer Name</label>
              <input value={newTx.taxpayer} onChange={e => setNewTx({...newTx, taxpayer: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Amount (₦)</label>
              <input type="number" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
                {loading ? 'Saving...' : 'Save Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionPage;