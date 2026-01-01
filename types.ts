
export interface TaxBracket {
  limit: number;
  rate: number;
}

export interface BracketDetail {
  label: string;
  taxableAmount: number;
  rate: number;
  tax: number;
}

export interface DeductionsBreakdown {
  cra: number;
  pension: number;
  nhf: number;
  nhis: number;
  insurance: number;
  rent: number;
  total: number;
}

export interface TaxCalculationResult {
  monthlyGross: number;
  annualGross: number;
  annualTax: number;
  monthlyTax: number;
  monthlyTakeHome: number;
  taxableIncome: number;
  deductions: DeductionsBreakdown;
  breakdown: BracketDetail[];
}
