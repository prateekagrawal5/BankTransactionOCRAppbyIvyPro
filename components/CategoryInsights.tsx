
import React from 'react';
import { CategorySummary } from '../types';

interface CategoryInsightsProps {
  spendingCategories: CategorySummary[];
  incomeCategories: CategorySummary[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const CategoryList: React.FC<{ title: string; categories: CategorySummary[]; color: string; icon: React.ReactElement }> = ({ title, categories, color, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        {categories.length > 0 ? (
            <ul className="space-y-4">
                {categories.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 truncate pr-2">{item.category}</span>
                        <span className={`font-semibold font-mono whitespace-nowrap ${color}`}>{formatCurrency(item.total)}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-sm text-slate-500">No data available for this period.</p>
        )}
    </div>
);


const CategoryInsights: React.FC<CategoryInsightsProps> = ({ spendingCategories, incomeCategories }) => {
    const SpendingIcon = (
        <div className="p-2 bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
        </div>
    );

    const IncomeIcon = (
        <div className="p-2 bg-green-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0V15m0-8l-8 8-4-4-6 6" />
            </svg>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Category Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryList 
                    title="Top Spending Categories" 
                    categories={spendingCategories} 
                    color="text-red-600" 
                    icon={SpendingIcon} 
                />
                <CategoryList 
                    title="Top Income Sources" 
                    categories={incomeCategories} 
                    color="text-green-600" 
                    icon={IncomeIcon} 
                />
            </div>
        </div>
    );
};

export default CategoryInsights;
