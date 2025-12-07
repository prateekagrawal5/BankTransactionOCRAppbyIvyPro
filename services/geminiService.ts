import { GoogleGenAI, Type, Part } from "@google/genai";
import { AnalysisResult, Transaction } from '../types';

// The key must use a specific prefix (like VITE_) to be exposed to the browser.
// We are renaming API_KEY to VITE_API_KEY
const API_KEY = process.env.VITE_API_KEY;

if (!API_KEY) {
    throw new Error("VITE_API_KEY environment variable not set. Please set it in Netlify.");
}

// // Assume process.env.API_KEY is configured externally
// const API_KEY = process.env.API_KEY;
// if (!API_KEY) {
//   throw new Error("API_KEY environment variable not set");
// }

// const ai = new GoogleGenAI({ apiKey: API_KEY });

const transactionSchema = {
  type: Type.OBJECT,
  properties: {
    date: { type: Type.STRING, description: "Transaction date (e.g., YYYY-MM-DD)" },
    description: { type: Type.STRING, description: "A brief description of the transaction" },
    amount: { type: Type.NUMBER, description: "Transaction amount. Use negative for debits/expenses and positive for credits/income." },
    category: { type: Type.STRING, description: "A suitable category like 'Groceries', 'Salary', 'Utilities'" },
    notes: { type: Type.STRING, description: "Any additional notes, can be empty." },
    statementSource: { type: Type.STRING, description: "The source document of the transaction, e.g., 'Document 1', 'Document 2'." },
  },
  required: ['date', 'description', 'amount', 'category', 'statementSource'],
};

export const analyzeStatement = async (fileParts: Part[]): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `You are an expert financial analyst. Your task is to meticulously analyze the provided bank statement image(s) or PDF(s).

  Your response must have two parts: 'transactions' and 'insights'.

  1.  **Transactions**: Extract all transactions from all documents.
      *   For each transaction, identify the date, description, and amount.
      *   Represent expenses as NEGATIVE numbers and income as POSITIVE numbers.
      *   Assign a relevant category (e.g., 'Groceries', 'Salary', 'Utilities', 'Entertainment', 'Transfer').
      *   Identify the source for each transaction using 'Document 1', 'Document 2', etc., in the 'statementSource' field.
  
  2.  **Insights**: Based on the transaction descriptions and amounts, provide a few (maximum 5) intelligent insights.
      *   Look for recurring subscriptions, significant one-time purchases, spending habit patterns, or potential savings opportunities.
      *   Each insight should be a short, clear, and helpful string.
      *   For example: "You have a recurring subscription to 'Example.com' for $9.99." or "Your spending on 'Food & Dining' has increased this month."

  Return a single, strict JSON object according to the provided schema. Do not include any other text or explanations in your response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          ...fileParts,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transactions: {
              type: Type.ARRAY,
              items: transactionSchema,
            },
            insights: {
              type: Type.ARRAY,
              description: "A list of intelligent insights derived from the transactions.",
              items: { type: Type.STRING }
            }
          },
        },
      },
    });

    if (!response.text) {
        throw new Error("Received an empty response from the API.");
    }
    
    const jsonResponse = JSON.parse(response.text);
    
    if (!jsonResponse.transactions || !Array.isArray(jsonResponse.transactions)) {
        throw new Error("Invalid data structure in API response. 'transactions' array not found.");
    }
    if (!jsonResponse.insights) {
      jsonResponse.insights = []; // Handle cases where API might not return insights
    }

    const transactions = jsonResponse.transactions as Transaction[];
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      transactions,
      insights: jsonResponse.insights as string[]
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if(error instanceof Error && error.message.includes('429')) {
      throw new Error("API rate limit exceeded. Please wait a moment and try again.");
    }
    throw new Error("Failed to analyze the statement. Please ensure the uploaded file is a clear bank statement.");
  }
};
