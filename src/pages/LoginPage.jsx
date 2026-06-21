import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail } from 'lucide-react';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      navigate('/dashboard');
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-branding">
          <div className="login-logo">₦</div>
          <h1>Tax-Flow NG</h1>
          <p>Data Reporting & Taxation System for Legacy Institutions</p>
        </div>
        <div className="login-features">
          <div className="feature">
            <Shield size={24} />
            <span>FIRS Compliant Reporting</span>
          </div>
          <div className="feature">
            <Lock size={24} />
            <span>Secure Data Extraction</span>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p>Sign in to access the taxation dashboard</p>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@firs.gov.ng"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon">
                <Lock size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="login-options">
              <label className="remember">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#forgot">Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary login-btn">
              Sign In to Dashboard
            </button>
          </form>
          <div className="login-footer">
            <p>Protected by FIRS Security Protocols</p>
            <p className="version">v1.0.0 | Legacy Integration Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;