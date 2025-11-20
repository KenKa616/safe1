import { Product, SalesRecord, Country } from './types';

export const PRODUCT_NAMES = [
  "Domestos Thick Bleach", "Fairy Lemon", "Clear Men Shampoo", "Persil Power Caps",
  "Ariel 3in1 Pods", "Cif Cream Cleaner", "Vanish Stain Remover", "Harpic Power Plus",
  "Lenor Fabric Conditioner", "Comfort Intense", "Finish Quantum Tabs", "Dettol Surface Cleaner",
  "Lysol Disinfectant Spray", "Mr. Muscle Kitchen", "Pledge Wood Polish", "Glade Air Freshener",
  "Air Wick Electric", "Febreze Fabric Refresher", "Ajax Floor Cleaner", "Palmolive Dish Soap",
  "Sunlight Dish Liquid", "Omo Washing Powder", "Surf Tropical Lily", "Tide Liquid Detergent",
  "Gain Flings", "Downy Unstopables", "Bounty Paper Towels", "Charmin Ultra Soft",
  "Kleenex Tissues", "Scott Toilet Paper"
];

// Deterministic random helper
let seed = 12345;
const random = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const generateBarcode = (index: number): string => {
  const prefix = "869"; // Keeping 869 (Turkey) as the base region code for style
  const productCode = (1000 + index).toString();
  const checkDigit = Math.floor(random() * 10);
  return `${prefix}-${productCode}-${checkDigit}${Math.floor(random() * 1000)}`;
};

export const PRODUCTS: Product[] = PRODUCT_NAMES.map((name, index) => ({
  id: `prod-${index + 1}`,
  name,
  category: index < 10 ? "Laundry" : index < 20 ? "Surface Cleaners" : "Household",
  barcode: generateBarcode(index),
  price: 2.99 + Math.floor(random() * 1500) / 100,
  image: `https://picsum.photos/200/200?random=${index}`
}));

export const COUNTRIES = Object.values(Country);

// Generate sales for the last 365 days
export const generateSalesData = (): SalesRecord[] => {
  const sales: SalesRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < 2000; i++) {
    const daysAgo = Math.floor(random() * 365);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const product = PRODUCTS[Math.floor(random() * PRODUCTS.length)];
    const quantity = Math.floor(random() * 20) + 1;
    const country = COUNTRIES[Math.floor(random() * COUNTRIES.length)];
    
    sales.push({
      id: `sale-${i}`,
      productId: product.id,
      date: date.toISOString(),
      quantity,
      country,
      totalAmount: quantity * product.price
    });
  }
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const MOCK_SALES_DATA = generateSalesData();