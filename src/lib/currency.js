export function formatCurrency(value) {
  const rounded = Math.round(Number(value) || 0);
  return `Rs. ${rounded.toLocaleString('en-PK')}`;
}

export function getMonthlyInstallment(price, months) {
  return Math.ceil((Number(price) || 0) / Number(months || 1));
}

export function getDownPayment(price, rate = 0.2) {
  return Math.round((Number(price) || 0) * rate);
}