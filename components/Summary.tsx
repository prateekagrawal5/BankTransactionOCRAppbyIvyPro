
import React from 'react';
import { FinancialSummary } from '../types';

interface SummaryProps {
  summary: FinancialSummary;
}

// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactElement; color: string }> = ({ title, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow border ${color} flex items-start space-x-4`}>
    <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('text-', 'text-white/80')} bg-opacity-10`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);


const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const { totalTransactions, totalIncome, totalSpending } = summary;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const Icons = {
    transactions: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>,
    income: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m0 0a2.5 2.5 0 001.126-4.75" /></svg>,
    spending: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  }

  return (
    <div>
       <h2 className="text-2xl font-bold text-slate-800 mb-4">Financial Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
            title="Total Transactions" 
            value={totalTransactions.toString()}
            icon={Icons.transactions}
            color="border-blue-300 text-blue-600"
        />
        <SummaryCard 
            title="Total Income" 
            value={formatCurrency(totalIncome)} 
            icon={Icons.income}
            color="border-green-300 text-green-600"
        />
        <SummaryCard 
            title="Total Spending" 
            value={formatCurrency(totalSpending)}
            icon={Icons.spending}
            color="border-red-300 text-red-600"
        />
      </div>
    </div>
  );
};

export default Summary;