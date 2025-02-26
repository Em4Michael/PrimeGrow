import React from 'react';
import { FaBell } from 'react-icons/fa';

interface NotificationProps {
  message: React.ReactNode;  // Supporting JSX in message
  time: string;
  isImportant?: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, time, isImportant }) => {
  return (
    <div className={`flex p-4 rounded-lg items-start gap-4 ${isImportant ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'} border-l-4`}>
      <FaBell className={`text-${isImportant ? 'blue-600' : 'gray-600'} text-xl`} />
      <div className="flex-1 min-w-0">
        <div className={`text-base font-medium ${isImportant ? 'text-blue-600' : 'text-gray-900'} truncate`}>
          {message} {/* JSX content support */}
        </div>
        <div className="text-xs text-gray-500">
          {time}
        </div>
      </div>
    </div>
  );
};

export default Notification;
