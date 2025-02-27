// WorkersAttendance.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useWebSocket } from '../util/websocketService';

interface AttendanceRecord {
  _id?: string;
  Date: string;
  Time: string;
  Access: string | null;
  Exit: string | null;
  timestamp: string;
}

interface WorkersAttendanceProps {
  isSidebarOpen: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://primegrow-server.onrender.com';

const WorkersAttendance: React.FC<WorkersAttendanceProps> = ({ isSidebarOpen }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [displayData, setDisplayData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof AttendanceRecord>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const recordsPerPage = 20;

  const { isConnected, data: wsData, send } = useWebSocket();

  const applyFiltersAndSort = useCallback(
    (data: AttendanceRecord[]) => {
      let result = [...data];

      if (startDate || endDate) {
        result = result.filter((record) => {
          const recordDate = new Date(record.timestamp);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          if (start && end) return recordDate >= start && recordDate <= end;
          if (start) return recordDate >= start;
          if (end) return recordDate <= end;
          return true;
        });
      }

      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortField === 'timestamp') {
          const aDate = aValue ? new Date(aValue) : new Date(0);
          const bDate = bValue ? new Date(bValue) : new Date(0);
          return sortOrder === 'asc'
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        return sortOrder === 'asc'
          ? String(aValue ?? '').localeCompare(String(bValue ?? ''))
          : String(bValue ?? '').localeCompare(String(aValue ?? ''));
      });

      setFilteredData(result);
      setDisplayData(result.slice((page - 1) * recordsPerPage, page * recordsPerPage));
    },
    [startDate, endDate, page, sortField, sortOrder]
  );

  const fetchAttendanceData = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get<AttendanceRecord[]>(`${API_URL}/api/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000 },
      });

      const data = response.data.map((record) => ({
        ...record,
        timestamp: record.timestamp || new Date().toISOString(),
      }));
      setAttendanceData(data);
      applyFiltersAndSort(data);
    } catch (err: any) {
      setError(`Failed to fetch attendance data: ${err.response?.statusText || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [applyFiltersAndSort]);

  // Handle WebSocket messages
  useEffect(() => {
    if (wsData && wsData.type === 'attendance' && wsData.Date && wsData.Time) {
      const newRecord: AttendanceRecord = {
        Date: wsData.Date, // Now correctly typed
        Time: wsData.Time, // Now correctly typed
        Access: wsData.Access ?? null, // Now correctly typed
        Exit: wsData.Exit ?? null, // Now correctly typed
        timestamp:
          typeof wsData.timestamp === 'number'
            ? new Date(wsData.timestamp).toISOString() // Convert number to string
            : wsData.timestamp || new Date().toISOString(), // Use string or default
      };
      setAttendanceData((prev) => {
        const updatedData = [newRecord, ...prev.filter((d) => d.timestamp !== newRecord.timestamp)];
        applyFiltersAndSort(updatedData);
        return updatedData;
      });
    }
  }, [wsData, applyFiltersAndSort]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleSort = (field: keyof AttendanceRecord) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    applyFiltersAndSort(attendanceData);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    applyFiltersAndSort(attendanceData);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="p-0 max-w-6xl mx-auto w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Workers Attendance{' '}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
              <span
                className={`inline-block w-2 h-2 ml-2 rounded-full ${
                  isConnected ? 'bg-green-600' : 'bg-red-600'
                } animate-pulse`}
              ></span>
            </span>
          </h2>
          <button
            onClick={fetchAttendanceData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('Date')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Sort by Date {sortField === 'Date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('timestamp')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Sort by Time {sortField === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Access</th>
                <th className="p-4">Exit</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((record, index) => (
                <motion.tr
                  key={record._id || `${record.Date}-${record.Time}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{record.Date}</td>
                  <td className="p-4">{record.Time}</td>
                  <td className="p-4 text-green-600">{record.Access || 'N/A'}</td>
                  <td className="p-4 text-red-600">{record.Exit || 'N/A'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayData.length === 0 && (
          <div className="text-center py-4 text-gray-600">No attendance records found for the selected range.</div>
        )}

        {filteredData.length > recordsPerPage && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="py-2">Page {page} of {Math.ceil(filteredData.length / recordsPerPage)}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page * recordsPerPage >= filteredData.length}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WorkersAttendance;