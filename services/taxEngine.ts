
import { TAX_BRACKETS } from '../constants';
import { TaxCalculationResult, BracketDetail, DeductionsBreakdown } from '../types';

interface AnnualTaxInputs {
  annualGross: number;
  annualPension: number;
  annualNHF: number;
  annualNHIS: number;
  annualInsurance: number;
  annualRent: number;
}

/**
 * Calculates the PAYE tax based on annual figures.
 * Taxable income = gross income – total deductibles (Pension, NHF, NHIS, Insurance, Rent)
 * Note: CRA is calculated for info only but NOT subtracted per user requirement.
 */
export const calculateTax = (inputs: AnnualTaxInputs): TaxCalculationResult => {
  const { 
    annualGross = 0, 
    annualPension = 0,
    annualNHF = 0,
    annualNHIS = 0, 
    annualInsurance = 0,
    annualRent = 0
  } = inputs;

  // 1. Calculate CRA (Informational Only)
  const craBase = annualGross > 0 ? Math.max(200000, 0.01 * annualGross) : 0;
  const annualCRA = annualGross > 0 ? (craBase + (0.2 * annualGross)) : 0;

  // 2. Total deductions EXCLUDING CRA
  const totalAnnualDeductions = annualPension + annualNHF + annualNHIS + annualInsurance + annualRent;
  const taxableIncome = Math.max(0, annualGross - totalAnnualDeductions);

  // 3. Apply Progressive Tax Brackets to Taxable Income
  let remainingTaxable = taxableIncome;
  let totalAnnualTax = 0;
  const breakdown: BracketDetail[] = [];
  let cumulativeLimit = 0;

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];
    const amountInThisBracket = Math.max(0, Math.min(remainingTaxable, bracket.limit));
    const taxInThisBracket = amountInThisBracket * bracket.rate;
    
    totalAnnualTax += taxInThisBracket;
    remainingTaxable -= amountInThisBracket;

    const lowerBound = cumulativeLimit;
    
    let label = "";
    if (i === 0) {
      label = `First ₦${bracket.limit.toLocaleString()}`;
    } else if (bracket.limit === Infinity) {
      label = `Above ₦${lowerBound.toLocaleString()}`;
    } else {
      label = `Next ₦${bracket.limit.toLocaleString()}`;
    }

    breakdown.push({
      label,
      taxableAmount: amountInThisBracket,
      rate: bracket.rate,
      tax: taxInThisBracket,
    });
    
    if (bracket.limit !== Infinity) {
      cumulativeLimit += bracket.limit;
    }

    if (remainingTaxable <= 0 && i > 0) break;
  }

  const annualTax = totalAnnualTax;
  const monthlyTax = annualTax / 12;
  const monthlyGross = annualGross / 12;
  const monthlyTakeHome = monthlyGross - monthlyTax;

  const deductions: DeductionsBreakdown = {
    cra: annualCRA,
    pension: annualPension,
    nhf: annualNHF,
    nhis: annualNHIS,
    insurance: annualInsurance,
    rent: annualRent,
    total: totalAnnualDeductions,
  };

  return {
    monthlyGross,
    annualGross,
    annualTax,
    monthlyTax,
    monthlyTakeHome,
    taxableIncome,
    deductions,
    breakdown
  };
};
