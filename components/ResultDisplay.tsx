
import React from 'react';
import { TaxCalculationResult } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ResultDisplayProps {
  result: TaxCalculationResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Primary Result - Monthly Take Home */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center shadow-sm">
        <p className="text-emerald-700 font-medium text-sm uppercase tracking-wider mb-1">Monthly Take-Home Pay</p>
        <h2 className="text-4xl md:text-5xl font-bold text-emerald-900">
          {formatCurrency(result.monthlyTakeHome)}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Breakdown Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold mb-4 uppercase tracking-widest">Monthly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Gross Salary</span>
              <span className="font-semibold text-slate-900">{formatCurrency(result.monthlyGross)}</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>PAYE Tax</span>
              <span className="font-semibold">-{formatCurrency(result.monthlyTax)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-emerald-700 font-bold">
              <span>Net Pay</span>
              <span>{formatCurrency(result.monthlyTakeHome)}</span>
            </div>
          </div>
        </div>

        {/* Annual Breakdown Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold mb-4 uppercase tracking-widest">Annual Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Gross Salary</span>
              <span className="font-semibold text-slate-900">{formatCurrency(result.annualGross)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Taxable Portion</span>
              <span className="font-semibold">{formatCurrency(result.taxableIncome)}</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Total Tax</span>
              <span className="font-semibold">-{formatCurrency(result.annualTax)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-900 font-bold">
              <span>Annual Net</span>
              <span>{formatCurrency(result.annualGross - result.annualTax)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Calculation Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
          <h3 className="text-slate-800 font-bold flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              <path d="M7 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
            </svg>
            How it was calculated (Annual)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="px-5 py-3 font-bold border-b border-slate-100">Income Segment</th>
                <th className="px-5 py-3 font-bold border-b border-slate-100">Amount</th>
                <th className="px-5 py-3 font-bold border-b border-slate-100">Rate</th>
                <th className="px-5 py-3 font-bold border-b border-slate-100 text-right">Tax Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {result.breakdown.map((item, idx) => (
                <tr key={idx} className={item.rate === 0 ? "bg-emerald-50/30" : ""}>
                  <td className="px-5 py-3 font-medium text-slate-700">{item.label}</td>
                  <td className="px-5 py-3 text-slate-600">{formatCurrency(item.taxableAmount)}</td>
                  <td className="px-5 py-3 text-slate-600">{(item.rate * 100).toFixed(0)}%</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">
                    {item.tax > 0 ? formatCurrency(item.tax) : <span className="text-emerald-600">FREE</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td colSpan={3} className="px-5 py-4 font-bold text-slate-900 text-right">Total Annual Tax</td>
                <td className="px-5 py-4 font-extrabold text-red-600 text-right text-lg">
                  {formatCurrency(result.annualTax)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
