export interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string;
  price: number;
  image: string;
}

export interface SalesRecord {
  id: string;
  productId: string;
  date: string; // ISO Date string
  quantity: number;
  country: Country;
  totalAmount: number;
}

export enum Country {
  USA = 'USA',
  Germany = 'Germany',
  UK = 'UK',
  Turkey = 'Turkey',
  Japan = 'Japan',
  Brazil = 'Brazil'
}

export interface SalesSummary {
  totalRevenue: number;
  totalUnits: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
}

export type TimeFrame = 'daily' | 'monthly' | 'annual';

export interface ChartDataPoint {
  name: string;
  value: number;
  revenue: number;
}