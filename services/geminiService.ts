import { GoogleGenAI } from "@google/genai";
import { SalesRecord, Product } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeSalesData = async (
  query: string,
  sales: SalesRecord[],
  products: Product[]
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Please configure your API_KEY to use AI insights.";

  // Prepare a summarized dataset to avoid token limits
  // We aggregate sales by product and country for the prompt
  const summary = sales.reduce((acc, sale) => {
    const product = products.find(p => p.id === sale.productId);
    const productName = product ? product.name : "Unknown";
    const key = `${productName} (${sale.country})`;
    
    if (!acc[key]) {
      acc[key] = { units: 0, revenue: 0 };
    }
    acc[key].units += sale.quantity;
    acc[key].revenue += sale.totalAmount;
    return acc;
  }, {} as Record<string, { units: number; revenue: number }>);

  const promptData = JSON.stringify(Object.entries(summary).slice(0, 50)); // Limit size

  const prompt = `
    You are a senior data analyst for a cleaning products sales company.
    User Query: "${query}"
    
    Here is a summary of the sales data (Product Name + Country -> Units Sold, Revenue):
    ${promptData}
    
    Provide a concise, professional insight or answer based on this data. 
    Focus on trends, top performers, or specific countries if asked.
    Keep the response under 100 words.
    Respond in English.
    Use a confident, business-like tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to analyze data at the moment. Please try again.";
  }
};