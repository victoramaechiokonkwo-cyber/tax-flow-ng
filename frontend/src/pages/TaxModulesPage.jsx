import React from 'react';
import { FileText, Users, ShoppingCart, Briefcase } from 'lucide-react';
import './TaxModulesPage.css';

function TaxModulesPage() {
  const modules = [
    {
      id: 'CIT',
      title: 'Companies Income Tax',
      description: 'Automated computation of corporate tax liabilities based on audited financial statements and capital allowances.',
      icon: <Briefcase size={32} />,
      color: '#1a5f2a',
      stats: { filings: '2,401', revenue: '₦890M' },
      features: ['Automated profit adjustment', 'Capital allowance scheduler', 'Loss carry-forward tracker', 'FIRS e-filing integration']
    },
    {
      id: 'VAT',
      title: 'Value Added Tax',
      description: 'Track input and output VAT across all taxable supplies. Generate monthly VAT returns in FIRS-compliant format.',
      icon: <ShoppingCart size={32} />,
      color: '#d4af37',
      stats: { filings: '5,672', revenue: '₦1.2B' },
      features: ['Input/Output VAT reconciliation', 'Multi-rate support', 'Auto-generated Form 002', 'Supplier VAT verification']
    },
    {
      id: 'PAYE',
      title: 'Pay As You Earn',
      description: 'Calculate employee income tax deductions using Nigeria progressive tax tables. Generate monthly remittance schedules.',
      icon: <Users size={32} />,
      color: '#2c3e50',
      stats: { filings: '8,901', revenue: '₦450M' },
      features: ['Progressive tax tables', 'Consolidated relief allowance', 'Monthly remittance schedule', 'Employee tax card generation']
    },
    {
      id: 'WHT',
      title: 'Withholding Tax',
      description: 'Manage WHT on contracts, dividends, interest, and rent. Auto-generate WHT credit notes for suppliers.',
      icon: <FileText size={32} />,
      color: '#e67e22',
      stats: { filings: '1,234', revenue: '₦67M' },
      features: ['Contract WHT calculator', 'Dividend/Interest tracking', 'WHT credit note generation', 'Annual reconciliation report']
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Tax Modules</h1>
        <p>Manage all Nigerian tax types from a unified dashboard</p>
      </div>

      <div className="modules-grid">
        {modules.map(module => (
          <div key={module.id} className="module-card card">
            <div className="module-header" style={{ borderLeft: `4px solid ${module.color}` }}>
              <div className="module-icon" style={{ background: `${module.color}15`, color: module.color }}>
                {module.icon}
              </div>
              <div className="module-title-group">
                <h3>{module.title}</h3>
                <span className="module-id">{module.id}</span>
              </div>
            </div>
            <p className="module-desc">{module.description}</p>
            <div className="module-stats">
              <div className="m-stat">
                <span className="m-stat-value">{module.stats.filings}</span>
                <span className="m-stat-label">Filings</span>
              </div>
              <div className="m-stat">
                <span className="m-stat-value">{module.stats.revenue}</span>
                <span className="m-stat-label">Revenue</span>
              </div>
            </div>
            <div className="module-features">
              {module.features.map((feat, idx) => (
                <span key={idx} className="feature-tag">{feat}</span>
              ))}
            </div>
            <div className="module-actions">
              <button className="btn btn-primary">Open Module</button>
              <button className="btn btn-secondary">View Guide</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaxModulesPage;