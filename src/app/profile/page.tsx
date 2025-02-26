'use client';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Loading from '../../components/Loading';

const Profile: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6">
            <h1 className="text-2xl font-bold text-white">User Profile</h1>
            <p className="text-green-100 text-sm mt-1">Manage your account details</p>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="space-y-4">
              <ProfileField label="Username" value={user?.name} />
              <ProfileField label="Email" value={user?.email} />
              <ProfileField label="Phone Number" value={user?.phoneNumber} />
              <ProfileField label="Role" value={user?.role} />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={logout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                Logout
              </button>
              <button
                onClick={() => router.push('/profile/edit')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

// Reusable Profile Field Component
const ProfileField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-200">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800">{value || 'Not set'}</span>
  </div>
);

export default Profile;