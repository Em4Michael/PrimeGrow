'use client';
import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import Loading from './Loading';
import Notification from './Notification';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://primegrow-server.onrender.com';

const HealthForm: React.FC = () => {
  const [pest, setPest] = useState(false);
  const [disease, setDisease] = useState(false);
  const [defects, setDefects] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const healthData = {
      pest,
      disease,
      defects,
      description,
    };

    setIsLoading(true);
    setNotification(null);

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await axios.post(
        `${API_URL}/api/plant-report/health`,
        healthData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setNotification({ type: 'success', message: 'Health report submitted successfully!' });
        setPest(false);
        setDisease(false);
        setDefects(false);
        setDescription('');
      } else {
        setNotification({ type: 'error', message: 'Failed to submit health report' });
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMsg = error.response?.data?.message || 'Server error, please try again later.';
      setNotification({ type: 'error', message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // JSX remains unchanged
    <div className="w-full h-full relative bg-white">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl h-auto p-2 bg-[#F7FCF9] rounded-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900">Update Plant’s Health</h2>

          <div className="space-y-2">
            <p className="text-sm md:text-base font-medium text-gray-500">Pest</p>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={pest}
                onChange={(e) => setPest(e.target.checked)}
                className="h-5 w-5 rounded-lg bg-[#E2F0E2]"
              />
              <span className="text-base font-medium text-gray-900">Pest present</span>
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm md:text-base font-medium text-gray-500">Disease</p>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={disease}
                onChange={(e) => setDisease(e.target.checked)}
                className="h-5 w-5 rounded-lg bg-[#E2F0E2]"
              />
              <span className="text-base font-medium text-gray-900">Disease present</span>
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm md:text-base font-medium text-gray-500">Defects</p>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={defects}
                onChange={(e) => setDefects(e.target.checked)}
                className="h-5 w-5 rounded-lg bg-[#E2F0E2]"
              />
              <span className="text-base font-medium text-gray-900">Defects present</span>
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm md:text-base font-medium text-gray-500">Overall Health Status</p>
            <textarea
              placeholder="Provide an overview of the plant's health..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-28 bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900"
            />
          </div>

          <Button
            type="submit"
            className="w-full max-w-lg py-3 mt-3 bg-[#336C36] text-white text-base font-semibold rounded-full"
          >
            Update Health
          </Button>
        </form>
      </div>

      {isLoading && <Loading />}
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

export default HealthForm;