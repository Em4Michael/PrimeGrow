import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Loading from './Loading';
import {
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
import { FaShoppingCart, FaChartLine, FaDownload, FaPlus, FaMoneyBill } from 'react-icons/fa';
import axios from 'axios';
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

const SalesDashboard: React.FC = () => {
  const [salesReport, setSalesReport] = useState<any>({ actualSales: 0, predictedSales: 0, idealSales: 0, usersByLocation: [], usersByName: [] });
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [stockForm, setStockForm] = useState<StockFormData>({
    item: '', quantity: 0, pricePerCarton: 0, stemAmount: 2, totalPlantAmount: 500, weeklyCapacity: 0,
  });
  const [feeForm, setFeeForm] = useState<FeeFormData>({ deliveryFee: 0, taxRate: 0 });
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    userId: '', items: [], address: '', paymentMethod: 'card',
  });
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [fees, setFees] = useState<FeeFormData | null>({ deliveryFee: 0, taxRate: 0 });
  const [orders, setOrders] = useState<any[]>([]); // New state for orders
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
        const salesResponse = await axios.get(`http://localhost:5000/api/sales-reports?timeframe=${timeFilter}`, config);
        const report = salesResponse.data.recentReport || salesResponse.data.savedReports?.[0] || {
          actualSales: 0, predictedSales: 0, idealSales: 0, usersByLocation: [], usersByName: []
        };
        setSalesReport(report);

        const stockResponse = await axios.get('http://localhost:5000/api/stock', config);
        setStockItems(stockResponse.data || []);

        const usersResponse = await axios.get('http://localhost:5000/api/users', config);
        setUsers(usersResponse.data || []);

        const feeResponse = await axios.get('http://localhost:5000/api/fee/recent', config);
        setFees(feeResponse.data || { deliveryFee: 0, taxRate: 0 });

        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:5000/api/orders', config); // Assume this endpoint exists
        setOrders(ordersResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        setError(error.response?.data?.error || error.message || 'Failed to load dashboard data');
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
        'http://localhost:5000/api/order/status',
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
  
  const latestStock = useMemo(() => {
    return stockItems.length > 0 ? stockItems[stockItems.length - 1] : null;
  }, [stockItems]);

  const totalSales = useMemo(() => {
    const subtotal = orderForm.items.reduce((sum, item) => sum + item.quantity * item.pricePerCarton, 0);
    if (!fees) return subtotal;
    const taxAmount = subtotal * (fees.taxRate / 100);
    return subtotal + fees.deliveryFee + taxAmount;
  }, [orderForm.items, fees]);

  const salesComparisonData = {
    labels: ['Actual', 'Predicted', 'Ideal'],
    datasets: [{
      label: 'Sales Comparison ($)',
      data: [
        salesReport?.actualSales || 0,
        salesReport?.predictedSales || 0,
        salesReport?.idealSales || 0,
      ],
      backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0'],
    }],
  };

  const salesTrendData = {
    labels: ['Start', 'Mid', 'End'],
    datasets: [
      {
        label: 'Actual Sales',
        data: [
          (salesReport?.actualSales * 0.8) || 4500,
          salesReport?.actualSales || 7000,
          (salesReport?.actualSales * 1.2) || 8900,
        ],
        borderColor: '#36A2EB',
        tension: 0.4,
      },
      {
        label: 'Predicted Sales',
        data: [
          (salesReport?.predictedSales * 0.8) || 4800,
          salesReport?.predictedSales || 7200,
          (salesReport?.predictedSales * 1.2) || 9100,
        ],
        borderColor: '#FFCE56',
        tension: 0.4,
      },
    ],
  };

  const salesByRegionData = {
    labels: salesReport?.usersByLocation?.map(loc => loc.address) || [],
    datasets: [{
      label: 'Sales by Region ($)',
      data: salesReport?.usersByLocation?.map(loc => loc.totalSales || 0) || [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#C9CB3F', '#66CCCC', '#FF6666', '#CC99CC'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const salesBySalespersonData = {
    labels: salesReport?.usersByName?.map(user => user.name) || [],
    datasets: [{
      label: 'Sales by Individual ($)',
      data: salesReport?.usersByName?.map(user => user.totalSales || 0) || [],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      hoverBackgroundColor: 'rgba(255, 99, 132, 1)',
      hoverBorderColor: 'rgba(255, 99, 132, 1)',
      borderRadius: 5,
      barThickness: 30,
    }],
  };

  const maxSalesValue = Math.max(
    salesReport?.actualSales || 0,
    salesReport?.predictedSales || 0,
    salesReport?.idealSales || 0,
    10000
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(maxSalesValue * 1.2 / 1000) * 1000,
        ticks: {
          stepSize: Math.ceil(maxSalesValue / 5000) * 1000,
          callback: (value: number) => `$${value.toLocaleString()}`,
          font: { size: 10 },
        },
      },
      x: {
        ticks: {
          font: { size: 10 },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: $${context.raw.toFixed(2)}`,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { boxWidth: 15, padding: 15, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: $${context.raw.toFixed(2)}`,
        },
      },
      title: {
        display: true,
        text: 'Sales by Region',
        font: { size: 16 },
        padding: { top: 10, bottom: 20 },
      },
    },
    animation: { animateScale: true, animateRotate: true },
  };

  const enhancedBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString()}`,
          font: { size: 12 },
          color: '#666',
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
      x: {
        ticks: {
          font: { size: 12 },
          color: '#666',
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
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
          label: (context: any) => `${context.label}: $${context.raw.toFixed(2)}`,
        },
      },
      title: {
        display: true,
        text: 'Sales by Salesperson',
        font: { size: 16 },
        padding: { top: 10, bottom: 20 },
        color: '#333',
      },
    },
    animation: { duration: 1500, easing: 'easeOutBounce' },
  };

  const handleCreateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const response = await axios.post('http://localhost:5000/api/stock', stockForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await axios.post('http://localhost:5000/api/fee', feeForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await axios.post('http://localhost:5000/api/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setOrderForm({ userId: '', items: [], address: '', paymentMethod: 'card' });
        const salesResponse = await axios.get(`http://localhost:5000/api/sales-reports?timeframe=${timeFilter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    <div className="p-6 text-center text-red-500">
      {error}
      <button
        onClick={() => setLoading(true)}
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-0 sm:p-0 bg-gray-100 min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Sales Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto">
              <FaDownload className="mr-2" /> Export
            </button>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border w-full sm:w-auto"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Sales Summary Card - 2 columns on small screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">Actual Sales</h3>
            <p className="text-xl font-bold text-gray-800">${(salesReport?.actualSales || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">Predicted Sales</h3>
            <p className="text-xl font-bold text-gray-800">${(salesReport?.predictedSales || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">Ideal Sales</h3>
            <p className="text-xl font-bold text-gray-800">${(salesReport?.idealSales || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Sales (Orders)</h3>
            <p className="text-xl font-bold text-gray-800">${totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Sales Comparison</h2>
            <div className="relative" style={{ height: '15rem' }}>
              <Bar data={salesComparisonData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg md:col-span-2 w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Sales Trend</h2>
            <div className="relative" style={{ height: '15rem' }}>
              <Line data={salesTrendData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg w-full">
            <div className="relative" style={{ height: '15rem' }}>
              <Pie data={salesByRegionData} options={pieChartOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg md:col-span-2 w-full">
            <div className="relative" style={{ height: '15rem' }}>
              <Bar data={salesBySalespersonData} options={enhancedBarChartOptions} />
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
            <FaShoppingCart className="mr-2" /> Manage Orders
          </h2>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Order ID</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Delivery Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-2">{order._id}</td>
                      <td className="p-2">{users.find((u) => u._id === order.user)?.name || 'Unknown'}</td>
                      <td className="p-2">${order.total.toLocaleString()}</td>
                      <td className="p-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value, undefined)}
                          className="p-1 border rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={order.deliveryStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, undefined, e.target.value)}
                          className="p-1 border rounded"
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
            <p>No orders available.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
            <FaPlus className="mr-2" /> Create Stock
          </h2>
          <form onSubmit={handleCreateStock} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Enter item name"
              value={stockForm.item}
              onChange={(e) => setStockForm({ ...stockForm, item: e.target.value })}
              className="p-2 border rounded w-full"
              required
            />
            <input
              type="number"
              placeholder="Enter quantity"
              value={stockForm.quantity || ''}
              onChange={(e) => setStockForm({ ...stockForm, quantity: Number(e.target.value) })}
              className="p-2 border rounded w-full"
              min="0"
              required
            />
            <input
              type="number"
              placeholder="Enter price per carton"
              value={stockForm.pricePerCarton || ''}
              onChange={(e) => setStockForm({ ...stockForm, pricePerCarton: Number(e.target.value) })}
              className="p-2 border rounded w-full"
              min="0"
              step="0.01"
              required
            />
            <input
              type="number"
              placeholder="Enter stem amount"
              value={stockForm.stemAmount}
              onChange={(e) => setStockForm({ ...stockForm, stemAmount: Number(e.target.value) })}
              className="p-2 border rounded w-full"
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Enter total plant amount"
              value={stockForm.totalPlantAmount}
              onChange={(e) => setStockForm({ ...stockForm, totalPlantAmount: Number(e.target.value) })}
              className="p-2 border rounded w-full"
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Enter weekly capacity"
              value={stockForm.weeklyCapacity || ''}
              onChange={(e) => setStockForm({ ...stockForm, weeklyCapacity: Number(e.target.value) })}
              className="p-2 border rounded w-full"
              min="0"
              required
            />
            <button type="submit" className="col-span-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full">
              Create Stock
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
            <FaMoneyBill className="mr-2" /> Create Fee
          </h2>
          <form onSubmit={handleCreateFee} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Enter delivery fee"
              value={feeForm.deliveryFee || ''}
              onChange={(e) => setFeeForm({ ...feeForm, deliveryFee: Number(e.target.value) })}
              className="p-2 border rounded w-full"
              min="0"
              step="0.01"
              required
            />
            <input
              type="number"
              placeholder="Enter tax rate (%)"
              value={feeForm.taxRate || ''}
              onChange={(e) => setFeeForm({ ...feeForm, taxRate: Number(e.target.value) })}
              className="p-2 border rounded w-full"
              min="0"
              max="100"
              step="0.01"
              required
            />
            <button type="submit" className="col-span-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
              Create Fee
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
            <FaShoppingCart className="mr-2" /> Create Customer Order
          </h2>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={orderForm.userId}
                onChange={(e) => setOrderForm({ ...orderForm, userId: e.target.value })}
                className="p-2 border rounded w-full"
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
                className="p-2 border rounded w-full"
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
                className="p-2 border rounded sm:col-span-2 w-full"
                required
              />
            </div>
            <div>
              <h3 className="font-medium mb-2">Add Items</h3>
              {latestStock ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                  <span className="flex-1">
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
                        items: qty > 0
                          ? [{ itemId: latestStock._id, quantity: qty, pricePerCarton: latestStock.pricePerCarton }]
                          : [],
                      }));
                    }}
                    className="p-2 border rounded w-full sm:w-20"
                    required
                  />
                </div>
              ) : (
                <p>No stock items available.</p>
              )}
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold">
                Subtotal: ${(orderForm.items[0]?.quantity * latestStock?.pricePerCarton || 0).toFixed(2)}
              </p>
              {fees && (
                <>
                  <p className="text-sm text-gray-600">Delivery Fee: ${fees.deliveryFee.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    Tax ({fees.taxRate}%): ${((orderForm.items[0]?.quantity * latestStock?.pricePerCarton || 0) * (fees.taxRate / 100)).toFixed(2)}
                  </p>
                </>
              )}
              <p className="text-lg font-semibold">Total Sales: ${totalSales.toFixed(2)}</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;