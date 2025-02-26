import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Cookies from 'js-cookie';

interface AttendanceRecord {
  _id?: string;
  Date: string;
  Time: string;
  Access: string | null;
  Exit: string | null;
  timestamp: string;
}

const WorkersAttendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [displayData, setDisplayData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof AttendanceRecord>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const recordsPerPage = 20;

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://primegrow-server.onrender.com';
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://primegrow-server.onrender.com';

  const applyFiltersAndSort = useCallback((data: AttendanceRecord[]) => {
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
  }, [startDate, endDate, page, sortField, sortOrder]);

  const fetchAttendanceData = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000 },
      });

      const data = response.data.map((record: any) => ({
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
  }, [API_URL, applyFiltersAndSort]);

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket(WS_URL);
    socket.onopen = () => console.log('WebSocket connected for attendance');
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'attendance' && message.Date && message.Time) {
          const newRecord: AttendanceRecord = {
            Date: message.Date,
            Time: message.Time,
            Access: message.Access ?? null,
            Exit: message.Exit ?? null,
            timestamp: message.timestamp || new Date().toISOString(),
          };
          setAttendanceData((prev) => {
            const updatedData = [newRecord, ...prev.filter((d) => d.timestamp !== newRecord.timestamp)];
            applyFiltersAndSort(updatedData);
            return updatedData;
          });
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    socket.onclose = () => console.log('WebSocket disconnected');
    socket.onerror = (err) => console.error('WebSocket error:', err);
    return socket;
  }, [WS_URL, applyFiltersAndSort]);

  useEffect(() => {
    fetchAttendanceData();
    const socket = connectWebSocket();
    return () => socket.close();
  }, [fetchAttendanceData, connectWebSocket]);

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

  useEffect(() => {
    applyFiltersAndSort(attendanceData);
  }, [attendanceData, applyFiltersAndSort]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-0 w-full min-h-screen overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800">Workers Attendance</h2>
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

        <div className="mb-6flex flex-col sm:flex-row justify-between items-center gap-4">
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