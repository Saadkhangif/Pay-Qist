export function formatCurrency(value) {
  const rounded = Math.round(Number(value) || 0);
  return `Rs. ${rounded.toLocaleString('en-PK')}`;
}

export function getMonthlyInstallment(price, months, downPaymentRate = 0.2) {
  const total = Number(price) || 0;
  const installmentMonths = Number(months) || 1;
  const financed = Math.max(0, total - getDownPayment(total, downPaymentRate));
  return Math.ceil(financed / installmentMonths);
}

export function getDownPayment(price, rate = 0.2) {
  return Math.round((Number(price) || 0) * rate);
}

export const INSTALLMENT_MONTHLY_RATE = 0.045;

export function calculateInstallmentPlan(productPrice, advance, months) {
  const price = Math.max(0, Number(productPrice) || 0);
  const down = Math.min(Math.max(0, Number(advance) || 0), price);
  const duration = Math.max(1, Number(months) || 1);
  const principal = price - down;
  const totalProfit = Math.round(principal * INSTALLMENT_MONTHLY_RATE * duration);
  const totalAmount = price + totalProfit;
  const installment = Math.ceil((principal + totalProfit) / duration);

  return {
    principal,
    totalProfit,
    totalAmount,
    installment,
  };
}