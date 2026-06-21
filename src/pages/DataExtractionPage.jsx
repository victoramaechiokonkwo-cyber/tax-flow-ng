import React, { useState } from 'react';
import { Database, Play, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import './DataExtractionPage.css';

function DataExtractionPage() {
  const [connections, setConnections] = useState([
    { id: 1, name: 'Legacy Oracle DB', type: 'Oracle', status: 'connected', lastSync: '2026-06-21 10:00' },
    { id: 2, name: 'Ministry SQL Server', type: 'MSSQL', status: 'disconnected', lastSync: 'Never' },
    { id: 3, name: 'Excel Ledger Import', type: 'CSV/Excel', status: 'ready', lastSync: '2026-06-20 16:30' },
  ]);

  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([
    { time: '10:00:15', message: 'Connected to Oracle DB (legacy_db_01)', type: 'success' },
    { time: '10:00:22', message: 'Found 14,203 transaction records', type: 'info' },
    { time: '10:00:45', message: 'Schema mapping validated', type: 'success' },
  ]);

  const runExtraction = () => {
    setExtracting(true);
    setProgress(0);
    setLogs([...logs, { time: new Date().toLocaleTimeString(), message: 'Starting ETL pipeline...', type: 'info' }]);
    
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p === 30) setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: 'Extracting financial records...', type: 'info' }]);
      if (p === 60) setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: 'Transforming data to FIRS format...', type: 'info' }]);
      if (p === 90) setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: 'Validating tax computations...', type: 'info' }]);
      if (p >= 100) {
        clearInterval(interval);
        setExtracting(false);
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: 'ETL complete. 1,847 records loaded.', type: 'success' }]);
      }
    }, 400);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Data Extraction</h1>
        <p>Extract, transform, and load financial data from legacy systems</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="section-title"><Database size={20} /> Legacy Connections</h3>
          <div className="connections-list">
            {connections.map(conn => (
              <div key={conn.id} className="connection-item">
                <div className="conn-info">
                  <FileSpreadsheet size={20} color="var(--primary)" />
                  <div>
                    <p className="conn-name">{conn.name}</p>
                    <p className="conn-meta">{conn.type} • Last sync: {conn.lastSync}</p>
                  </div>
                </div>
                <span className={`conn-status ${conn.status}`}>{conn.status}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" style={{width: '100%', marginTop: '16px'}}>
            + Add Connection
          </button>
        </div>

        <div className="card">
          <h3 className="section-title"><Play size={20} /> ETL Pipeline</h3>
          <div className="etl-config">
            <div className="form-group">
              <label>Source Database</label>
              <select>
                <option>Legacy Oracle DB</option>
                <option>Ministry SQL Server</option>
                <option>Excel Ledger Import</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Tax Module</label>
              <select>
                <option>All Modules</option>
                <option>VAT Only</option>
                <option>PAYE Only</option>
                <option>CIT Only</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Range</label>
              <div className="date-range">
                <input type="date" defaultValue="2026-01-01" />
                <span>to</span>
                <input type="date" defaultValue="2026-06-21" />
              </div>
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            style={{width: '100%', marginTop: '16px', justifyContent: 'center'}}
            onClick={runExtraction}
            disabled={extracting}
          >
            <Play size={18} /> {extracting ? 'Extracting...' : 'Run ETL Pipeline'}
          </button>
          
          {extracting && (
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${progress}%`}}></div>
              <span className="progress-text">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{marginTop: '24px'}}>
        <h3 className="section-title">Extraction Logs</h3>
        <div className="logs-container">
          {logs.map((log, idx) => (
            <div key={idx} className={`log-item ${log.type}`}>
              <span className="log-time">{log.time}</span>
              {log.type === 'success' && <CheckCircle size={16} className="log-icon" />}
              {log.type === 'error' && <AlertCircle size={16} className="log-icon" />}
              <span className="log-message">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DataExtractionPage;