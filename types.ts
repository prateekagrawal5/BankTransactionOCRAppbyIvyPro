export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  notes: string;
  statementSource: string;
}

export interface FinancialSummary {
  totalTransactions: number;
  totalIncome: number;
  totalSpending: number;
}

export interface CategorySummary {
  category: string;
  total: number;
}

export interface AnalysisResult {
  transactions: Transaction[];
  insights: string[];
}
