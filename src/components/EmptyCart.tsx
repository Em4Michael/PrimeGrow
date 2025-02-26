'use client';
import React from 'react';
import Button from './Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

const EmptyCart: React.FC = () => {
  const router = useRouter(); // Initialize the router

  const handleContinueShopping = () => {
    router.push('/home'); // Navigate to /home
  };

  return (
    <div className="p-4">
      <div className="w-full h-full p-6 bg-white rounded-lg flex flex-col justify-center items-center gap-6 mt-[100px]">
        <div className="w-full flex flex-col justify-start items-start gap-1">
          <div className="text-2xl font-medium text-gray-900">Your cart</div>
        </div>
        <div className="relative flex justify-center md:justify-start">
          <Image
            src="/assets/nocart.png" // Replace with your image path
            alt="Category 1"
            width={450}
            height={450}
            className="relative z-10 mb-4 cursor-pointer"
          />
        </div>
        {/* New Content Below Image */}
        <div className="flex flex-col items-center justify-center gap-4 mt-4 text-center md:flex-row md:text-left">
          <div className="text-gray-700">
            <p>Your cart is currently empty. Start adding items to your cart and they will appear here.</p>
          </div>
        </div>
        <Button
          type='button' // Change from 'submit' to 'button'
          className='w-full max-w-lg py-3 mt-3 bg-[#336C36] text-white text-base font-semibold rounded-full'
          onClick={handleContinueShopping} // Attach the click handler
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default EmptyCart;
