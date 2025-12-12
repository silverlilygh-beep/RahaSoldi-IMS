import React, { useState, useMemo } from 'react';
import { ExpenseRecord } from '../types';
import { Plus, Trash2, Search, DollarSign, Calendar, Tag } from 'lucide-react';

interface ExpensesManagerProps {
  expenses: ExpenseRecord[];
  onAdd: (expense: Omit<ExpenseRecord, 'id' | 'recordedAt'>) => void;
  onDelete: (id: string) => void;
  currencySymbol: string;
}

export const ExpensesManager: React.FC<ExpensesManagerProps> = ({ expenses, onAdd, onDelete, currencySymbol }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Rent', 'Utilities', 'Salaries', 'Supplies', 'Maintenance', 'Marketing', 'Other'];

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => 
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) return;

    onAdd({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    });

    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsFormOpen(false);
  };

  const totalExpenses = filteredExpenses.reduce((acc, exp) => acc + exp.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between md:col-span-1">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Recorded Expenses</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{currencySymbol}{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Action Bar */}
        <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-center justify-end">
            <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-800 focus:outline-none shadow-md transition-all"
            >
                {isFormOpen ? 'Close Form' : 'Record New Expense'}
                {!isFormOpen && <Plus className="h-5 w-5 ml-2" />}
            </button>
        </div>
      </div>

      {/* Add Expense Form */}
      {isFormOpen && (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">New Expense Entry</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            required
                            className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="e.g. Shop Rent for March"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-400 font-bold">{currencySymbol}</span>
                        </div>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            className="block w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                        required
                        className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            required
                            className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                    </div>
                </div>
                <div className="lg:col-span-5 flex justify-end mt-2">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-sm">
                        Save Record
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                            {expense.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                {expense.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-red-600">
                            -{currencySymbol}{expense.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                                onClick={() => onDelete(expense.id)}
                                className="text-slate-400 hover:text-red-600 transition-colors"
                                title="Delete Record"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </td>
                    </tr>
                ))}
                {filteredExpenses.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            No expenses found. Start tracking your business spending above.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};
