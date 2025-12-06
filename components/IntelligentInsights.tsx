import React from 'react';

interface IntelligentInsightsProps {
  insights: string[];
}

const IntelligentInsights: React.FC<IntelligentInsightsProps> = ({ insights }) => {
  const InsightIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
  
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
            {InsightIcon}
            <h2 className="text-2xl font-bold text-slate-800">
                AI-Powered Insights
            </h2>
        </div>
        <ul className="space-y-3 pl-2">
            {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span className="text-cyan-500 font-bold mt-1 text-xl">&bull;</span>
                    <p>{insight}</p>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default IntelligentInsights;
