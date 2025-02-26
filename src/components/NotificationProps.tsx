import React from 'react';
import Notification from '../components/NotificationAlert'; // Assuming NotificationAlert is your notification component

const NotificationProp: React.FC = () => {
  const alerts = [
    {
      message: 'New user signup',
      time: 'Just now'
    },
    {
      message: (
        <>
          Order confirmation and payment receipt<br />
          Michael Brown ordered 75 lbs of Plum Tomatoes.
        </>
      ),
      time: '59 minutes ago'
    },
    {
      message: 'New productivity report submitted by Farm Worker Lucy',
      time: '12 hours ago'
    },
    {
      message: 'Sensor data updates',
      time: 'Today, 11:59 AM'
    },
    {
      message: 'Security breaches or unauthorized access',
      time: 'Today, 11:59 AM'
    },
  ];

  return (
    <div className="p-4 space-y-4 mt-0 sm:mt-6">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <div className="space-y-2 w-full mx-auto">
        {alerts.map((alert, index) => (
          <Notification key={index} message={alert.message} time={alert.time} />
        ))}
      </div>
    </div>
  );
};

export default NotificationProp;
