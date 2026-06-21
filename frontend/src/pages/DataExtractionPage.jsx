import React, { useState, useEffect } from 'react';
import { Database, Play, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { extractionAPI } from '../services/api';
import './DataExtractionPage.css';

function DataExtractionPage() {
  const [connections, setConnections] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const res = await extractionAPI.getConnections();
    if (res.status === 'success') {
      setConnections(res.data);
    }
  };

  const runExtraction = async (connectionId) => {
    setExtracting(true);
    setProgress(0);
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: 'Starting ETL pipeline...', type: 'info' }]);
    
    const res = await extractionAPI.runExtraction(connectionId, {
      targetTaxModule: 'all',
      dateRange: { start: '2026-01-01', end: '2026-06-30' }
    });

    if (res.status === 'success') {
      setProgress(100);
      setLogs(prev => [...prev, 
        { time: new Date().toLocaleTimeString(), message: `Extracted ${res.data.extractedRecords} records`, type: 'success' },
        { time: new Date().toLocaleTimeString(), message: `Created ${res.data.createdTransactions} transactions`, type: 'success' }
      ]);
    }
    setExtracting(false);
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
              <div key={conn._id} className="connection-item">
                <div className="conn-info">
                  <FileSpreadsheet size={20} color="var(--primary)" />
                  <div>
                    <p className="conn-name">{conn.name}</p>
                    <p className="conn-meta">{conn.connectionType} • Last sync: {conn.lastSync ? new Date(conn.lastSync).toLocaleString() : 'Never'}</p>
                  </div>
                </div>
                <span className={`conn-status ${conn.status}`}>{conn.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title"><Play size={20} /> ETL Pipeline</h3>
          <div className="etl-config">
            <div className="form-group">
              <label>Source Database</label>
              <select>
                {connections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            style={{width: '100%', marginTop: '16px', justifyContent: 'center'}}
            onClick={() => connections[0] && runExtraction(connections[0]._id)}
            disabled={extracting || connections.length === 0}
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