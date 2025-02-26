import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faTint, faFire, faCloudRain, faSun, faBolt } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Sensor {
  name: string;
  icon: any;
  value: number;
  unit: string;
  color: string;
  maxValue: number;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://primegrow-server.onrender.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://primegrow-server.onrender.com';

const SensorData: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([
    { name: 'Temperature', icon: faTemperatureHigh, value: 0, unit: '°C', color: 'red-600', maxValue: 100 },
    { name: 'Humidity', icon: faTint, value: 0, unit: '%', color: 'teal-500', maxValue: 100 },
    { name: 'Heat Index', icon: faFire, value: 0, unit: '', color: 'pink-500', maxValue: 100 },
    { name: 'Moisture', icon: faCloudRain, value: 0, unit: '%', color: 'green-600', maxValue: 100 },
    { name: 'UV Exposure', icon: faSun, value: 0, unit: '', color: 'yellow-500', maxValue: 10 },
    { name: 'Rain', icon: faBolt, value: 0, unit: '', color: 'blue-600', maxValue: 100 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket(WS_URL);
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      setError(null);
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!(data.pinName && data.state)) {
          updateSensorsFromData(data);
          setLastUpdated(new Date(data.timestamp || Date.now()).toLocaleTimeString());
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    socket.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code}, ${event.reason}`);
      setIsConnected(false);
      setError('WebSocket connection lost');
      resetSensorsToZero();
      setTimeout(connectWebSocket, 5000);
    };
    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setIsConnected(false);
      setError('WebSocket connection failed');
      resetSensorsToZero();
    };
    return socket;
  }, [WS_URL]);

  const fetchInitialData = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) {
      console.log('No authentication token found');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/sensor-data/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateSensorsFromData(response.data);
      setLastUpdated(new Date(response.data.timestamp).toLocaleTimeString());
    } catch (err: any) {
      console.error('Error fetching initial sensor data:', err.response?.data || err.message);
      setError(`Failed to load initial sensor data: ${err.response?.statusText || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchInitialData();
    const socket = connectWebSocket();
    return () => socket.close();
  }, [connectWebSocket, fetchInitialData]);

  const updateSensorsFromData = (data: any) => {
    setSensors((prevSensors) =>
      prevSensors.map((sensor) => ({
        ...sensor,
        value:
          sensor.name === 'Temperature' ? (data.TP ?? 0) :
          sensor.name === 'Humidity' ? (data.HM ?? 0) :
          sensor.name === 'Heat Index' ? (data.HI ?? 0) :
          sensor.name === 'Moisture' ? (data.MO ?? 0) :
          sensor.name === 'UV Exposure' ? (data.UV ?? 0) :
          sensor.name === 'Rain' ? (data.RN ?? 0) : sensor.value,
      }))
    );
  };

  const resetSensorsToZero = () => {
    setSensors((prevSensors) => prevSensors.map((sensor) => ({ ...sensor, value: 0 })));
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchInitialData();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full"
      />
    </div>
  );

  return (
    // JSX remains unchanged
    <div className="p-0 w-full min-h-screen overflow-x-hidden bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="p-0 max-w-6xl mx-auto w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">IoT Sensor Dashboard</h2>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
              <span className={`inline-block w-2 h-2 ml-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'} animate-pulse`}></span>
            </span>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center"
          >
            {error} - Displaying default values
          </motion.div>
        )}

        <div className="mb-6 text-center text-gray-600 text-sm">
          Last Updated: {lastUpdated || 'Never'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor, index) => {
            const valueString = sensor.value.toFixed(1);

            return (
              <motion.div
                key={sensor.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={sensor.icon} className={`w-10 h-10 text-${sensor.color}`} />
                  <span className="ml-3 text-xl font-semibold text-gray-800 truncate">{sensor.name}</span>
                </div>
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <defs>
                      <linearGradient id={`gradient-${sensor.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: `#${sensor.color.split('-')[1]}`, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: `#${sensor.color.split('-')[1]}80`, stopOpacity: 0.5 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2.8"
                    />
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={`url(#gradient-${sensor.name})`}
                      strokeWidth="2.8"
                      strokeDasharray="100"
                      strokeDashoffset={100 - (sensor.value / sensor.maxValue) * 100}
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - (sensor.value / sensor.maxValue) * 100 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                    <text x="18" y="18" textAnchor="middle" className="text-lg sm:text-xl font-bold text-gray-800">
                      {valueString}
                    </text>
                    <text x="18" y="24" textAnchor="middle" className="text-xs text-gray-600">
                      {sensor.unit}
                    </text>
                  </svg>
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-${sensor.color} opacity-10`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ filter: 'blur(10px)' }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <span className="text-base sm:text-lg font-medium text-gray-700">
                    {`${((sensor.value / sensor.maxValue) * 100).toFixed(0)}%`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SensorData;