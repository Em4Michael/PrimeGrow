import React, { useState, useEffect } from 'react';
import { FaDoorClosed, FaSprayCan, FaFan, FaLightbulb, FaWater } from 'react-icons/fa';
import { MdOutlineWindow } from 'react-icons/md';
import { motion } from 'framer-motion';
import axios from 'axios';
import Cookies from 'js-cookie';

type ToggleKey = 'E_Door' | 'E_motor_Down' | 'E_pest' | 'E_Fan' | 'E_Light' | 'E_Humidifier' | 'E_Pump';

const InstrumentControl: React.FC = () => {
  const [toggleStates, setToggleStates] = useState<Record<ToggleKey, boolean>>({
    E_Door: false,
    E_motor_Down: false,
    E_pest: false,
    E_Fan: false,
    E_Light: false,
    E_Humidifier: false,
    E_Pump: false,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const instruments = [
    { label: 'Door', stateKey: 'E_Door' as ToggleKey, icon: <FaDoorClosed className="text-3xl" /> },
    { label: 'Window', stateKey: 'E_motor_Down' as ToggleKey, icon: <MdOutlineWindow className="text-3xl" /> },
    { label: 'Pesticide', stateKey: 'E_pest' as ToggleKey, icon: <FaSprayCan className="text-3xl" /> },
    { label: 'Fan', stateKey: 'E_Fan' as ToggleKey, icon: <FaFan className="text-3xl" /> },
    { label: 'Light', stateKey: 'E_Light' as ToggleKey, icon: <FaLightbulb className="text-3xl" /> },
    { label: 'Humidifier', stateKey: 'E_Humidifier' as ToggleKey, icon: <FaFan className="text-3xl" /> },
    { label: 'Pump', stateKey: 'E_Pump' as ToggleKey, icon: <FaWater className="text-3xl" /> },
  ];

  const connectWebSocket = () => {
    const socket = new WebSocket('ws://192.168.0.3:5000/');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        if (data.pinName && data.state) {
          setToggleStates((prev) => ({
            ...prev,
            [data.pinName]: data.state === 'on',
          }));
          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code}, ${event.reason}`);
      setIsConnected(false);
      setError('WebSocket connection lost');
      setTimeout(connectWebSocket, 5000);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setIsConnected(false);
      setError('WebSocket connection failed');
    };

    return socket;
  };

  const fetchInitialStates = async () => {
    const token = Cookies.get('token');
    if (!token) {
      console.log('No authentication token found');
      return;
    }

    try {
      const promises = instruments.map(async (instrument) => {
        const response = await axios.get(`http://localhost:5000/api/pin-state/${instrument.stateKey}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return { key: instrument.stateKey, state: response.data.state === 'on' };
      });
      const states = await Promise.all(promises);
      const newStates = states.reduce((acc, { key, state }) => ({ ...acc, [key]: state }), {} as Record<ToggleKey, boolean>);
      setToggleStates((prev) => ({ ...prev, ...newStates }));
    } catch (err: any) {
      console.error('Error fetching initial pin states:', err.response?.data || err.message);
      setError(`Failed to load initial states: ${err.response?.statusText || err.message}`);
    }
  };

  useEffect(() => {
    fetchInitialStates();
    const socket = connectWebSocket();
    return () => socket.close();
  }, []);

  const handleToggle = async (key: ToggleKey) => {
    if (!isConnected) {
      setError('Cannot toggle: WebSocket not connected');
      return;
    }

    const newState = !toggleStates[key];
    const socket = new WebSocket('ws://192.168.0.3:5000/');
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'toggle', pinName: key }));
      setToggleStates((prev) => ({ ...prev, [key]: newState }));
      socket.close();

      const token = Cookies.get('token');
      if (token) {
        axios.post(
          'http://localhost:5000/api/toggle',
          { pinName: key, state: newState ? 'on' : 'off' },
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch((err) => console.error('Error syncing pin state:', err));
      }
    };
  };

  return (
    <div className="p-0 w-full min-h-screen overflow-x-hidden bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-5xl mx-auto w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">Instrument Control</h2>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
              <span className={`inline-block w-2 h-2 ml-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'} animate-pulse`}></span>
            </span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="mb-6 text-center text-gray-600 text-sm">
          Last Updated: {lastUpdated || 'Never'}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {instruments.map((instrument) => {
            const isActive = toggleStates[instrument.stateKey];
            return (
              <motion.div
                key={instrument.stateKey}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center bg-white border ${
                  isActive ? 'border-green-300' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center mb-4">
                  {React.cloneElement(instrument.icon, {
                    className: `text-3xl ${isActive ? 'text-green-600' : 'text-gray-600'}`,
                  })}
                  <span className="ml-3 text-lg font-semibold text-gray-800 truncate">{instrument.label}</span>
                </div>
                <motion.button
                  onClick={() => handleToggle(instrument.stateKey)}
                  disabled={!isConnected}
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center focus:outline-none ${
                    isActive
                      ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-inner'
                      : 'bg-gradient-to-br from-gray-200 to-gray-300'
                  } ${!isConnected ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  whileTap={{ scale: isConnected ? 0.95 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span
                    className="text-white text-sm font-bold"
                    animate={{ y: isActive ? 2 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isActive ? 'ON' : 'OFF'}
                  </motion.span>
                  <motion.div
                    className={`absolute inset-0 rounded-full ${isActive ? 'bg-green-500 opacity-20' : 'bg-gray-400 opacity-10'}`}
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ filter: 'blur(10px)' }}
                  />
                </motion.button>
                <span className={`mt-3 text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default InstrumentControl;