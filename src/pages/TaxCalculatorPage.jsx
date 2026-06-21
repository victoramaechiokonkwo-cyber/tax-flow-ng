import React, { useState } from 'react';
import TaxContainer from '../components/TaxContainer';
import { Calculator, Download } from 'lucide-react';
import './TaxCalculatorPage.css';

function TaxCalculatorPage() {
  const [taxType, setTaxType] = useState('CIT');
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

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

  const calculateTax = () => {
    let tax = 0;
    const vals = inputs;
    
    switch(taxType) {
      case 'CIT':
        const citBase = (vals.grossProfit || 0) - (vals.allowableDeductions || 0) - (vals.capitalAllowances || 0);
        tax = Math.max(0, citBase * 0.30);
        break;
      case 'VAT':
        const outputVat = (vals.taxableSupplies || 0) * 0.075;
        tax = Math.max(0, outputVat - (vals.inputVat || 0));
        break;
      case 'PAYE':
        const grossIncome = (vals.basicSalary || 0) + (vals.housing || 0) + (vals.transport || 0) + (vals.otherAllowances || 0);
        const reliefs = (vals.pension || 0) + (vals.nhf || 0) + (vals.nhis || 0) + (Math.min(grossIncome * 0.01, 200000)) + 200000;
        const taxable = Math.max(0, grossIncome - reliefs);
        
        if (taxable <= 300000) tax = taxable * 0.07;
        else if (taxable <= 600000) tax = 21000 + (taxable - 300000) * 0.11;
        else if (taxable <= 1100000) tax = 54000 + (taxable - 600000) * 0.15;
        else if (taxable <= 1600000) tax = 129000 + (taxable - 1100000) * 0.19;
        else if (taxable <= 3200000) tax = 224000 + (taxable - 1600000) * 0.21;
        else tax = 560000 + (taxable - 3200000) * 0.24;
        break;
      case 'WHT':
        const rate = vals.whtType?.includes('5%') ? 0.05 : 0.10;
        tax = (vals.contractAmount || 0) * rate;
        break;
      default:
        break;
    }
    
    setResult({
      taxLiability: tax,
      netAmount: (vals.grossProfit || vals.taxableSupplies || vals.basicSalary || vals.contractAmount || 0) - tax,
      effectiveRate: tax / (vals.grossProfit || vals.taxableSupplies || vals.basicSalary || vals.contractAmount || 1) * 100
    });
  };

  const handleInputChange = (name, value) => {
    setInputs({ ...inputs, [name]: parseFloat(value) || 0 });
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
            <button className="btn btn-primary calculate-btn" onClick={calculateTax}>
              <Calculator size={18} /> Calculate Tax Liability
            </button>
          </div>
        </TaxContainer>

        <TaxContainer title="Computation Result">
          {result ? (
            <div className="result-panel">
              <div className="result-item highlight">
                <span className="result-label">Tax Liability</span>
                <span className="result-value">₦{result.taxLiability.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Net Amount</span>
                <span className="result-value">₦{result.netAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Effective Tax Rate</span>
                <span className="result-value">{result.effectiveRate.toFixed(2)}%</span>
              </div>
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