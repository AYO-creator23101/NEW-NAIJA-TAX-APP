
import React, { useState, useCallback } from 'react';
import { calculateTax } from './services/taxEngine';
import { TaxCalculationResult } from './types';
import ResultDisplay from './components/ResultDisplay';
import { CURRENCY_SYMBOL } from './constants';

const App: React.FC = () => {
  // 1. App Mode State
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');

  // 2. Controlled state for all inputs
  const [grossStr, setGrossStr] = useState<string>("");
  const [pensionStr, setPensionStr] = useState<string>("");
  const [nhfStr, setNhfStr] = useState<string>("");
  const [nhisStr, setNhisStr] = useState<string>("");
  const [insuranceStr, setInsuranceStr] = useState<string>("");
  const [rentStr, setRentStr] = useState<string>("");

  // 3. Result state
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [lastModeUsed, setLastModeUsed] = useState<'monthly' | 'annual'>('monthly');

  // 4. Manual Calculation Trigger
  const handleCalculate = useCallback(() => {
    const rawGross = parseFloat(grossStr) || 0;
    const rawPension = parseFloat(pensionStr) || 0;
    const rawNHF = parseFloat(nhfStr) || 0;
    const rawNHIS = parseFloat(nhisStr) || 0;
    const rawInsurance = parseFloat(insuranceStr) || 0;
    const rawRent = parseFloat(rentStr) || 0;

    if (rawGross <= 0) {
      alert(`Please enter a valid ${period} gross salary.`);
      return;
    }

    // Convert inputs to ANNUAL for the engine
    const multiplier = period === 'monthly' ? 12 : 1;
    
    const calc = calculateTax({
      annualGross: rawGross * multiplier,
      annualPension: rawPension * multiplier,
      annualNHF: rawNHF * multiplier,
      annualNHIS: rawNHIS * multiplier,
      annualInsurance: rawInsurance * multiplier,
      annualRent: rawRent * multiplier,
    });
    
    setResult(calc);
    setLastModeUsed(period);

    // Smooth scroll to results
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [period, grossStr, pensionStr, nhfStr, nhisStr, insuranceStr, rentStr]);

  const handleReset = () => {
    setGrossStr("");
    setPensionStr("");
    setNhfStr("");
    setNhisStr("");
    setInsuranceStr("");
    setRentStr("");
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMonthly = period === 'monthly';

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-block px-5 py-4 bg-emerald-100 rounded-3xl mb-4 shadow-sm border border-emerald-200">
            <span className="text-4xl font-black text-emerald-700 leading-none">{CURRENCY_SYMBOL}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Naija Tax App v 1.0</h1>
          <p className="text-slate-500 font-medium text-xs uppercase tracking-[0.3em]">Accurate PAYE Estimator</p>
        </header>

        {/* Mode Toggle */}
        <div className="flex flex-col items-center mb-8 space-y-3">
          <div className="bg-slate-200 p-1.5 rounded-2xl flex items-center shadow-inner">
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${isMonthly ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('annual')}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${!isMonthly ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Annual
            </button>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">
            Tax calculations are annual. Monthly figures are derived for convenience.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 md:p-10 mb-8 border border-slate-100">
          <div className="space-y-8">
            {/* Income Section */}
            <div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Income Details</h2>
              <div className="space-y-2 max-w-md">
                <label className="text-xs font-bold text-slate-500 uppercase">{isMonthly ? 'Monthly' : 'Annual'} Gross Income</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold">{CURRENCY_SYMBOL}</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={grossStr}
                    onChange={(e) => setGrossStr(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl font-black text-slate-900 text-lg focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">
                Deductibles ({isMonthly ? 'Monthly' : 'Annual'})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Pension</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={pensionStr}
                      onChange={(e) => setPensionStr(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:border-emerald-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">NHF</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={nhfStr}
                      onChange={(e) => setNhfStr(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:border-emerald-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Rent</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={rentStr}
                      onChange={(e) => setRentStr(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:border-emerald-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">NHIS</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={nhisStr}
                      onChange={(e) => setNhisStr(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:border-emerald-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Life Insurance</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={insuranceStr}
                      onChange={(e) => setInsuranceStr(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:border-emerald-500 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3 pt-6">
              <button
                type="button"
                onClick={handleCalculate}
                className="flex-[2] bg-slate-900 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/10 transition-all flex items-center justify-center space-x-3 text-xl group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Calculate Tax</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div id="result-section">
          {result ? (
            <ResultDisplay result={result} mode={lastModeUsed} />
          ) : (
            <div className="text-center py-16 bg-slate-100/30 rounded-[2.5rem] border-4 border-dashed border-slate-200">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-400 font-bold text-sm tracking-wide">Enter figures and click Calculate</p>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-16 text-center pb-12 space-y-4 border-t border-slate-100 pt-8">
          <div className="space-y-2">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              Disclaimer
            </p>
            <p className="text-slate-400 text-xs leading-relaxed font-medium max-w-lg mx-auto">
              Estimates are calculated using Nigerian PAYE guidelines and user-provided data. Results may differ from official figures and should not be considered final tax assessments.
            </p>
          </div>
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
            &copy; 2026 Naija Tax App • Built for clarity and transparency
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
