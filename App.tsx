import React, { useState, useMemo } from 'react';
import { PRODUCTS, MOCK_SALES_DATA } from './constants';
import ProductCard from './components/ProductCard';
import DashboardCharts from './components/DashboardCharts';
import AIAnalyst from './components/AIAnalyst';
import { TimeFrame, SalesRecord } from './types';
import { LayoutDashboard, Package, Calendar, Globe, Search, BarChart3 } from 'lucide-react';

interface ProductStat {
  revenue: number;
  units: number;
  countryCounts: Record<string, number>;
}

function App() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  // Aggregation Logic
  const productStats = useMemo(() => {
    const stats = new Map<string, ProductStat>();

    MOCK_SALES_DATA.forEach((sale: SalesRecord) => {
      // Filter by timeframe logic roughly
      const saleDate = new Date(sale.date);
      const now = new Date();
      let include = true;

      if (timeFrame === 'daily') {
        // Last 30 days
        include = (now.getTime() - saleDate.getTime()) / (1000 * 3600 * 24) <= 30;
      } else if (timeFrame === 'monthly') {
        // Last 365 days
         include = (now.getTime() - saleDate.getTime()) / (1000 * 3600 * 24) <= 365;
      } 
      // annual includes everything in mock data

      if (include) {
        if (!stats.has(sale.productId)) {
          stats.set(sale.productId, { revenue: 0, units: 0, countryCounts: {} });
        }
        const prod = stats.get(sale.productId)!;
        prod.revenue += sale.totalAmount;
        prod.units += sale.quantity;
        prod.countryCounts[sale.country] = (prod.countryCounts[sale.country] || 0) + sale.totalAmount;
      }
    });
    return stats;
  }, [timeFrame]);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm);
    
    // If a country is selected, we only show products that have sales in that country (conceptually)
    // But typically products exist regardless. Let's just filter by search for now.
    return matchesSearch;
  });

  const totalRevenue = Array.from(productStats.values()).reduce((acc: number, curr: ProductStat) => acc + curr.revenue, 0);
  const totalUnits = Array.from(productStats.values()).reduce((acc: number, curr: ProductStat) => acc + curr.units, 0);

  return (
    <div className="min-h-screen bg-brand-black text-gray-300 font-sans selection:bg-brand-yellow selection:text-black">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-brand-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center font-bold text-white text-xl">S</div>
            <h1 className="text-xl font-bold tracking-tight text-white">Safe<span className="text-brand-yellow">Trade</span></h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4 text-sm font-medium">
                <button 
                    onClick={() => setTimeFrame('daily')}
                    className={`px-3 py-1 rounded transition-colors ${timeFrame === 'daily' ? 'bg-brand-yellow text-black' : 'hover:text-white'}`}
                >Daily</button>
                <button 
                    onClick={() => setTimeFrame('monthly')}
                    className={`px-3 py-1 rounded transition-colors ${timeFrame === 'monthly' ? 'bg-brand-yellow text-black' : 'hover:text-white'}`}
                >Monthly</button>
                <button 
                    onClick={() => setTimeFrame('annual')}
                    className={`px-3 py-1 rounded transition-colors ${timeFrame === 'annual' ? 'bg-brand-yellow text-black' : 'hover:text-white'}`}
                >Annual</button>
            </nav>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase font-bold">Total Revenue</span>
                <span className="text-brand-yellow font-mono font-bold text-lg">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero/Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-brand-card p-4 rounded-xl border border-gray-800 flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-brand-dark rounded-lg text-brand-yellow"><BarChart3 /></div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                </div>
            </div>
            <div className="bg-brand-card p-4 rounded-xl border border-gray-800 flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-brand-dark rounded-lg text-brand-red"><Package /></div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Units Sold</p>
                    <p className="text-2xl font-bold text-white">{totalUnits.toLocaleString()}</p>
                </div>
            </div>
            <div className="bg-brand-card p-4 rounded-xl border border-gray-800 flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-brand-dark rounded-lg text-blue-400"><Calendar /></div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Time Frame</p>
                    <p className="text-2xl font-bold text-white capitalize">{timeFrame}</p>
                </div>
            </div>
             <div className="bg-brand-card p-4 rounded-xl border border-gray-800 flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-brand-dark rounded-lg text-green-400"><Globe /></div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Active Markets</p>
                    <p className="text-2xl font-bold text-white">6</p>
                </div>
            </div>
        </div>

        {/* AI Section */}
        <AIAnalyst sales={MOCK_SALES_DATA} products={PRODUCTS} />

        {/* Charts */}
        <DashboardCharts sales={MOCK_SALES_DATA} timeFrame={timeFrame} />

        {/* Product Catalog Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Package className="text-brand-red" /> Product Performance
            </h2>
            
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search product or barcode..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-brand-card border border-gray-700 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:border-brand-yellow w-full md:w-80 transition-colors"
                />
            </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const stats = productStats.get(product.id) || { revenue: 0, units: 0, countryCounts: {} };
            
            // Find top country
            let topCountry = 'N/A';
            let maxVal = 0;
            Object.entries(stats.countryCounts).forEach(([country, val]) => {
                const numericVal = val as number;
                if (numericVal > maxVal) {
                    maxVal = numericVal;
                    topCountry = country;
                }
            });

            return (
              <ProductCard 
                key={product.id} 
                product={product}
                totalRevenue={stats.revenue}
                totalSales={stats.units}
                topCountry={topCountry}
              />
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500">
                <p>No products found matching "{searchTerm}"</p>
            </div>
        )}

      </main>
    </div>
  );
}

export default App;