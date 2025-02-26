'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';

const Complete: React.FC = () => {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/home'); // Navigate to the home page
  };

  return (
    <div className="p-4">
      <div className="w-full h-full p-6 bg-white rounded-lg flex flex-col justify-center items-center gap-6 mt-[100px]">
        <div className="w-[277px] text-gray-900 text-lg font-normal leading-7 tracking-wide break-words">
          Thank You For Your Purchase
        </div>
        <div className="text-gray-900 text-2xl font-medium leading-7 break-words">
          Order #123RGR231567Y Confirmed
        </div>
        <Button
          type="submit"
          onClick={handleContinueShopping} // Add click handler here
          className="w-full max-w-lg py-3 mt-3 bg-[#336C36] text-white text-base font-semibold rounded-full"
        >
          Continue Shopping
        </Button>
        <div className="px-2 py-4 rounded-md flex justify-start items-start gap-2 mt-4">
          <div className="text-gray-500 text-lg font-normal leading-7 tracking-wide break-words">
            Generate Receipt
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complete;
