import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Loading from './Loading';
import { motion } from 'framer-motion';
import { ChartOptions, Scale, Tick, TooltipItem } from 'chart.js';import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaShoppingCart, FaDownload, FaPlus, FaMoneyBill } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Interfaces remain unchanged
interface StockFormData {
  item: string;
  quantity: number;
  pricePerCarton: number;
  stemAmount: number;
  totalPlantAmount: number;
  weeklyCapacity: number;
}

interface FeeFormData {
  deliveryFee: number;
  taxRate: number;
}

interface OrderFormData {
  userId: string;
  items: { itemId: string; quantity: number; pricePerCarton: number }[];
  address: string;
  paymentMethod: 'card' | 'transfer';
}

interface LocationSales {
  address: string;
  totalSales: number;
}

interface UserSales {
  name: string;
  totalSales: number;
}

interface SalesReport {
  actualSales: number;
  predictedSales: number;
  idealSales: number;
  usersByLocation: LocationSales[];
  usersByName: UserSales[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://primegrow-server.onrender.com';

const SalesDashboard: React.FC = () => {
  const [salesReport, setSalesReport] = useState<SalesReport>({
    actualSales: 0,
    predictedSales: 0,
    idealSales: 0,
    usersByLocation: [],
    usersByName: [],
  });
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [stockForm, setStockForm] = useState<StockFormData>({
    item: '',
    quantity: 0,
    pricePerCarton: 0,
    stemAmount: 2,
    totalPlantAmount: 500,
    weeklyCapacity: 0,
  });
  const [feeForm, setFeeForm] = useState<FeeFormData>({ deliveryFee: 0, taxRate: 0 });
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    userId: '',
    items: [],
    address: '',
    paymentMethod: 'card',
  });
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [fees, setFees] = useState<FeeFormData | null>({ deliveryFee: 0, taxRate: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = Cookies.get('token');
      if (!token) {
        setSalesReport({ actualSales: 0, predictedSales: 0, idealSales: 0, usersByLocation: [], usersByName: [] });
        setStockItems([]);
        setUsers([]);
        setFees({ deliveryFee: 0, taxRate: 0 });
        setOrders([]);
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const salesResponse = await axios.get(`${API_URL}/api/sales-reports?timeframe=${timeFilter}`, config);
        const report = salesResponse.data.recentReport || salesResponse.data.savedReports?.[0] || {
          actualSales: 0,
          predictedSales: 0,
          idealSales: 0,
          usersByLocation: [],
          usersByName: [],
        };
        setSalesReport(report);
        const stockResponse = await axios.get(`${API_URL}/api/stock`, config);
        setStockItems(stockResponse.data || []);
        const usersResponse = await axios.get(`${API_URL}/api/users`, config);
        setUsers(usersResponse.data || []);
        const feeResponse = await axios.get(`${API_URL}/api/fee/recent`, config);
        setFees(feeResponse.data || { deliveryFee: 0, taxRate: 0 });
        const ordersResponse = await axios.get(`${API_URL}/api/orders`, config);
        setOrders(ordersResponse.data || []);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ error?: string }>;
          console.error('Error fetching data:', axiosError.response?.data || axiosError.message);
          setError(axiosError.response?.data?.error || axiosError.message || 'Failed to load dashboard data');
        } else {
          const genericError = error as Error;
          console.error('Error fetching data:', genericError.message);
          setError(genericError.message || 'Failed to load dashboard data');
        }
        setSalesReport({ actualSales: 0, predictedSales: 0, idealSales: 0, usersByLocation: [], usersByName: [] });
        setStockItems([]);
        setUsers([]);
        setFees({ deliveryFee: 0, taxRate: 0 });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeFilter]);

  const handleUpdateOrderStatus = async (orderId: string, status?: string, deliveryStatus?: string) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.put(
        `${API_URL}/api/order/status`,
        { orderId, status, deliveryStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: status || order.status, deliveryStatus: deliveryStatus || order.deliveryStatus } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    }
  };

  const latestStock = useMemo(() => stockItems.length > 0 ? stockItems[stockItems.length - 1] : null, [stockItems]);

  const totalSales = useMemo(() => {
    const subtotal = orderForm.items.reduce((sum, item) => sum + item.quantity * item.pricePerCarton, 0);
    if (!fees) return subtotal;
    const taxAmount = subtotal * (fees.taxRate / 100);
    return subtotal + fees.deliveryFee + taxAmount;
  }, [orderForm.items, fees]);

  // Chart Data (unchanged)
  const salesComparisonData = {
    labels: ['Actual', 'Predicted', 'Ideal'],
    datasets: [{
      label: 'Sales Comparison ($)',
      data: [salesReport.actualSales || 0, salesReport.predictedSales || 0, salesReport.idealSales || 0],
      backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0'],
    }],
  };

  const salesTrendData = {
    labels: ['Start', 'Mid', 'End'],
    datasets: [
      { label: 'Actual Sales', data: [(salesReport.actualSales * 0.8) || 4500, salesReport.actualSales || 7000, (salesReport.actualSales * 1.2) || 8900], borderColor: '#36A2EB', tension: 0.4 },
      { label: 'Predicted Sales', data: [(salesReport.predictedSales * 0.8) || 4800, salesReport.predictedSales || 7200, (salesReport.predictedSales * 1.2) || 9100], borderColor: '#FFCE56', tension: 0.4 },
    ],
  };

  const salesByRegionData = {
    labels: salesReport.usersByLocation.map(loc => loc.address) || [],
    datasets: [{
      label: 'Sales by Region ($)',
      data: salesReport.usersByLocation.map(loc => loc.totalSales || 0) || [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CB3F', '#66CCCC', '#FF6666', '#CC99CC'],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const salesBySalespersonData = {
    labels: salesReport.usersByName.map(user => user.name) || [],
    datasets: [{
      label: 'Sales by Individual ($)',
      data: salesReport.usersByName.map(user => user.totalSales || 0) || [],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      hoverBackgroundColor: 'rgba(255, 99, 132, 1)',
      hoverBorderColor: 'rgba(255, 99, 132, 1)',
      borderRadius: 5,
      barThickness: 20, // Reduced for mobile
    }],
  };

  const maxSalesValue = Math.max(salesReport.actualSales || 0, salesReport.predictedSales || 0, salesReport.idealSales || 0, 10000);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(maxSalesValue * 1.2 / 1000) * 1000,
        ticks: {
          stepSize: Math.ceil(maxSalesValue / 5000) * 1000,
          callback: function (this: Scale, tickValue: string | number): string {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return `$${value.toLocaleString()}`;
          },
          font: { size: 8 },
        },
      },
      x: {
        ticks: {
          font: { size: 8 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 8 }, boxWidth: 10 },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>): string => {
            const value = context.raw as number;
            return `${context.dataset.label}: $${value.toFixed(2)}`;
          },
        },
        bodyFont: { size: 10 },
      },
    },
  };
  
  const pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10, font: { size: 8 } } },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'pie'>): string => {
            const value = context.raw as number; // Type assertion
            return `${context.label}: $${value.toFixed(2)}`;
          },
        },
        bodyFont: { size: 10 },
      },
      title: { display: true, text: 'Sales by Region', font: { size: 12 }, padding: { top: 5, bottom: 5 } },
    },
  };
  
  const enhancedBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (this: Scale, tickValue: string | number): string {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return `$${value.toLocaleString()}`;
          },
          font: { size: 8 },
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
      x: {
        ticks: {
          font: { size: 8 },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 10 },
        bodyFont: { size: 8 },
        padding: 6,
        callbacks: {
          label: (context: TooltipItem<'bar'>): string => {
            const value = context.raw as number;
            return `${context.label}: $${value.toFixed(2)}`;
          },
        },
      },
      title: {
        display: true,
        text: 'Sales by Salesperson',
        font: { size: 12 },
        padding: { top: 5, bottom: 5 },
        color: '#333',
      },
    },
  };

  const handleCreateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const response = await axios.post(`${API_URL}/api/stock`, stockForm, { headers: { Authorization: `Bearer ${token}` } });
      setStockItems([...stockItems, response.data]);
      setStockForm({ item: '', quantity: 0, pricePerCarton: 0, stemAmount: 2, totalPlantAmount: 500, weeklyCapacity: 0 });
    } catch (error) {
      console.error('Error creating stock:', error);
      setError('Failed to create stock');
    }
  };

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const response = await axios.post(`${API_URL}/api/fee`, feeForm, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 201) {
        setFeeForm({ deliveryFee: 0, taxRate: 0 });
        setFees(response.data.fee);
      }
    } catch (error) {
      console.error('Error creating fee:', error);
      setError('Failed to create fee');
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const total = totalSales;
      const orderPayload = { ...orderForm, total };
      const response = await axios.post(`${API_URL}/api/orders`, orderPayload, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        setOrderForm({ userId: '', items: [], address: '', paymentMethod: 'card' });
        const salesResponse = await axios.get(`${API_URL}/api/sales-reports?timeframe=${timeFilter}`, { headers: { Authorization: `Bearer ${token}` } });
        const report = salesResponse.data.recentReport || salesResponse.data.savedReports?.[0];
        setSalesReport(report);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order');
    }
  };

  if (loading) return <Loading />;
  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 text-center text-red-500"
    >
      {error}
      <button onClick={() => setLoading(true)} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Retry
      </button>
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-6xl mx-auto p-2 sm:p-4 w-full"
      >
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Sales Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button className="flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base">
              <FaDownload className="mr-1 sm:mr-2" /> Export
            </button>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg border w-full sm:w-auto text-sm sm:text-base"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6"
        >
          {[
            { title: 'Actual Sales', value: salesReport.actualSales },
            { title: 'Predicted Sales', value: salesReport.predictedSales },
            { title: 'Ideal Sales', value: salesReport.idealSales },
            { title: 'Total Sales (Orders)', value: totalSales },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-3 sm:p-4 rounded-xl shadow-lg">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800">${(stat.value || 0).toLocaleString()}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6">
  {[
    { title: 'Sales Comparison', Component: Bar, data: salesComparisonData, options: chartOptions },
    { title: 'Sales Trend', Component: Line, data: salesTrendData, options: chartOptions },
    { title: 'Sales by Region', Component: Pie, data: salesByRegionData, options: pieChartOptions },
    { title: 'Sales by Salesperson', Component: Bar, data: salesBySalespersonData, options: enhancedBarChartOptions },
  ].map((chart, index) => (
    <motion.div
      key={chart.title}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg w-full"
    >
      <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-4">{chart.title}</h2>
      <div className="relative h-40 sm:h-48 md:h-60 w-full">
        {chart.Component === Bar && (
          <Bar data={chart.data} options={chart.options as ChartOptions<'bar'>} />
        )}
        {chart.Component === Line && (
          <Line data={chart.data} options={chart.options as ChartOptions<'line'>} />
        )}
        {chart.Component === Pie && (
          <Pie data={chart.data} options={chart.options as ChartOptions<'pie'>} />
        )}
      </div>
    </motion.div>
  ))}
</div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg mb-4 sm:mb-6 w-full"
        >
          <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-4 flex items-center">
            <FaShoppingCart className="mr-2" /> Manage Orders
          </h2>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-1 sm:p-2">Order ID</th>
                    <th className="p-1 sm:p-2">User</th>
                    <th className="p-1 sm:p-2">Total</th>
                    <th className="p-1 sm:p-2">Status</th>
                    <th className="p-1 sm:p-2">Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-1 sm:p-2 truncate max-w-[80px] sm:max-w-[100px]">{order._id}</td>
                      <td className="p-1 sm:p-2 truncate max-w-[80px] sm:max-w-[100px]">{users.find((u) => u._id === order.user)?.name || 'Unknown'}</td>
                      <td className="p-1 sm:p-2">${order.total.toLocaleString()}</td>
                      <td className="p-1 sm:p-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="p-1 border rounded w-full text-xs sm:text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                      <td className="p-1 sm:p-2">
                        <select
                          value={order.deliveryStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, undefined, e.target.value)}
                          className="p-1 border rounded w-full text-xs sm:text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs sm:text-sm">No orders available.</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg mb-4 sm:mb-6 w-full"
        >
          <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-4 flex items-center">
            <FaPlus className="mr-2" /> Create Stock
          </h2>
          <form onSubmit={handleCreateStock} className="grid grid-cols-1 gap-2 sm:gap-4">
            {[
              { placeholder: 'Enter item name', value: stockForm.item, onChange: (e: any) => setStockForm({ ...stockForm, item: e.target.value }) },
              { placeholder: 'Enter quantity', value: stockForm.quantity, onChange: (e: any) => setStockForm({ ...stockForm, quantity: Number(e.target.value) }), type: 'number', min: 0 },
              { placeholder: 'Enter price per carton', value: stockForm.pricePerCarton, onChange: (e: any) => setStockForm({ ...stockForm, pricePerCarton: Number(e.target.value) }), type: 'number', min: 0, step: '0.01' },
              { placeholder: 'Enter stem amount', value: stockForm.stemAmount, onChange: (e: any) => setStockForm({ ...stockForm, stemAmount: Number(e.target.value) }), type: 'number', min: 1 },
              { placeholder: 'Enter total plant amount', value: stockForm.totalPlantAmount, onChange: (e: any) => setStockForm({ ...stockForm, totalPlantAmount: Number(e.target.value) }), type: 'number', min: 1 },
              { placeholder: 'Enter weekly capacity', value: stockForm.weeklyCapacity, onChange: (e: any) => setStockForm({ ...stockForm, weeklyCapacity: Number(e.target.value) }), type: 'number', min: 0 },
            ].map((field, index) => (
              <input
                key={index}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={field.value || ''}
                onChange={field.onChange}
                className="p-1 sm:p-2 border rounded w-full text-xs sm:text-sm"
                min={field.min}
                step={field.step}
                required
              />
            ))}
            <button type="submit" className="px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full text-sm sm:text-base">
              Create Stock
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg mb-4 sm:mb-6 w-full"
        >
          <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-4 flex items-center">
            <FaMoneyBill className="mr-2" /> Create Fee
          </h2>
          <form onSubmit={handleCreateFee} className="grid grid-cols-1 gap-2 sm:gap-4">
            <input
              type="number"
              placeholder="Enter delivery fee"
              value={feeForm.deliveryFee || ''}
              onChange={(e) => setFeeForm({ ...feeForm, deliveryFee: Number(e.target.value) })}
              className="p-1 sm:p-2 border rounded w-full text-xs sm:text-sm"
              min="0"
              step="0.01"
              required
            />
            <input
              type="number"
              placeholder="Enter tax rate (%)"
              value={feeForm.taxRate || ''}
              onChange={(e) => setFeeForm({ ...feeForm, taxRate: Number(e.target.value) })}
              className="p-1 sm:p-2 border rounded w-full text-xs sm:text-sm"
              min="0"
              max="100"
              step="0.01"
              required
            />
            <button type="submit" className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full text-sm sm:text-base">
              Create Fee
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg mb-4 sm:mb-6 w-full"
        >
          <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-4 flex items-center">
            <FaShoppingCart className="mr-2" /> Create Customer Order
          </h2>
          <form onSubmit={handleCreateOrder} className="space-y-2 sm:space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:gap-4">
              <select
                value={orderForm.userId}
                onChange={(e) => setOrderForm({ ...orderForm, userId: e.target.value })}
                className="p-1 sm:p-2 border rounded w-full text-xs sm:text-sm"
                required
              >
                <option value="">Select Customer</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
              <select
                value={orderForm.paymentMethod}
                onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value as 'card' | 'transfer' })}
                className="p-1 sm:p-2 border rounded w-full text-xs sm:text-sm"
                required
              >
                <option value="card">Card</option>
                <option value="transfer">Transfer</option>
              </select>
              <input
                type="text"
                placeholder="Enter delivery address"
                value={orderForm.address}
                onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                className="p-1 sm:p-2 border rounded w-full text-xs sm:text-sm"
                required
              />
            </div>
            <div>
              <h3 className="font-medium mb-1 sm:mb-2 text-xs sm:text-sm">Add Items</h3>
              {latestStock ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-xs sm:text-sm truncate">
                    {latestStock.item} (Price: ${latestStock.pricePerCarton.toFixed(2)})
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Quantity"
                    value={orderForm.items[0]?.quantity || ''}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setOrderForm(prev => ({
                        ...prev,
                        items: qty > 0 ? [{ itemId: latestStock._id, quantity: qty, pricePerCarton: latestStock.pricePerCarton }] : [],
                      }));
                    }}
                    className="p-1 sm:p-2 border rounded w-full text-xs sm:text-sm"
                    required
                  />
                </div>
              ) : (
                <p className="text-xs sm:text-sm">No stock items available.</p>
              )}
            </div>
            <div className="mt-2 sm:mt-4">
              <p className="text-sm sm:text-base font-semibold">
                Subtotal: ${(orderForm.items[0]?.quantity * latestStock?.pricePerCarton || 0).toFixed(2)}
              </p>
              {fees && (
                <>
                  <p className="text-xs text-gray-600">Delivery Fee: ${fees.deliveryFee.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">
                    Tax ({fees.taxRate}%): ${((orderForm.items[0]?.quantity * latestStock?.pricePerCarton || 0) * (fees.taxRate / 100)).toFixed(2)}
                  </p>
                </>
              )}
              <p className="text-sm sm:text-base font-semibold">Total Sales: ${totalSales.toFixed(2)}</p>
            </div>
            <button type="submit" className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full text-sm sm:text-base">
              Place Order
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SalesDashboard;