// Dashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar';
import TopNavbar from '../../components/TopBar';
import DashboardSummary from '../../components/DashboardSummary';
import SensorData from '../../components/SensorData';
import SalesDashboard from '../../components/SalesDashboard';
import InstrumentControl from '../../components/InstrumentControl';
import Alert from '../../components/Alert';
import Notification from '../../components/NotificationProps';
import WorkersAttendance from '../../components/WorkersAttendance'; // New component
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('default');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) return;
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'superadmin') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'default':
        return (
          <div className="space-y-0 md:space-y-0 lg:space-y-0">
            <DashboardSummary />
            <SensorData />
          </div>
        );
      case 'FarmDashboard':
        return (
          <div className="space-y-0">
            <SensorData />
            <InstrumentControl />
          </div>
        );
      case 'WorkersAttendance':
        return <WorkersAttendance />;
      case 'SalesDashboard':
        return <SalesDashboard />;
      case 'Alert':
        return <Alert />;
      case 'Notification': 
        return <Notification />;
      default:
        return (
          <div className="space-y-0 md:space-y-0 lg:space-y-0">
            <DashboardSummary />
            <SensorData />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onMenuItemClick={setActiveComponent}
      />

      <div className="flex-1 flex flex-col">
        <TopNavbar isSidebarOpen={isSidebarOpen} />

        <main
          className="flex-1 overflow-y-auto p-2 transition-all duration-300"
          style={{
            marginLeft: isSidebarOpen && window.innerWidth >= 768 ? '16rem' : '3rem',
            marginTop: '4rem',
          }}
        >
          <div className="w-full max-w-7xl mx-auto">
            {renderComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;   