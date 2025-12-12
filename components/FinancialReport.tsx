import React, { useMemo } from 'react';
import { InventoryItem, SaleRecord, ExpenseRecord } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Scale, Wallet } from 'lucide-react';

interface FinancialReportProps {
  inventory: InventoryItem[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  currencySymbol: string;
}

export const FinancialReport: React.FC<FinancialReportProps> = ({ inventory, sales, expenses, currencySymbol }) => {
  
  const financials = useMemo(() => {
    // 1. Calculate Income Statement Metrics
    const totalSales = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    
    // Calculate COGS (Cost of Goods Sold)
    const totalCOGS = sales.reduce((acc, s) => {
      const saleCost = s.items.reduce((iAcc, item) => iAcc + (item.costAtSale * item.quantity), 0);
      return acc + saleCost;
    }, 0);

    const grossProfit = totalSales - totalCOGS;
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const netIncome = grossProfit - totalExpenses;

    // 2. Calculate Balance Sheet Metrics
    // Assets
    const inventoryValue = inventory.reduce((acc, i) => acc + (i.costPrice * i.quantity), 0);
    // Estimated Cash = (Sales - Expenses) - (InventoryPurchased). 
    // Since we don't track inventory purchase history explicitly in this simplified model, 
    // we can approximate Cash Flow from Operations or just leave Cash as 'Net Income' based.
    // However, for a Balance Sheet, Assets = Liabilities + Equity.
    // Equity = Initial Capital + Retained Earnings (Net Income).
    // Let's assume Liabilities = 0 for now.
    // Assets = Inventory + Cash.
    // Equity = Net Income (simplified).
    // This won't balance perfectly without double-entry bookkeeping, so we will display components visually.
    
    return {
      totalSales,
      totalCOGS,
      grossProfit,
      totalExpenses,
      netIncome,
      inventoryValue
    };
  }, [inventory, sales, expenses]);

  const pnlData = [
    { name: 'Revenue', amount: financials.totalSales, fill: '#3b82f6' },
    { name: 'COGS', amount: financials.totalCOGS, fill: '#f59e0b' },
    { name: 'Expenses', amount: financials.totalExpenses, fill: '#ef4444' },
    { name: 'Net Profit', amount: financials.netIncome, fill: '#10b981' }
  ];

  const assetsData = [
    { name: 'Inventory Assets', value: financials.inventoryValue },
    { name: 'Est. Cash/Receivables', value: Math.max(0, financials.totalSales - financials.totalExpenses) } // Simplified cash view
  ];

  const COLORS = ['#6366f1', '#10b981'];

  return (
    <div className="space-y-6 animate-fade-in">
        
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-500">Total Revenue</p>
          <h3 className="text-2xl font-bold text-slate-800">{currencySymbol}{financials.totalSales.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-orange-400">
          <p className="text-sm font-medium text-slate-500">Gross Profit</p>
          <h3 className="text-2xl font-bold text-slate-800">{currencySymbol}{financials.grossProfit.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1">Margin: {financials.totalSales > 0 ? ((financials.grossProfit / financials.totalSales) * 100).toFixed(1) : 0}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-slate-500">Operating Expenses</p>
          <h3 className="text-2xl font-bold text-slate-800">{currencySymbol}{financials.totalExpenses.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
          <p className="text-sm font-medium text-slate-500">Net Income</p>
          <h3 className={`text-2xl font-bold ${financials.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currencySymbol}{financials.netIncome.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Statement Visualization */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    Income Statement Breakdown
                </h3>
            </div>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pnlData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                        <Tooltip 
                            formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, 'Amount']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                            {pnlData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Balance Sheet (Simplified) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <Scale className="w-5 h-5 mr-2 text-primary" />
                    Balance Sheet Snapshot
                </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center text-sm font-semibold text-slate-600 mb-2">
                        <Wallet className="w-4 h-4 mr-2" /> Assets
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Inventory Value:</span>
                            <span className="font-medium">{currencySymbol}{financials.inventoryValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Cash Flow (Est):</span>
                            <span className="font-medium">{currencySymbol}{Math.max(0, financials.totalSales - financials.totalExpenses).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-1 mt-2 flex justify-between text-sm font-bold text-indigo-700">
                            <span>Total Assets:</span>
                            <span>{currencySymbol}{(financials.inventoryValue + Math.max(0, financials.totalSales - financials.totalExpenses)).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center text-sm font-semibold text-slate-600 mb-2">
                            <TrendingDown className="w-4 h-4 mr-2" /> Liabilities
                        </div>
                        <div className="flex justify-between text-sm font-bold text-slate-800">
                            <span>Total Debts:</span>
                            <span>{currencySymbol}0.00</span>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center text-sm font-semibold text-slate-600 mb-2">
                            <TrendingUp className="w-4 h-4 mr-2" /> Equity
                        </div>
                        <div className="flex justify-between text-sm font-bold text-green-700">
                            <span>Retained Earnings:</span>
                            <span>{currencySymbol}{financials.netIncome.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-32">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={assetsData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={5}
                            dataKey="value"
                        >
                        {assetsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                        <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};
