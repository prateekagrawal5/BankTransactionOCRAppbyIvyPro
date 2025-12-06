import React, { useState, useMemo } from 'react';
import { Transaction, FinancialSummary, CategorySummary } from './types';
import { analyzeStatement } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import FileUpload from './components/FileUpload';
import TransactionTable from './components/TransactionTable';
import Summary from './components/Summary';
import Spinner from './components/Spinner';
import CategoryInsights from './components/CategoryInsights';
import IntelligentInsights from './components/IntelligentInsights';
import TransactionFilters from './components/TransactionFilters';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State for filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });


  const resetFilters = () => {
    setSelectedCategory('all');
    setDateRange({ start: '', end: '' });
  };

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
      setTransactions([]);
      setInsights([]);
      setError(null);
      resetFilters();
    }
  };
  
  const handleAnalyze = async () => {
    if (files.length === 0) {
      setError("Please upload at least one bank statement file.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactions([]);
    setInsights([]);
    resetFilters();

    try {
      const fileParts = await Promise.all(
        files.map(async (file) => {
          const base64Data = await fileToBase64(file);
          return {
            inlineData: {
              data: base64Data,
              mimeType: file.type,
            },
          };
        })
      );
      
      const result = await analyzeStatement(fileParts);

      const processedTransactions = result.transactions.map(transaction => {
        const docMatch = transaction.statementSource.match(/Document (\d+)/i);
        if (docMatch && docMatch[1]) {
          const docIndex = parseInt(docMatch[1], 10) - 1;
          if (docIndex >= 0 && docIndex < files.length) {
            return { ...transaction, statementSource: files[docIndex].name };
          }
        }
        return { ...transaction, statementSource: 'Unknown' };
      });
      
      setTransactions(processedTransactions);
      setInsights(result.insights);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueCategories = useMemo(() => {
    if (transactions.length === 0) return [];
    const categories = new Set(transactions.map(t => t.category));
    return Array.from(categories).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const categoryMatch = selectedCategory === 'all' || t.category === selectedCategory;
      const dateMatch = (!dateRange.start || t.date >= dateRange.start) &&
                        (!dateRange.end || t.date <= dateRange.end);
      return categoryMatch && dateMatch;
    });
  }, [transactions, selectedCategory, dateRange]);


  const financialSummary: FinancialSummary | null = useMemo(() => {
    if (filteredTransactions.length === 0 && transactions.length === 0) {
      return null;
    }
     const source = filteredTransactions.length > 0 || selectedCategory !== 'all' || dateRange.start || dateRange.end ? filteredTransactions : transactions;

    const totalIncome = source
      .filter(t => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);
    const totalSpending = source
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0);
    
    return {
      totalTransactions: source.length,
      totalIncome,
      totalSpending: Math.abs(totalSpending),
    };
  }, [filteredTransactions, transactions, selectedCategory, dateRange]);

  const categoryInsights = useMemo(() => {
    const source = filteredTransactions.length > 0 || selectedCategory !== 'all' || dateRange.start || dateRange.end ? filteredTransactions : transactions;
    if (source.length === 0) {
      return null;
    }

    const spendingByCategory: { [key: string]: number } = {};
    const incomeByCategory: { [key: string]: number } = {};

    source.forEach(t => {
      const isIgnoredCategory = ['Transfer', 'Payment'].includes(t.category);
      if (t.amount < 0 && !isIgnoredCategory) {
        spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + Math.abs(t.amount);
      } else if (t.amount > 0 && !isIgnoredCategory) {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      }
    });

    const topSpendingCategories: CategorySummary[] = Object.entries(spendingByCategory)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    const topIncomeCategories: CategorySummary[] = Object.entries(incomeByCategory)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    return { topSpendingCategories, topIncomeCategories };
  }, [filteredTransactions, transactions, selectedCategory, dateRange]);


  const DocumentScannerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2M7.44 16.59l2.83-2.83 1.41 1.41-2.83 2.83c-.39.39-1.02.39-1.41 0-.4-.39-.4-1.02.01-1.41m6.75-1.54c.38-.38.38-1.02 0-1.41l-6.36-6.36c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l6.36 6.36c.39.39 1.03.39 1.41 0m2.22-3.83l1.41-1.41c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.41 1.41c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0" />
      <path d="M4 4h4v4H4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM10 4h4v4h-4zm6 0h4v4h-4zm-6 6h4v4h-4zm6 6h4v4h-4z"/>
    </svg>
  );


  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <DocumentScannerIcon className="w-10 h-10 text-cyan-600" />
            Bank Statement Insights
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your bank statements (images or PDFs) and let Gemini extract and summarize your financial data instantly.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-slate-200">
          <FileUpload onFileChange={handleFileChange} fileCount={files.length} />
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || files.length === 0}
              className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Analyzing...
                </>
              ) : (
                "Analyze Statements"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
            <div className="text-center mt-8 p-4">
                <div className="flex justify-center items-center gap-4">
                    <Spinner />
                    <p className="text-slate-600 text-lg">Gemini is analyzing your documents. This may take a moment...</p>
                </div>
            </div>
        )}

        {!isLoading && transactions.length > 0 && (
          <div className="mt-12 space-y-8">
            {financialSummary && <Summary summary={financialSummary} />}
            {categoryInsights && (
              <CategoryInsights 
                spendingCategories={categoryInsights.topSpendingCategories}
                incomeCategories={categoryInsights.topIncomeCategories}
              />
            )}
            {insights && insights.length > 0 && (
              <IntelligentInsights insights={insights} />
            )}
            <TransactionFilters
              categories={uniqueCategories}
              selectedCategory={selectedCategory}
              dateRange={dateRange}
              onCategoryChange={setSelectedCategory}
              onDateChange={setDateRange}
            />
            <TransactionTable transactions={filteredTransactions} />
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;