import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, Wallet, TrendingUp, TrendingDown, Edit, Trash } from 'lucide-react';


const API_URL = 'http://localhost/keuangan-pribadi/api.php';


const Card = ({ children, className = '' }) => (
  <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
    {children}
  </div>
);




const App = () => {
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    amount: '',
    date: '',
    id: null,
  });


  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  // Tambahkan state untuk loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Fungsi untuk mengambil data dari database
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };


  // Panggil fetchTransactions saat komponen dimuat
  useEffect(() => {
    fetchTransactions();
  }, []);


  useEffect(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
   
    setTotalIncome(income);
    setTotalExpense(expense);
  }, [transactions]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (formData.id) {
        // Update existing transaction
        const response = await fetch(API_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
      } else {
        // Add new transaction
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
      }
     
      // Refresh transactions
      fetchTransactions();
     
      // Reset form
      setFormData({
        type: 'income',
        category: '',
        amount: '',
        date: '',
        id: null,
      });
      setError(null);
    } catch (err) {
      setError('Failed to save transaction');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (transaction) => {
    setFormData({
      ...transaction,
      amount: parseFloat(transaction.amount),
    });
  };


  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
     
      // Refresh transactions
      fetchTransactions();
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };


  const pieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense },
  ];


  const COLORS = ['#10B981', '#EF4444'];


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 text-gray-100">
      <div className="container mx-auto p-8">
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-400 text-red-100 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}


        {loading && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}


        <div className="text-center mb-12 bg-white/10 backdrop-blur-md p-8 rounded-2xl">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2">
            Personal Finance Tracker
          </h1>
          <p className="text-gray-300 text-lg">Manage your money wisely</p>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/90 to-blue-800/90 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-400/30 rounded-full">
                <Wallet className="w-6 h-6 text-blue-100" />
              </div>
              <div>
                <p className="text-sm text-blue-200">Balance</p>
                <p className="text-2xl font-bold">
                  ${(totalIncome - totalExpense).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
         
          <Card className="bg-gradient-to-br from-emerald-600/90 to-emerald-800/90 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-400/30 rounded-full">
                <TrendingUp className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <p className="text-sm text-emerald-200">Total Income</p>
                <p className="text-2xl font-bold">
                  ${totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>


          <Card className="bg-gradient-to-br from-rose-600/90 to-rose-800/90 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-rose-400/30 rounded-full">
                <TrendingDown className="w-6 h-6 text-rose-100" />
              </div>
              <div>
                <p className="text-sm text-rose-200">Total Expenses</p>
                <p className="text-2xl font-bold">
                  ${totalExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>


        {/* Chart and Form Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90">
            <h2 className="text-xl font-semibold mb-4 text-purple-100">Income vs Expenses</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10B981', '#EF4444'][index % 2]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: ['#10B981', '#EF4444'][index % 2] }}
                  />
                  <span className="text-sm text-gray-300">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>


          {/* Form */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-slate-900/90">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              {formData.id ? 'Edit' : 'Add'} Transaction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-800 border-2 border-gray-700 text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g., Salary, Food, Transport"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 border-2 border-gray-700 text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-gray-800 border-2 border-gray-700 text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-800 border-2 border-gray-700 text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>


              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg shadow hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>{formData.id ? 'Update' : 'Add'} Transaction</span>
              </button>
            </form>
          </Card>
        </div>


        {/* Transactions Table */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-slate-900/90">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income'
                            ? 'bg-emerald-400/20 text-emerald-300'
                            : 'bg-rose-400/20 text-rose-300'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${parseFloat(transaction.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-rose-400 hover:text-rose-300 transition-colors ml-4"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};


export default App;