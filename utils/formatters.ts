
import { CURRENCY_SYMBOL } from '../constants';

export const formatCurrency = (amount: number): string => {
  return CURRENCY_SYMBOL + amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseNairaInput = (value: string): number => {
  const sanitized = value.replace(/[^0-9.]/g, '');
  return parseFloat(sanitized) || 0;
};
