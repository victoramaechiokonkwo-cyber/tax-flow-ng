const API_BASE = 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  return response.json();
};

// Auth APIs
export const authAPI = {
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (data) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getMe: () => apiRequest('/auth/me')
};

// Tax APIs
export const taxAPI = {
  calculate: (data) => apiRequest('/tax/calculate', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getCalculations: () => apiRequest('/tax/calculations')
};

// Transaction APIs
export const transactionAPI = {
  getAll: (params = '') => apiRequest(`/transactions?${params}`),
  create: (data) => apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getStats: () => apiRequest('/transactions/stats')
};

// Report APIs
export const reportAPI = {
  generate: (data) => apiRequest('/reports/generate', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getTemplates: () => apiRequest('/reports/templates')
};

// Extraction APIs
export const extractionAPI = {
  getConnections: () => apiRequest('/extraction/connections'),
  testConnection: (id) => apiRequest(`/extraction/test/${id}`, { method: 'POST' }),
  runExtraction: (id, data) => apiRequest(`/extraction/run/${id}`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
};