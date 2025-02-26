import { useEffect, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loading from './Loading';
import Notification from './Notification';
import SummaryCard from './SummaryCard';
import { motion } from 'framer-motion';

interface WeekData {
  amount: number;
  percent: number;
}

interface WeeklyReport {
  expected: {
    week1: WeekData;
    week2: WeekData;
    week3: WeekData;
    week4: WeekData;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://primegrow-server.onrender.com';

const DashboardSummary = () => {
  const [reportData, setReportData] = useState<WeeklyReport['expected']>({
    week1: { amount: 0, percent: 0 },
    week2: { amount: 0, percent: 0 },
    week3: { amount: 0, percent: 0 },
    week4: { amount: 0, percent: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setNotification(null);

      const token = Cookies.get('token');
      if (!token) {
        setReportData({
          week1: { amount: 0, percent: 0 },
          week2: { amount: 0, percent: 0 },
          week3: { amount: 0, percent: 0 },
          week4: { amount: 0, percent: 0 },
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/plant-report`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200 && response.data.length > 0) {
          setReportData(response.data[0].expected);
        } else {
          setReportData({
            week1: { amount: 0, percent: 0 },
            week2: { amount: 0, percent: 0 },
            week3: { amount: 0, percent: 0 },
            week4: { amount: 0, percent: 0 },
          });
          setNotification({ type: 'error', message: 'No report data available' });
        }
      } catch (error: any) {
        console.error('Error fetching report data:', error);
        const errorMsg = error.response?.data?.message || 'Failed to fetch report data';
        setNotification({ type: 'error', message: errorMsg });
        setReportData({
          week1: { amount: 0, percent: 0 },
          week2: { amount: 0, percent: 0 },
          week3: { amount: 0, percent: 0 },
          week4: { amount: 0, percent: 0 },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  const getProgressColor = (percent: number) => {
    if (percent < 50) return 'bg-red-500';
    if (percent < 80) return 'bg-yellow-500';
    if (percent <= 100) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getLimitedPercent = (percent: number) => (percent > 100 ? 100 : percent);

  return (
    // JSX remains unchanged
    <div className="bg-gray-100 p-0 w-full h-full mb-8">
      <h1 className="text-[#202224] font-bold text-3xl leading-tight tracking-tight font-dm-sans mb-8 text-center">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['week1', 'week2', 'week3', 'week4'].map((week, index) => (
          <motion.div
            key={week}
            className="relative w-full bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">{`Week ${index + 1} Productivity`}</span>
              <span className="text-lg font-semibold text-gray-800">
                {`${reportData[week as keyof WeeklyReport['expected']].percent}%`}
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute h-3 rounded-full ${getProgressColor(
                  reportData[week as keyof WeeklyReport['expected']].percent
                )} transition-all duration-500 ease-in-out`}
                style={{
                  width: `${getLimitedPercent(
                    reportData[week as keyof WeeklyReport['expected']].percent
                  )}%`,
                }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <SummaryCard />
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default DashboardSummary;