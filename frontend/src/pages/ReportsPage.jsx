import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { reportAPI } from '../services/api';
import './ReportsPage.css';

function ReportsPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const res = await reportAPI.getTemplates();
    if (res.status === 'success') {
      setTemplates(res.data);
    }
    setLoading(false);
  };

  const handleGenerate = async (template) => {
    const res = await reportAPI.generate({
      reportType: template.type,
      periodStart: '2026-01-01',
      periodEnd: '2026-06-30',
      format: 'json'
    });
    if (res.status === 'success') {
      alert(`Report generated! Total tax liability: ₦${res.data.totalTaxLiability?.toLocaleString()}`);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Statutory Reports</h1>
        <p>Generate and download FIRS-compliant tax returns and reports</p>
      </div>

      <div className="reports-grid">
        {templates.map(template => (
          <div key={template.id} className="report-card card">
            <div className="report-icon">
              <FileText size={32} color="var(--primary)" />
            </div>
            <div className="report-details">
              <h4>{template.name}</h4>
              <div className="report-meta">
                <span><Calendar size={14} /> {template.type}</span>
                <span className="report-status ready">Ready</span>
              </div>
              <p className="report-generated">{template.description}</p>
            </div>
            <div className="report-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => handleGenerate(template)}>
                <Download size={14} /> Generate
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