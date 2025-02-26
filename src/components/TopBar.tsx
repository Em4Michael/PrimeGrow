// TopBar.tsx
'use client';
import React from 'react';
import { FaSearch, FaBell, FaCog } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';

const TopBar: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 bg-white shadow-lg z-10 transition-all duration-300 border-b border-gray-200`}
      style={{ marginLeft: isSidebarOpen ? '16rem' : '3rem' }}
    >
      <div className="flex justify-between items-center h-full px-6 max-w-7xl mx-auto">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-full max-w-sm shadow-inner">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-600 w-full px-2 text-sm"
          />
          <FaSearch className="text-gray-500" />
        </div>

        <div className="flex items-center space-x-6">
          <button className="relative text-gray-600 hover:text-green-600 transition-colors">
            <FaBell />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
          </button>
          <button className="text-gray-600 hover:text-green-600 transition-colors">
            <FaCog />
          </button>
          <button
            className="text-gray-600 hover:text-green-600 transition-colors"
            onClick={() => router.push('/profile')}
          >
            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;