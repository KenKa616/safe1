import React, { useState } from 'react';
import { analyzeSalesData } from '../services/geminiService';
import { SalesRecord, Product } from '../types';
import { Sparkles, Send, Loader2, AlertTriangle } from 'lucide-react';

interface AIAnalystProps {
  sales: SalesRecord[];
  products: Product[];
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ sales, products }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse('');
    try {
      const result = await analyzeSalesData(query, sales, products);
      setResponse(result);
    } catch (err) {
        setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Which product has the highest revenue in Germany?",
    "Compare Domestos and Fairy sales.",
    "What is the sales trend for Laundry products?",
    "Which country is underperforming?"
  ];

  return (
    <div className="bg-gradient-to-br from-brand-dark to-brand-black border border-brand-yellow/30 rounded-xl p-6 mb-8 shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2 bg-brand-yellow text-black rounded-lg shadow-lg shadow-brand-yellow/20">
            <Sparkles size={20} />
        </div>
        <h2 className="text-xl font-bold text-white">AI Sales Analyst</h2>
      </div>
      
      {!process.env.API_KEY && (
         <div className="flex items-center gap-2 text-brand-red bg-brand-red/10 p-3 rounded mb-4 border border-brand-red/20">
            <AlertTriangle size={16} />
            <span className="text-sm">API Key not configured in environment. AI features are disabled.</span>
         </div>
      )}

      <div className="space-y-4 relative z-10">
        <div className="bg-black/50 rounded-lg p-4 min-h-[100px] border border-gray-800">
            {loading ? (
                <div className="flex items-center gap-2 text-brand-yellow animate-pulse">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Analyzing sales patterns...</span>
                </div>
            ) : response ? (
                <p className="text-gray-200 leading-relaxed">{response}</p>
            ) : (
                <p className="text-gray-500 italic">Ask me anything about your sales data...</p>
            )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Ask about sales trends, top products, or regional performance..."
            className="flex-1 bg-brand-card border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all placeholder-gray-600"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !query.trim()}
            className="bg-brand-yellow hover:bg-yellow-400 disabled:opacity-50 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Send size={18} />
            Analyze
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
                <button 
                    key={i} 
                    onClick={() => setQuery(s)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full border border-gray-700 transition-colors"
                >
                    {s}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AIAnalyst;