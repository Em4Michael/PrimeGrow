import { useState, useEffect } from 'react';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import Image from 'next/image';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Summary {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: string;
  tooltip: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://primegrow-server.onrender.com';

const SummaryCard = () => {
  const [summaries, setSummaries] = useState<Summary[]>([
    { title: 'Total Sales', value: '$0', change: '0%', isUp: true, icon: '/assets/Icon.svg', tooltip: 'Sales this month' },
    { title: 'Total Orders', value: '0', change: '0%', isUp: true, icon: '/assets/Icon (1).svg', tooltip: 'Orders this week' },
    { title: 'Total Pending', value: '0', change: '0%', isUp: true, icon: '/assets/Icon (2).svg', tooltip: 'Pending orders' },
    { title: 'Total Users', value: '0', change: '0%', isUp: true, icon: '/assets/Icon (3).svg', tooltip: 'Active users' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setLoading(true);
      const token = Cookies.get('token');

      if (!token) {
        setSummaries([
          { title: 'Total Sales', value: '$0', change: '0%', isUp: true, icon: '/assets/Icon.svg', tooltip: 'Sales this month' },
          { title: 'Total Orders', value: '0', change: '0%', isUp: true, icon: '/assets/Icon (1).svg', tooltip: 'Orders this week' },
          { title: 'Total Pending', value: '0', change: '0%', isUp: true, icon: '/assets/Icon (2).svg', tooltip: 'Pending orders' },
          { title: 'Total Users', value: '0', change: '0%', isUp: true, icon: '/assets/Icon (3).svg', tooltip: 'Active users' },
        ]);
        setLoading(false);
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const salesResponse = await axios.get(`${API_URL}/api/sales-reports`, config);
        const salesData = salesResponse.data.recentReport || {
          totalSales: 0,
          totalOrders: 0,
          totalPendingOrders: 0,
        };

        const usersResponse = await axios.get(`${API_URL}/api/users`, config);
        const totalUsers = usersResponse.data.length || 0;

        const previousSalesData = salesResponse.data.savedReports?.[1] || {
          totalSales: 0,
          totalOrders: 0,
          totalPendingOrders: 0,
        };

        const calculateChange = (current: number, previous: number) => {
          if (previous === 0) return 0;
          const change = ((current - previous) / previous) * 100;
          return change.toFixed(1);
        };

        setSummaries([
          {
            title: 'Total Sales',
            value: `$${Number(salesData.totalSales || 0).toLocaleString()}`,
            change: `${calculateChange(salesData.totalSales, previousSalesData.totalSales)}%`,
            isUp: salesData.totalSales >= previousSalesData.totalSales,
            icon: '/assets/Icon.svg',
            tooltip: 'Sales this month',
          },
          {
            title: 'Total Orders',
            value: Number(salesData.totalOrders || 0).toLocaleString(),
            change: `${calculateChange(salesData.totalOrders, previousSalesData.totalOrders)}%`,
            isUp: salesData.totalOrders >= previousSalesData.totalOrders,
            icon: '/assets/Icon (1).svg',
            tooltip: 'Orders this week',
          },
          {
            title: 'Total Pending',
            value: Number(salesData.totalPendingOrders || 0).toLocaleString(),
            change: `${calculateChange(salesData.totalPendingOrders, previousSalesData.totalPendingOrders)}%`,
            isUp: salesData.totalPendingOrders >= previousSalesData.totalPendingOrders,
            icon: '/assets/Icon (2).svg',
            tooltip: 'Pending orders',
          },
          {
            title: 'Total Users',
            value: Number(totalUsers || 0).toLocaleString(),
            change: '0%',
            isUp: true,
            icon: '/assets/Icon (3).svg',
            tooltip: 'Active users',
          },
        ]);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setSummaries([
          { title: 'Total Sales', value: '$0', change: '0%', isUp: true, icon: '/assets/Icon.svg', tooltip: 'Sales this month' },
          { title: 'Total Orders', value: '0', change: '0%', isUp: true, icon: '/assets/Icon (1).svg', tooltip: 'Orders this week' },
          { title: 'Total Pending', value: '0', change: '0%', isUp: true, icon: '/assets/Icon (2).svg', tooltip: 'Pending orders' },
          { title: 'Total Users', value: '0', change: '0%', isUp: true, icon: '/assets/Icon (3).svg', tooltip: 'Active users' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    // JSX remains unchanged
    <div className="bg-gray-100 p-0 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaries.map((summary, index) => (
          <div
            key={index}
            className="relative bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[140px] w-full flex flex-col"
            data-tooltip-id={`tooltip-${index}`}
            data-tooltip-content={summary.tooltip}
          >
            <div className="flex items-start justify-between space-x-3 flex-1">
              <div className="flex-1 space-y-2 overflow-hidden">
                <div className="text-gray-600 font-medium text-sm opacity-80 truncate">
                  {summary.title}
                </div>
                <div className="text-xl font-bold text-gray-800 truncate">
                  {summary.value}
                </div>
                <div className="flex items-center space-x-1 pt-1 overflow-hidden">
                  {summary.isUp ? (
                    <FaArrowTrendUp className="text-green-500 flex-shrink-0 w-4 h-4" />
                  ) : (
                    <FaArrowTrendDown className="text-red-500 flex-shrink-0 w-4 h-4" />
                  )}
                  <span
                    className={`font-bold text-xs ${
                      summary.isUp ? 'text-green-500' : 'text-red-500'
                    } flex-shrink-0`}
                  >
                    {summary.change}
                  </span>
                  <span className="text-gray-500 text-xs truncate">
                    {summary.isUp ? 'Up from' : 'Down from'}{' '}
                    {summary.title === 'Total Sales' ? 'yesterday' : 'last week'}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 pt-1">
                <Image
                  src={summary.icon}
                  alt={`${summary.title} Icon`}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
            </div>
            <Tooltip id={`tooltip-${index}`} place="top" className="text-xs" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;