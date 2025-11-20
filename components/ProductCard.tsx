import React from 'react';
import { Product } from '../types';
import Barcode from './Barcode';
import { ShoppingCart, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  totalSales: number;
  totalRevenue: number;
  topCountry: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, totalSales, totalRevenue, topCountry }) => {
  return (
    <div className="bg-brand-card border border-gray-800 hover:border-brand-yellow transition-all duration-300 p-4 rounded-xl flex flex-col gap-4 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-brand-yellow/20"></div>
      
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider">{product.category}</span>
          <h3 className="text-lg font-bold text-white mt-1 leading-tight">{product.name}</h3>
        </div>
        <div className="bg-brand-dark p-2 rounded-lg border border-gray-800">
          <ShoppingCart size={16} className="text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 my-2">
        <div className="bg-brand-black p-2 rounded border border-gray-800">
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-brand-yellow font-mono font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-brand-black p-2 rounded border border-gray-800">
            <p className="text-xs text-gray-500">Units Sold</p>
            <p className="text-white font-mono font-bold">{totalSales}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <TrendingUp size={12} className="text-brand-red" />
        <span>Top Market: <span className="text-white font-semibold">{topCountry}</span></span>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className="flex justify-between items-end">
            <div className="text-xl font-bold text-white">${product.price.toFixed(2)}</div>
             <Barcode code={product.barcode} className="w-32 opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;