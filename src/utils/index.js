export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const generateTaxId = () => {
  return 'TAX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const validateTIN = (tin) => {
  return /^\d{10,12}$/.test(tin);
};