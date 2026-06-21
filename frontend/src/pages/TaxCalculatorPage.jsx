import React, { useState } from 'react';
import TaxContainer from '../components/TaxContainer';
import { Calculator, Download } from 'lucide-react';
import { taxAPI } from '../services/api';
import './TaxCalculatorPage.css';

function TaxCalculatorPage() {
  const [taxType, setTaxType] = useState('CIT');
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const taxConfigs = {
    CIT: {
      label: 'Companies Income Tax',
      rate: 0.30,
      fields: [
        { name: 'grossProfit', label: 'Gross Profit (₦)', placeholder: 'Enter gross profit' },
        { name: 'allowableDeductions', label: 'Allowable Deductions (₦)', placeholder: 'Enter deductions' },
        { name: 'capitalAllowances', label: 'Capital Allowances (₦)', placeholder: 'Enter capital allowances' },
      ]
    },
    VAT: {
      label: 'Value Added Tax',
      rate: 0.075,
      fields: [
        { name: 'taxableSupplies', label: 'Value of Taxable Supplies (₦)', placeholder: 'Enter supply value' },
        { name: 'inputVat', label: 'Input VAT Paid (₦)', placeholder: 'Enter input VAT' },
      ]
    },
    PAYE: {
      label: 'Pay As You Earn',
      rate: 'progressive',
      fields: [
        { name: 'basicSalary', label: 'Annual Basic Salary (₦)', placeholder: 'Enter basic salary' },
        { name: 'housing', label: 'Housing Allowance (₦)', placeholder: 'Enter housing' },
        { name: 'transport', label: 'Transport Allowance (₦)', placeholder: 'Enter transport' },
        { name: 'otherAllowances', label: 'Other Allowances (₦)', placeholder: 'Enter other allowances' },
        { name: 'pension', label: 'Pension Contribution (₦)', placeholder: 'Enter pension' },
        { name: 'nhf', label: 'NHF Contribution (₦)', placeholder: 'Enter NHF' },
        { name: 'nhis', label: 'NHIS Contribution (₦)', placeholder: 'Enter NHIS' },
      ]
    },
    WHT: {
      label: 'Withholding Tax',
      rate: 0.10,
      fields: [
        { name: 'contractAmount', label: 'Contract Amount (₦)', placeholder: 'Enter contract amount' },
        { name: 'whtType', label: 'WHT Type', type: 'select', options: ['Dividend (10%)', 'Interest (10%)', 'Rent (10%)', 'Contract (5%)', 'Consultancy (10%)'] },
      ]
    }
  };

  const calculateTax = async () => {
    setLoading(true);
    const apiInputs = { ...inputs };
    
    // Parse WHT type
    if (taxType === 'WHT' && apiInputs.whtType) {
      apiInputs.whtType = apiInputs.whtType.split(' ')[0].toLowerCase();
    }

    const res = await taxAPI.calculate({
      taxType,
      inputs: apiInputs,
      taxpayerTIN: '1234567890' // Demo TIN
    });

    if (res.status === 'success') {
      setResult(res.data.result);
    }
    setLoading(false);
  };

  const handleInputChange = (name, value) => {
    setInputs({ ...inputs, [name]: parseFloat(value) || value || 0 });
  };

  const config = taxConfigs[taxType];

  return (
    <div>
      <div className="page-header">
        <h1>Tax Calculator</h1>
        <p>Compute tax liabilities for CIT, VAT, PAYE, and Withholding Tax</p>
      </div>

      <div className="grid-2">
        <TaxContainer 
          title="Tax Computation"
          action={
            <div className="tax-type-selector">
              {Object.keys(taxConfigs).map(type => (
                <button
                  key={type}
                  className={`type-btn ${taxType === type ? 'active' : ''}`}
                  onClick={() => { setTaxType(type); setInputs({}); setResult(null); }}
                >
                  {type}
                </button>
              ))}
            </div>
          }
        >
          <div className="calc-form">
            <h4>{config.label}</h4>
            {config.fields.map(field => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>
                {field.type === 'select' ? (
                  <select onChange={(e) => handleInputChange(field.name, e.target.value)}>
                    <option value="">Select {field.label}</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    placeholder={field.placeholder}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}
            <button 
              className="btn btn-primary calculate-btn" 
              onClick={calculateTax}
              disabled={loading}
            >
              <Calculator size={18} /> {loading ? 'Calculating...' : 'Calculate Tax Liability'}
            </button>
          </div>
        </TaxContainer>

        <TaxContainer title="Computation Result">
          {result ? (
            <div className="result-panel">
              <div className="result-item highlight">
                <span className="result-label">Tax Liability</span>
                <span className="result-value">₦{result.taxLiability?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Net Amount</span>
                <span className="result-value">₦{result.netAmount?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Effective Tax Rate</span>
                <span className="result-value">{result.effectiveRate?.toFixed(2)}%</span>
              </div>
              {result.breakdown && (
                <div className="result-breakdown">
                  <h5>Breakdown</h5>
                  <pre>{JSON.stringify(result.breakdown, null, 2)}</pre>
                </div>
              )}
              <div className="result-actions">
                <button className="btn btn-secondary">
                  <Download size={16} /> Download Computation
                </button>
                <button className="btn btn-primary">
                  File Return
                </button>
              </div>
            </div>
          ) : (
            <div className="result-placeholder">
              <Calculator size={48} color="var(--border)" />
              <p>Enter values and click calculate to see results</p>
            </div>
          )}
        </TaxContainer>
      </div>
    </div>
  );
}

export default TaxCalculatorPage;