
import { ANNUAL_TAX_FREE_THRESHOLD, TAX_BRACKETS } from '../constants';
import { TaxCalculationResult, BracketDetail } from '../types';

/**
 * Calculates the PAYE tax for a given monthly gross salary.
 * Assumes the first 800k of annual income is tax-free.
 * Tax is applied only to the excess income above the threshold.
 */
export const calculateTax = (monthlyGross: number): TaxCalculationResult => {
  const annualGross = monthlyGross * 12;
  const taxableIncome = Math.max(0, annualGross - ANNUAL_TAX_FREE_THRESHOLD);
  
  let remainingTaxable = taxableIncome;
  let totalAnnualTax = 0;
  const breakdown: BracketDetail[] = [];

  // Add the tax-free component to the breakdown for transparency
  breakdown.push({
    label: 'Tax-Free Threshold',
    taxableAmount: Math.min(annualGross, ANNUAL_TAX_FREE_THRESHOLD),
    rate: 0,
    tax: 0,
  });

  for (const bracket of TAX_BRACKETS) {
    if (remainingTaxable <= 0) break;

    const amountInThisBracket = Math.min(remainingTaxable, bracket.limit);
    const taxInThisBracket = amountInThisBracket * bracket.rate;
    
    totalAnnualTax += taxInThisBracket;
    remainingTaxable -= amountInThisBracket;

    breakdown.push({
      label: bracket.limit === Infinity ? 'Remaining Balance' : `Next ₦${bracket.limit.toLocaleString()}`,
      taxableAmount: amountInThisBracket,
      rate: bracket.rate,
      tax: taxInThisBracket,
    });
  }

  const monthlyTax = totalAnnualTax / 12;
  const monthlyTakeHome = monthlyGross - monthlyTax;

  return {
    monthlyGross,
    annualGross,
    annualTax: totalAnnualTax,
    monthlyTax,
    monthlyTakeHome,
    taxFreeAmount: ANNUAL_TAX_FREE_THRESHOLD,
    taxableIncome,
    breakdown
  };
};
