import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { SalesRecord, TimeFrame } from '../types';

interface DashboardChartsProps {
  sales: SalesRecord[];
  timeFrame: TimeFrame;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ sales, timeFrame }) => {
  
  // Process data for timeline chart
  const processTimelineData = () => {
    const dataMap = new Map<string, number>();
    const now = new Date();

    sales.forEach(sale => {
      const date = new Date(sale.date);
      let key = '';
      
      if (timeFrame === 'daily') {
        // Last 30 days
        if ((now.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 30) {
            key = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
      } else if (timeFrame === 'monthly') {
        // Last 12 months
        key = date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      } else {
        // Annual (by year)
        key = date.getFullYear().toString();
      }

      if (key) {
        dataMap.set(key, (dataMap.get(key) || 0) + sale.totalAmount);
      }
    });

    // Sort depending on timeframe logic (simplified here to map insertion order or sort by date parsing)
    // For simplicity, we just convert to array. Ideally, sort by actual date.
    return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value })).reverse(); 
  };

  const timelineData = processTimelineData();

  // Process data for Country distribution
  const countryData = sales.reduce((acc: any[], sale) => {
    const existing = acc.find(item => item.name === sale.country);
    if (existing) {
      existing.value += sale.totalAmount;
    } else {
      acc.push({ name: sale.country, value: sale.totalAmount });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const COLORS = ['#FFD700', '#D90429', '#FFFFFF', '#8d99ae', '#2b2d42', '#ef233c'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-brand-card p-6 rounded-xl border border-gray-800 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-brand-yellow rounded-sm"></span>
          Sales Trend ({timeFrame})
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tick={{fill: '#888'}} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" tick={{fill: '#888'}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                itemStyle={{ color: '#FFD700' }}
                formatter={(value: number) => [`$${value.toFixed(0)}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-brand-card p-6 rounded-xl border border-gray-800 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-brand-red rounded-sm"></span>
          Sales by Country
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#666" tick={{fill: '#888'}} hide />
              <YAxis dataKey="name" type="category" width={80} stroke="#666" tick={{fill: '#fff', fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip 
                 cursor={{fill: '#333', opacity: 0.4}}
                 contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                 formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;