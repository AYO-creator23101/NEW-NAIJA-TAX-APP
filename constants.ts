
import { TaxBracket } from './types';

// The threshold below which no tax is paid
export const ANNUAL_TAX_FREE_THRESHOLD = 800000;

/**
 * Standard Progressive Tax Brackets (Personal Income Tax)
 * These can be easily updated if the government changes the rates.
 */
export const TAX_BRACKETS: TaxBracket[] = [
  { limit: 300000, rate: 0.07 },   // First 300k of taxable income
  { limit: 300000, rate: 0.11 },   // Next 300k
  { limit: 500000, rate: 0.15 },   // Next 500k
  { limit: 500000, rate: 0.19 },   // Next 500k
  { limit: 1600000, rate: 0.21 },  // Next 1.6m
  { limit: Infinity, rate: 0.24 }, // Remainder
];

export const CURRENCY_SYMBOL = '₦';
