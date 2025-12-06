
import React, { useState } from 'react';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const copyToCSV = () => {
    // A robust CSV field escaping function.
    // It handles fields containing commas and double quotes by quoting every field.
    // This ensures maximum compatibility with spreadsheet software like Google Sheets.
    const toCSVField = (data: any): string => {
      const field = String(data);
      // Escape double quotes by doubling them as per CSV standard
      const escaped = field.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const header = "Date,Description,Amount,Category,Notes,Statement Source";
    const csvRows = transactions.map(t => 
      [
        toCSVField(t.date),
        toCSVField(t.description),
        toCSVField(t.amount),
        toCSVField(t.category),
        toCSVField(t.notes),
        toCSVField(t.statementSource)
      ].join(',')
    );
    
    const csvString = [header, ...csvRows].join('\n');
    navigator.clipboard.writeText(csvString).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 sm:mb-0">Extracted Transactions</h2>
        <button
          onClick={copyToCSV}
          className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm flex items-center gap-2"
        >
          {copyStatus === 'copied' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Copy to CSV
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs text-slate-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3">{t.description}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800">
                    {t.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap truncate max-w-xs" title={t.statementSource}>
                    {t.statementSource}
                </td>
                <td className={`px-4 py-3 text-right font-mono font-medium ${t.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;