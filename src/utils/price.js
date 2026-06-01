export function formatCurrency(amount) {
  return `Rs. ${new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount))}`;
}

export function monthlyInstallment(amount, months) {
  return Math.ceil(amount / months);
}

export function downPayment(amount, rate = 0.2) {
  return Math.round(amount * rate);
}

export function installmentSummary(amount, months) {
  return `${formatCurrency(amount)} or ${formatCurrency(monthlyInstallment(amount, months))}/month for ${months} months`;
}