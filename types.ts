
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

export interface TaxCalculationResult {
  monthlyGross: number;
  annualGross: number;
  annualTax: number;
  monthlyTax: number;
  monthlyTakeHome: number;
  taxFreeAmount: number;
  taxableIncome: number;
  breakdown: BracketDetail[];
}
