import React from 'react';

interface TransactionFiltersProps {
  categories: string[];
  selectedCategory: string;
  dateRange: { start: string; end: string };
  onCategoryChange: (category: string) => void;
  onDateChange: (range: { start: string; end: string }) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  categories,
  selectedCategory,
  dateRange,
  onCategoryChange,
  onDateChange,
}) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange({ ...dateRange, start: e.target.value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange({ ...dateRange, end: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-grow w-full md:w-auto">
        <label htmlFor="category-filter" className="block text-sm font-medium text-slate-700 mb-1">
          Filter by Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-shrink w-full md:w-auto">
        <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 mb-1">
          Start Date
        </label>
        <input
          type="date"
          id="start-date"
          value={dateRange.start}
          onChange={handleStartDateChange}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      <div className="flex-shrink w-full md:w-auto">
        <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 mb-1">
          End Date
        </label>
        <input
          type="date"
          id="end-date"
          value={dateRange.end}
          onChange={handleEndDateChange}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
    </div>
  );
};

export default TransactionFilters;
