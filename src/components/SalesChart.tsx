import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SalesReport: React.FC = () => {
  // Pie chart data (Sales by Region)
  const pieData = {
    labels: ['North', 'East', 'West', 'South', 'Central'],
    datasets: [
      {
        label: 'Sales by Region',
        data: [300, 50, 100, 80, 120],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // Bar chart data (Sales by Individual)
  const barData = {
    labels: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    datasets: [
      {
        label: 'Sales by Individual',
        data: [150, 200, 100, 250, 300],
        backgroundColor: '#4C9A30',
        borderColor: '#4C9A30',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-2 m-4 w-[90%]">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Sales Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sales by Region (Pie Chart) */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="mb-4 text-lg font-medium text-gray-700">Sales by Region</h3>
          <div className="h-72">
            <Pie data={pieData} />
          </div>
        </div>

        {/* Sales by Individual (Bar Chart) */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="mb-4 text-lg font-medium text-gray-700">Sales by Individual</h3>
          <div className="h-72">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
