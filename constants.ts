
import { TaxBracket } from './types';

// The threshold below which no tax is paid
export const ANNUAL_TAX_FREE_THRESHOLD = 800000;

/**
 * Official Progressive Tax Brackets
 * These 'limit' values represent the width of each segment.
 */
export const TAX_BRACKETS: TaxBracket[] = [
  { limit: 800000, rate: 0.00 },    // First 800,000 @ 0%
  { limit: 2200000, rate: 0.15 },   // Next 2,200,000 @ 15% (to 3m)
  { limit: 9000000, rate: 0.18 },   // Next 9,000,000 @ 18% (to 12m)
  { limit: 13000000, rate: 0.21 },  // Next 13,000,000 @ 21% (to 25m)
  { limit: 25000000, rate: 0.23 },  // Next 25,000,000 @ 23% (to 50m)
  { limit: Infinity, rate: 0.25 },  // Above 50,000,000 @ 25%
];

export const CURRENCY_SYMBOL = '₦';
