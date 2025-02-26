import React from 'react';
import Alert from '../components/AlertProps';

const AlertsPage: React.FC = () => {
  const alerts = [
    { message: 'System errors or downtime', time: 'Just now' },
    { message: 'Productivity report submitted by Admin', time: '59 minutes ago' },
    { message: 'Unusual temperature levels', time: '12 hours ago' },
    { message: 'Security breaches or unauthorized access', time: 'Today, 11:59 AM' },
    { message: 'Soil moisture below threshold in Zone 2A', time: 'Today, 11:59 AM' },
    { message: 'Device malfunction or connection issue', time: 'Today, 11:59 AM' },
  ];

  return (
    <div className="p-4 space-y-4 mt-0 sm:mt-6">
      <h1 className="text-2xl font-semibold mb-4">Alerts</h1>
      <div className="space-y-2 w-full mx-auto"> {/* Set max-width for larger width */}
        {alerts.map((alert, index) => (
          <Alert key={index} message={alert.message} time={alert.time} />
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
  