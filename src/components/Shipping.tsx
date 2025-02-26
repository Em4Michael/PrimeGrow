'use client';
import React, { useState } from 'react';
import Input from './Input'; // Adjust the path as needed
import Button from './Button'; // Adjust the path as needed

const ShippingDetails: React.FC = () => {
  const [addressLine1, setAddressLine1] = useState('123');
  const [streetName, setStreetName] = useState('Electric Avenue');
  const [postcode, setPostcode] = useState('ABC - 123');
  const [deliveryMethod, setDeliveryMethod] = useState('Express delivery');

  const handleSubmit = () => {
    // Handle form submission or any other action
    console.log('Shipping details submitted');
  };

  return (
    <div className="w-full h-full relative bg-white">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl h-auto p-2 bg-[#F7FCF9] rounded-lg mx-auto ">
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900">Shipping Details</h2>
          <div className="space-y-2">
            <p className="text-sm md:text-base font-medium text-gray-500">First line of address</p>
            <Input 
              value={addressLine1} 
              onChange={(e) => setAddressLine1(e.target.value)} 
              className="bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900" 
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm md:text-base font-medium text-gray-500">Street name</p>
            <Input 
              value={streetName} 
              onChange={(e) => setStreetName(e.target.value)} 
              className="bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900" 
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
            <Input 
              value={postcode} 
              onChange={(e) => setPostcode(e.target.value)} 
              className="w-full md:w-[45%] bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900" 
            />
            <Input 
              value={deliveryMethod} 
              onChange={(e) => setDeliveryMethod(e.target.value)} 
              className="w-full md:w-[50%] bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900" 
            />
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
