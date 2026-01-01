
import React from 'react';
import { TaxCalculationResult } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ResultDisplayProps {
  result: TaxCalculationResult;
  mode: 'monthly' | 'annual';
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, mode }) => {
  const { deductions } = result;
  const isMonthly = mode === 'monthly';

  // Primary highlight based on mode
  const mainLabel = isMonthly ? "Net Monthly Salary" : "Net Annual Salary";
  const mainValue = isMonthly ? result.monthlyTakeHome : (result.annualGross - result.annualTax);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Primary Result Highlight */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center shadow-sm">
        <p className="text-emerald-700 font-bold text-xs uppercase tracking-widest mb-2">{mainLabel}</p>
        <h2 className="text-4xl md:text-6xl font-black text-emerald-900 tracking-tight">
          {formatCurrency(mainValue)}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-slate-400 text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
            Tax Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>Gross Income ({isMonthly ? "Mo" : "Yr"})</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(isMonthly ? result.monthlyGross : result.annualGross)}
              </span>
            </div>
            
            <div className="pt-2 border-t border-slate-50 space-y-2">
              <div className="flex justify-between items-center text-red-600 font-bold">
                <span className="text-xs uppercase tracking-tighter">Total Annual PAYE</span>
                <span className="text-sm">-{formatCurrency(result.annualTax)}</span>
              </div>
              {isMonthly && (
                <div className="flex justify-between items-center text-red-500 font-medium">
                  <span className="text-[10px] uppercase tracking-tighter italic">Monthly PAYE (Derived)</span>
                  <span className="text-xs">-{formatCurrency(result.monthlyTax)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-emerald-700">
              <span className="font-bold text-sm uppercase">Net Pay ({isMonthly ? "Mo" : "Yr"})</span>
              <span className="font-black text-xl">{formatCurrency(mainValue)}</span>
            </div>
          </div>
        </div>

        {/* Annual Deductions Detail */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-slate-400 text-[10px] font-black mb-6 uppercase tracking-[0.2em]">Reliefs & Deductions (Annualized)</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <span className="text-slate-500 italic text-xs">Consolidated Relief (CRA)*</span>
              <span className="font-bold text-slate-400 line-through text-xs">{formatCurrency(deductions.cra)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Pension</span>
              <span className="font-bold text-slate-700">{formatCurrency(deductions.pension)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">NHF</span>
              <span className="font-bold text-slate-700">{formatCurrency(deductions.nhf)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">NHIS</span>
              <span className="font-bold text-slate-700">{formatCurrency(deductions.nhis)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Life Insurance</span>
              <span className="font-bold text-slate-700">{formatCurrency(deductions.insurance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Rent</span>
              <span className="font-bold text-slate-700">{formatCurrency(deductions.rent)}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-blue-600 font-bold">
              <span className="uppercase text-[10px]">Total Annual Deductions</span>
              <span className="text-lg">{formatCurrency(deductions.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Tax Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-2">
          <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">Taxable Income Breakdown (Annual)</h3>
          <div className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm self-start md:self-auto">
            Annual Taxable Income: <span className="text-blue-600 ml-1">{formatCurrency(result.taxableIncome)}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4 font-black">Bracket Segment</th>
                <th className="px-6 py-4 font-black">Amount In Bracket</th>
                <th className="px-6 py-4 font-black">Rate</th>
                <th className="px-6 py-4 font-black text-right">Tax Due (Annual)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {result.breakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">{item.label}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{formatCurrency(item.taxableAmount)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold text-[10px]">
                      {(item.rate * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(item.tax)}</td>
                </tr>
              ))}
              {result.breakdown.every(b => b.tax === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center font-bold text-emerald-600 bg-emerald-50/20">
                    Income is fully covered by reliefs and deductions. No tax due.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white">
                <td colSpan={3} className="px-6 py-5 font-bold text-right text-xs uppercase tracking-widest text-slate-400">Total Annual PAYE</td>
                <td className="px-6 py-5 font-black text-right text-xl">{formatCurrency(result.annualTax)}</td>
              </tr>
              {isMonthly && (
                <tr className="bg-slate-800 text-white border-t border-slate-700/50">
                  <td colSpan={3} className="px-6 py-4 font-bold text-right text-xs uppercase tracking-widest text-slate-400 italic">Monthly PAYE (Derived)</td>
                  <td className="px-6 py-4 font-black text-right text-lg">{formatCurrency(result.monthlyTax)}</td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
        {isMonthly && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-500 font-medium italic">
              Monthly PAYE is calculated by dividing annual PAYE by 12.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
