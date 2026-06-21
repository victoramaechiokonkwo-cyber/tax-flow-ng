import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import './ReportsPage.css';

function ReportsPage() {
  const [reports] = useState([
    { id: 1, name: 'Monthly VAT Return (Form 002)', type: 'VAT', period: 'June 2026', generated: '2026-06-21', status: 'ready', size: '245 KB' },
    { id: 2, name: 'Companies Income Tax Return', type: 'CIT', period: 'FY 2025/2026', generated: '2026-06-20', status: 'ready', size: '1.2 MB' },
    { id: 3, name: 'PAYE Remittance Schedule', type: 'PAYE', period: 'June 2026', generated: '2026-06-19', status: 'ready', size: '890 KB' },
    { id: 4, name: 'Withholding Tax Summary', type: 'WHT', period: 'Q2 2026', generated: '2026-06-18', status: 'draft', size: '456 KB' },
    { id: 5, name: 'Audit Trail Report', type: 'System', period: 'June 2026', generated: '2026-06-21', status: 'ready', size: '120 KB' },
  ]);

  return (
    <div>
      <div className="page-header">
        <h1>Statutory Reports</h1>
        <p>Generate and download FIRS-compliant tax returns and reports</p>
      </div>

      <div className="reports-toolbar">
        <div className="report-filters">
          <button className="filter-chip active">All Reports</button>
          <button className="filter-chip">VAT</button>
          <button className="filter-chip">CIT</button>
          <button className="filter-chip">PAYE</button>
          <button className="filter-chip">WHT</button>
        </div>
        <button className="btn btn-primary">
          <FileText size={18} /> Generate New Report
        </button>
      </div>

      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card card">
            <div className="report-icon">
              <FileText size={32} color="var(--primary)" />
            </div>
            <div className="report-details">
              <h4>{report.name}</h4>
              <div className="report-meta">
                <span><Calendar size={14} /> {report.period}</span>
                <span className={`report-status ${report.status}`}>{report.status}</span>
              </div>
              <p className="report-generated">Generated: {report.generated} • {report.size}</p>
            </div>
            <div className="report-actions">
              <button className="btn btn-secondary btn-sm">
                <Download size={14} /> Download
              </button>
              <button className="btn btn-primary btn-sm">Preview</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginTop: '24px'}}>
        <h3 className="section-title">FIRS Submission Status</h3>
        <div className="submission-tracker">
          <div className="track-step completed">
            <div className="track-dot">✓</div>
            <span>Data Validation</span>
          </div>
          <div className="track-line"></div>
          <div className="track-step completed">
            <div className="track-dot">✓</div>
            <span>Tax Computation</span>
          </div>
          <div className="track-line"></div>
          <div className="track-step active">
            <div className="track-dot">3</div>
            <span>Report Generation</span>
          </div>
          <div className="track-line"></div>
          <div className="track-step">
            <div className="track-dot">4</div>
            <span>FIRS e-Filing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;