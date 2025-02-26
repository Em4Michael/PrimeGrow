'use client';
import React, { useState, useEffect } from 'react';
import TopNavbar from '../../components/NavBarHome';
import Footer from '../../components/Footer';
import HealthForm from '../../components/HealthForm';
import ProductivityForm from '../../components/ProductivityForm';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Report: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'productivity' | 'health'>('productivity');
  const { user } = useAuth();
  const router = useRouter();
  const [navbarKey, setNavbarKey] = useState(Date.now());

   useEffect(() => {
    const checkUserRole = () => {
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
      } else if (user.role !== 'admin') {
        router.push('/'); // Redirect non-admins
      }
    };
    
    if (user !== null) {
      checkUserRole(); // Only check if user is loaded
    }
  }, [user, router]); 

  useEffect(() => {
    // Set a new key for the navbar component to trigger a re-render
    setNavbarKey(Date.now());
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar key={navbarKey} />

      {/* Toggle Buttons */}
      <div className="flex mt-[100px] justify-center items-center w-full bg-gray-100">
        <div className="md:w-[60vw] max-w-screen-lg w-full flex">
          <div
            onClick={() => setActiveTab('productivity')}
            className={`relative flex-1 flex flex-col justify-center items-center p-4 cursor-pointer ${
              activeTab === 'productivity' ? 'bg-green-50' : 'bg-white'
            }`}
          >
            <span className={`text-lg font-bold ${activeTab === 'productivity' ? 'text-green-700' : 'text-gray-700'}`}>
              Productivity
            </span>
            {activeTab === 'productivity' && (
              <div className="absolute bottom-0 w-full h-1 bg-green-800 rounded-t-full"></div>
            )}
          </div>

          <div
            onClick={() => setActiveTab('health')}
            className={`relative flex-1 flex flex-col justify-center items-center p-4 cursor-pointer ${
              activeTab === 'health' ? 'bg-green-50' : 'bg-white'
            }`}
          >
            <span className={`text-lg font-bold ${activeTab === 'health' ? 'text-green-700' : 'text-gray-700'}`}>
              Health
            </span>
            {activeTab === 'health' && (
              <div className="absolute bottom-0 w-full h-1 bg-green-800 rounded-t-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Rendering of Forms */}
      <div className="flex-grow p-4 flex justify-center items-center">
        <div className="md:w-[60vw] max-w-screen-lg w-full flex">
          {activeTab === 'productivity' ? <ProductivityForm /> : <HealthForm />}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Report;
