
import React, { useState, useCallback } from 'react';
import { calculateTax } from './services/taxEngine';
import { TaxCalculationResult } from './types';
import ResultDisplay from './components/ResultDisplay';
import { CURRENCY_SYMBOL } from './constants';

const App: React.FC = () => {
  const [monthlyInput, setMonthlyInput] = useState<string>('');
  const [annualInput, setAnnualInput] = useState<string>('');
  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const handleMonthlyChange = (val: string) => {
    setMonthlyInput(val);
    if (val === '') {
      setAnnualInput('');
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        // Sync the annual input, keeping it as a clean number string
        const calculated = num * 12;
        setAnnualInput(Number(calculated.toFixed(2)).toString());
      }
    }
  };

  const handleAnnualChange = (val: string) => {
    setAnnualInput(val);
    if (val === '') {
      setMonthlyInput('');
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        // Sync the monthly input, keeping it as a clean number string
        const calculated = num / 12;
        setMonthlyInput(Number(calculated.toFixed(2)).toString());
      }
    }
  };

  const handleReset = () => {
    setMonthlyInput('');
    setAnnualInput('');
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculate = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(monthlyInput);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid salary amount.");
      return;
    }
    const calculation = calculateTax(amount);
    setResult(calculation);
    
    // Smooth scroll to results on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        window.scrollTo({ top: 500, behavior: 'smooth' });
      }, 100);
    }
  }, [monthlyInput]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-emerald-100 rounded-3xl mb-4 shadow-sm">
            <svg className="w-10 h-10 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Naija Tax App</h1>
          <p className="text-slate-500 font-medium text-base md:text-lg">PAYE Calculator • 2025 Tax Law</p>
        </header>

        {/* Input Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 md:p-10 mb-8 border border-slate-100">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Income Configuration</h2>
              <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Synced Inputs</span>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              {/* Monthly Input */}
              <div className="flex-1 space-y-2">
                <label htmlFor="monthly-salary" className="block text-xs font-bold text-slate-500 uppercase ml-1">
                  Monthly Gross
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold text-lg group-focus-within:text-emerald-500 transition-colors">{CURRENCY_SYMBOL}</span>
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    id="monthly-salary"
                    value={monthlyInput}
                    onChange={(e) => handleMonthlyChange(e.target.value)}
                    placeholder="250,000"
                    step="any"
                    className="block w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Sync Divider Icon */}
              <div className="flex justify-center md:pt-6">
                <div className="bg-white p-2 rounded-full border-2 border-slate-50 text-slate-300 shadow-sm md:rotate-0 rotate-90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>

              {/* Annual Input */}
              <div className="flex-1 space-y-2">
                <label htmlFor="annual-salary" className="block text-xs font-bold text-slate-500 uppercase ml-1">
                  Annual Gross
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold text-lg group-focus-within:text-emerald-500 transition-colors">{CURRENCY_SYMBOL}</span>
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    id="annual-salary"
                    value={annualInput}
                    onChange={(e) => handleAnnualChange(e.target.value)}
                    placeholder="3,000,000"
                    step="any"
                    className="block w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <button
                type="submit"
                className="flex-[2] bg-slate-900 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center space-x-3 text-xl group"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Calculate Now</span>
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear</span>
              </button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        {result && <ResultDisplay result={result} />}

        {/* Disclaimer Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-slate-200/50 rounded-2xl p-6 inline-block border border-slate-200/50">
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
              <span className="font-black text-slate-700 uppercase mb-2 block tracking-widest text-[10px]">Important Notice</span>
              Calculations are estimates based on standard PAYE progressive rates and the ₦800,000 annual tax-free threshold. Individual results may vary based on other allowances or specific state variations. Not official tax advice.
            </p>
          </div>
          <p className="mt-8 text-slate-400 text-xs font-medium">Naija Tax App &copy; 2025 • Built for Clarity</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
