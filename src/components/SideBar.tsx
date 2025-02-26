// Sidebar.tsx
'use client';
import React, { useState } from 'react';
import { FaChartBar, FaUsers, FaClock, FaCogs, FaHome, FaTractor, FaUserClock } from 'react-icons/fa';
import Image from 'next/image';

const Sidebar: React.FC<{
  isOpen: boolean;
  toggleSidebar: () => void;
  onMenuItemClick: (component: string) => void;
}> = ({ isOpen, toggleSidebar, onMenuItemClick }) => {
  const [activeItem, setActiveItem] = useState<string>('default');

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
    onMenuItemClick(item);
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen bg-white shadow-lg z-20 transition-all duration-300"
      style={{ width: isOpen ? '16rem' : '3rem' }}
    >
      <div className={`py-6 pl-1 flex ${isOpen ? 'items-center' : 'flex-col'}`}>
        <div className="flex items-center cursor-pointer">
          <Image src="/assets/logo2.png" alt="logo" width={40} height={40} />
          <h1
            className={`text-xl font-bold ml-0 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Prime Grow
          </h1>
        </div>
        <button
          onClick={toggleSidebar}
          className={`text-2xl font-bold ${isOpen ? 'ml-4' : 'mt-4 ml-0'}`}
        >
          ☰
        </button>
      </div>

      <nav className="flex flex-col mt-4 space-y-2">
        <MenuItem
          isOpen={isOpen}
          label="Dashboard"
          icon={<FaHome />}
          active={activeItem === 'default'}
          onClick={() => handleMenuItemClick('default')}
        />
                <MenuItem
          isOpen={isOpen}
          label="Sales Dashboard"
          icon={<FaChartBar />}
          active={activeItem === 'SalesDashboard'}
          onClick={() => handleMenuItemClick('SalesDashboard')}
        />
        <MenuItem
          isOpen={isOpen}
          label="Farm Dashboard"
          icon={<FaTractor />}
          active={activeItem === 'FarmDashboard'}
          onClick={() => handleMenuItemClick('FarmDashboard')}
        />
        <MenuItem
          isOpen={isOpen}
          label="Workers Attendance"
          icon={<FaUserClock />}
          active={activeItem === 'WorkersAttendance'}
          onClick={() => handleMenuItemClick('WorkersAttendance')}
        />
        <MenuItem
          isOpen={isOpen}
          label="Alerts"
          icon={<FaUsers />}
          active={activeItem === 'Alert'}
          onClick={() => handleMenuItemClick('Alert')}
        />
        <MenuItem
          isOpen={isOpen}
          label="Notifications"
          icon={<FaClock />}
          active={activeItem === 'Notification'}
          onClick={() => handleMenuItemClick('Notification')}
        />
        <MenuItem
          isOpen={isOpen}
          label="Settings"
          icon={<FaCogs />}
          active={activeItem === 'Setting'}
          onClick={() => handleMenuItemClick('Setting')}
        />
      </nav>
    </aside>
  );
};

const MenuItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  isOpen: boolean;
  onClick: () => void;
}> = ({ label, icon, active = false, isOpen, onClick }) => {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer ${
        active ? 'bg-green-700 text-white' : 'text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {icon}
      {isOpen && <span className="ml-2">{label}</span>}
    </div>
  );
};

export default Sidebar;