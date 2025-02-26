'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Payment from './Payment';
import ProductSummary from './FullSummary';
import Loading from '../components/Loading'; // Import Loading component
import Notification from '../components/Notification'; // Import Notification component

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State for loading
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null); // State for notification

  const handleCancelOrder = () => {
    router.push('/shipping'); // Navigate back to the shipping page
  };

  const handleCompletePayment = async () => {
    setLoading(true); // Show loading
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
      router.push('/complete'); // Navigate to the completion page
      setNotification({ type: 'success', message: 'Payment completed successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to complete payment.' });
    } finally {
      setLoading(false); // Hide loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between mt-[80px]">
      {/* Process Indicator */}
      <div className="w-full p-4 md:max-w-6xl md:mx-auto">
        <div className="flex items-center justify-start space-x-8">
          <div className="flex items-center">
            <div className="w-4 h-4 flex items-center justify-center bg-[#257009] text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-2 text-[#257009]">Shipping</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 flex items-center justify-center bg-[#257009] text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-2 text-[#257009]">Payment</span>
          </div>
        </div>
      </div>

      {/* Payment and Summary Sections */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-2">
        {/* Payment Details Section */}
        <div>
          <Payment />
        </div>

        {/* Product Summary Section */}
        <div>
          <ProductSummary />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-white border-t border-gray-200 flex justify-end space-x-4 sticky bottom-0">
        <button
          onClick={handleCancelOrder}
          className="w-32 px-4 py-2 bg-gray-500 text-white rounded hover:bg-red-600"
        >
          Cancel Order
        </button>
        <button
          onClick={handleCompletePayment}
          className="w-32 px-4 py-2 bg-[#257009] text-white rounded"
        >
          Pay
        </button>
      </div>

      {/* Show Loading and Notification Components */}
      {loading && <Loading />}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default PaymentPage;
