import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface AlertProps {
  message: string;
  time: string;
  isCritical?: boolean;
}

const Alert: React.FC<AlertProps> = ({ message, time, isCritical }) => {
  return (
    <div className={`flex p-4 rounded-lg items-start gap-4 ${isCritical ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'} border-l-4`}>
      <FaExclamationTriangle className={`text-${isCritical ? 'red-600' : 'yellow-600'} text-xl`} />
      <div className="flex-1 min-w-0">
        {/* Ensure the parent has min-width 0 for truncate to work */}
        <div
          className={`text-base font-medium ${isCritical ? 'text-red-600' : 'text-gray-900'} truncate`}
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
        >
          {message}
        </div>
        <div className="text-xs text-gray-500">
          {time}
        </div>
      </div>
    </div>
  );
};

export default Alert;
