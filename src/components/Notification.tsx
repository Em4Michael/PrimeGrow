import React from 'react';

type NotificationProps = {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
};

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-80 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
